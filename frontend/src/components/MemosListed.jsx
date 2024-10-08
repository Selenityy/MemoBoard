"use client";

import React, { useEffect, useRef, useState } from "react";
import { Row, Col, Container } from "react-bootstrap";
import { MdCheckBoxOutlineBlank } from "react-icons/md";
import { MdCheckBox } from "react-icons/md";
import { createSelector } from "reselect";
import { useSelector, useDispatch } from "react-redux";
import { useTheme } from "@/context/ThemeContext";
import {
  fetchAllMemos,
  fetchMemo,
  fetchChildrenMemos,
  updateMemo,
  createMemo,
  deleteMemo,
  fetchMemos,
} from "@/redux/features/memoSlice";
import { format, parseISO, isToday, isPast, compareAsc } from "date-fns";
import { IoMdAdd } from "react-icons/io";
import Calendar from "react-calendar";
import { CiCalendar } from "react-icons/ci";
import "react-calendar/dist/Calendar.css";
import Modal from "react-bootstrap/Modal";
import Select from "react-dropdown-select";
import MemoDetailsModal from "./MemoDetailsModal";

const allProjects = createSelector(
  [(state) => state.project.allIds, (state) => state.project.byId],
  (allIds, byId) => {
    return allIds.map((id) => byId[id]);
  }
);

const MemosListed = ({
  project,
  setProjectMemos,
  projectMemos,
  setMemoProjects,
  memoProjects,
}) => {
  // console.log("passed memo projects:", memoProjects);
  const { theme } = useTheme();
  const dispatch = useDispatch();
  const projectId = project._id;
  //   const [projectMemos, setProjectMemos] = useState([]);

  const submemoRef = useRef(null);
  const calendarRefs = useRef({});

  const [showCalendar, setShowCalendar] = useState({});
  const [showBigCalendar, setShowBigCalendar] = useState({});

  const [showMemoModal, setShowMemoModal] = useState(false);
  const [selectedMemo, setSelectedMemo] = useState(null);
  const [memoBody, setMemoBody] = useState("");
  const [memoDueDate, setMemoDueDate] = useState();
  const [memoNotes, setMemoNotes] = useState("");
  const [memoProgress, setMemoProgress] = useState("");
  //   const [memoProjects, setMemoProjects] = useState([]);
  const [memoParentId, setMemoParentId] = useState("");

  const [showEllipsis, setShowEllipsis] = useState(false);

  const projects = useSelector(allProjects);

  const [submemos, setSubmemos] = useState([]);
  const [newMemoLine, setNewMemoLine] = useState(false);
  const [newMemoText, setNewMemoText] = useState("");
  const [newSubMemoLine, setNewSubMemoLine] = useState(false);
  const [newSubMemoText, setNewSubMemoText] = useState("");

  const options = [
    { value: "Not Started", label: "Not Started" },
    { value: "Active", label: "Active" },
    { value: "Pending", label: "Pending" },
    { value: "Completed", label: "Completed" },
    { value: "Cancelled", label: "Cancelled" },
  ];
  const [projectOptions, setProjectOptions] = useState([]);

  // console.log("selected memo:", selectedMemo);

  //   useEffect(() => {
  //     dispatch(fetchMemos());
  //   }, [dispatch]);

  // set all the ongoing projects as the options for the dropdown
  useEffect(() => {
    const projectList = projects.map((project) => ({
      value: project._id,
      label: project.name,
    }));
    setProjectOptions(projectList);
  }, [projects]);

  // grab all memos for the specific project
  //   useEffect(() => {
  //     const getProjectParentMemos = async () => {
  //       try {
  //         const memos = await dispatch(fetchMemos()).unwrap();
  //         const filteredMemos = memos.filter(
  //           (memo) => memo.project && memo.project._id === projectId
  //         );
  //         setProjectMemos(filteredMemos);
  //         setMemoProjects(project);
  //         // setProjectOptions(projects);
  //       } catch (error) {
  //         console.error("Error getting a project's parent memos:", error);
  //       }
  //     };
  //     getProjectParentMemos();
  //   }, [dispatch, projectId]);

  //MODAL TOGGLE
  const toggleMemoModal = async (memo) => {
    setSelectedMemo(memo);
    setMemoBody(memo.body);
    setMemoNotes(memo.notes || "");
    setMemoDueDate(memo.dueDateTime || "");
    setMemoParentId(memo.parentId || "");

    const foundProgress = options.find(
      (option) => option.value === memo.progress
    );
    setMemoProgress(foundProgress || options[0]);

    // setMemoProgress(options.find((option) => option.value === memo.progress));
    setMemoProjects(
      memo.project
        ? [{ value: memo.project._id, label: memo.project.name }]
        : []
    );
    if (showMemoModal === false) {
      setShowMemoModal(true);
    }
    try {
      const res = await dispatch(fetchChildrenMemos(memo._id)).unwrap();
      setSubmemos(res.children || []);
    } catch (error) {
      console.error("Error fetching children memos:", error);
    }
  };

  const handleClose = () => {
    setShowMemoModal(false);
    setShowBigCalendar(false);
    setSelectedMemo(null);
  };

  //CHECKBOX
  const checkboxToggle = async (memo, memoId) => {
    const updatedMemo = {
      ...memo,
      progress: "Active",
    };
    try {
      await dispatch(updateMemo({ formData: updatedMemo, memoId: memo._id }));
      dispatch(fetchAllMemos());
    } catch (error) {
      console.error("Error updating memo:", error);
    }
  };

  //CALENDAR
  const toggleCalendar = (id) => {
    setShowCalendar((prevState) => {
      const newState = { ...prevState, [id]: !prevState[id] };
      return newState;
    });
  };

  const toggleBigCalendar = (id) => {
    setShowBigCalendar((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      Object.keys(calendarRefs.current).forEach((id) => {
        if (
          calendarRefs.current[id] &&
          !calendarRefs.current[id].contains(event.target)
        ) {
          setShowCalendar((prevState) => ({
            ...prevState,
            [id]: false,
          }));
        }
      });
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const changeDueDate = async (date, memo) => {
    // set up the updated memo structure to pass to the backend
    const updatedMemo = {
      ...memo,
      dueDateTime: date.toISOString(),
    };
    setMemoDueDate(date.toISOString());
    try {
      // update the selected memo via the backend
      await dispatch(updateMemo({ formData: updatedMemo, memoId: memo._id }));

      // then update the selected memo within the modal
      setSelectedMemo((prevMemo) => ({
        ...prevMemo,
        dueDateTime: updatedMemo.dueDateTime,
      }));

      // then update the memos listed in the project page
      setProjectMemos((prevMemos) => {
        return prevMemos.map((m) => {
          if (m._id === memo.id) {
            return { ...m, dueDateTime: date.toISOString() };
          }
          return m;
        });
      });
    } catch (error) {
      console.error("Error updating memo due date/time:", error);
    }
  };

  const clearDueDate = async (memo) => {
    // set up the updated memo structure to pass to the backend
    const updatedMemo = {
      ...memo,
      dueDateTime: null,
    };
    try {
      // update the selected memo via the backend
      await dispatch(updateMemo({ formData: updatedMemo, memoId: memo._id }));

      // then update the selected memo within the modal
      setSelectedMemo((prevMemo) => ({
        ...prevMemo,
        dueDateTime: null,
      }));

      // then update the memos listed in the project page
      setProjectMemos((prevMemos) => {
        return prevMemos.map((m) => {
          if (m._id === memo.id) {
            return { ...m, dueDateTime: null };
          }
          return m;
        });
      });
    } catch (error) {
      console.error("Error clearing memo due date/time:", error);
    }
  };

  //UPDATES
  const updateBody = async (memo) => {
    // set up the updated memo structure to pass to the backend
    const updatedMemo = {
      ...memo,
      body: memoBody,
    };
    try {
      // update the selected memo via the backend
      await dispatch(updateMemo({ formData: updatedMemo, memoId: memo._id }));

      // then update the selected memo within the modal
      setSelectedMemo((prevMemo) => ({
        ...prevMemo,
        body: memoBody,
      }));

      // then update the memos listed in the project page
      setProjectMemos((prevMemos) => {
        return prevMemos.map((m) => {
          if (m._id === memo.id) {
            return { ...m, body: memoBody };
          }
          return m;
        });
      });
    } catch (error) {
      console.error("Error updating memo body:", error);
    }
  };

  const updateNotes = async (memo) => {
    // set up the updated memo structure to pass to the backend
    const updatedMemo = {
      ...memo,
      notes: memoNotes,
    };
    try {
      // update the selected memo via the backend
      await dispatch(updateMemo({ formData: updatedMemo, memoId: memo._id }));

      // then update the selected memo within the modal
      setSelectedMemo((prevMemo) => ({
        ...prevMemo,
        notes: memoNotes,
      }));

      // then update the memos listed in the project page
      setProjectMemos((prevMemos) => {
        return prevMemos.map((m) => {
          if (m._id === memo.id) {
            return { ...m, notes: memoNotes };
          }
          return m;
        });
      });
    } catch (error) {
      console.error("Error updating memo notes:", error);
    }
  };

  const updateProgress = async (selectedOption) => {
    // set up the updated memo structure to pass to the backend
    const memoId = selectedMemo._id;
    const updatedMemo = {
      ...selectedMemo,
      progress: selectedOption[0].value,
    };
    setMemoProgress({
      value: selectedOption[0].value,
      label: selectedOption[0].label,
    });
    try {
      // update the selected memo via the backend
      await dispatch(
        updateMemo({
          formData: updatedMemo,
          memoId,
        })
      );

      // then update the selected memo within the modal
      setSelectedMemo((prevMemo) => ({
        ...prevMemo,
        progress: selectedOption[0].value,
      }));

      // then update the memos listed in the project page
      setProjectMemos((prevMemos) => {
        return prevMemos.map((m) => {
          if (m._id === memoId) {
            return { ...m, progress: selectedOption[0].value };
          }
          return m;
        });
      });
    } catch (error) {
      console.error("Error updating progress:", error);
    }
  };

  const toggleMemoProgress = async (memo) => {
    // set up the updated memo structure to pass to the backend
    const updatedProgress =
      memo.progress === "Completed" ? "Not Started" : "Completed";
    const updatedMemo = { ...memo, progress: updatedProgress };
    try {
      // update the selected memo via the backend
      await dispatch(updateMemo({ formData: updatedMemo, memoId: memo._id }));

      // then update the selected memo within the modal
      setSelectedMemo((prevMemo) => ({
        ...prevMemo,
        progress: updatedProgress,
      }));

      // then update the memos listed in the project page
      setProjectMemos((prevMemos) => {
        return prevMemos.map((m) => {
          if (m._id === memo.id) {
            return { ...m, progress: updatedProgress };
          }
          return m;
        });
      });
    } catch (error) {
      console.error("Error updating memo:", error);
    }
  };

  const updateProject = async (selectedOption) => {
    // set up the updated memo structure to pass to the backend
    const memoId = selectedMemo._id;
    const originalProjectId = selectedMemo.project._id;
    const updatedProject = selectedOption.length
      ? {
          _id: selectedOption[0].value,
          name: selectedOption[0].label,
        }
      : null;

    const updatedMemo = {
      ...selectedMemo,
      project: updatedProject ? updatedProject._id : null,
    };
    setMemoProjects({
      _id: selectedOption[0].value,
      name: selectedOption[0].label,
    });

    try {
      // update the selected memo via the backend
      await dispatch(
        updateMemo({
          formData: updatedMemo,
          memoId,
        })
      );

      // then update the selected memo within the modal
      setSelectedMemo((prevMemo) => ({
        ...prevMemo,
        project: updatedProject,
      }));

      // Fetch all memos again to reflect the updated project list
      const memos = await dispatch(fetchMemos()).unwrap();
      const filteredMemos = memos.filter(
        (memo) =>
          memo.project &&
          memo.project._id === originalProjectId &&
          memo._id !== memoId
      );

      setProjectMemos(filteredMemos);
    } catch (error) {
      console.error("Error updating project:", error);
    }
  };

  //SUBMEMO
  const createSubMemoClick = async (memo) => {
    if (!newSubMemoText.trim()) {
      setNewSubMemoLine(false);
    } else {
      try {
        const parentMemo = await dispatch(fetchMemo(memo._id));
        const formData = {
          body: newSubMemoText,
          parentId: memo._id,
          project: parentMemo.project ? parentMemo.project : undefined,
        };
        await dispatch(createMemo(formData));
        await dispatch(fetchAllMemos());
        const res = await dispatch(fetchChildrenMemos(memo._id)).unwrap();
        setSubmemos(res.children);
        setNewSubMemoText("");
        setNewSubMemoLine(false);
      } catch (error) {
        console.error("Error creating submemo:", error);
      }
    }
  };

  const handleSubMemoAddClick = () => {
    setNewSubMemoLine(true);
    setNewSubMemoText("");
  };

  //MEMO CRUD
  const handleAddClick = () => {
    setNewMemoLine(true);
    setNewMemoText("");
  };

  const clickEllipsis = () => {
    setShowEllipsis((prevState) => !prevState);
  };

  const clickDeleteMemo = async (memo) => {
    try {
      await dispatch(deleteMemo(memo._id));
      dispatch(fetchAllMemos());
      setSelectedMemo(null);
      handleClose();
    } catch (error) {
      console.error("Error deleting memo:", error);
    }
  };

  return (
    <>
      {showMemoModal && selectedMemo && (
        <MemoDetailsModal
          selectedMemo={selectedMemo}
          showMemoModal={showMemoModal}
          handleClose={handleClose}
          toggleMemoProgress={toggleMemoProgress}
          clickEllipsis={clickEllipsis}
          showEllipsis={showEllipsis}
          clickDeleteMemo={clickDeleteMemo}
          toggleMemoModal={toggleMemoModal}
          setMemoBody={setMemoBody}
          updateBody={updateBody}
          toggleBigCalendar={toggleBigCalendar}
          showBigCalendar={showBigCalendar}
          clearDueDate={clearDueDate}
          calendarRefs={calendarRefs}
          changeDueDate={changeDueDate}
          updateProgress={updateProgress}
          projectOptions={projectOptions}
          memoProjects={memoProjects}
          updateProject={updateProject}
          memoNotes={memoNotes}
          memoBody={memoBody}
          setMemoNotes={setMemoNotes}
          updateNotes={updateNotes}
          options={options}
          memoProgress={memoProgress}
          handleSubMemoAddClick={handleSubMemoAddClick}
          newSubMemoLine={newSubMemoLine}
          submemoRef={submemoRef}
          setNewSubMemoText={setNewSubMemoText}
          submemos={submemos}
          createSubMemoClick={createSubMemoClick}
        />
      )}
      <ul>
        {projectMemos.map((memo) => (
          <li
            key={memo._id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              width: "100%",
            }}
          >
            <MdCheckBoxOutlineBlank
              onClick={() => checkboxToggle(memo, memo._id)}
            />
            <ul
              style={{
                flex: 1,
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <li onClick={() => toggleMemoModal(memo)}>{memo.body}</li>
              {memo.dueDateTime && (
                <li
                  onClick={(e) => {
                    e.preventDefault();
                    toggleCalendar(memo._id);
                  }}
                  style={{ color: "grey" }}
                >
                  {format(parseISO(memo.dueDateTime), "MMM d")}
                </li>
              )}
            </ul>
            <div
              ref={(el) => (calendarRefs.current[memo._id] = el)}
              style={{ position: "relative" }}
            >
              {!memo.dueDateTime && (
                <CiCalendar onClick={() => toggleCalendar(memo._id)} />
              )}
              {showCalendar[memo._id] && (
                <div
                  style={{
                    position: "absolute",
                    zIndex: 1000,
                    top: "100%",
                    left: 0,
                  }}
                >
                  <Calendar
                    onChange={(date) => {
                      changeDueDate(date, memo);
                      toggleCalendar(memo._id);
                    }}
                    value={memo.dueDateTime ? parseISO(memo.dueDateTime) : null}
                    calendarType={"gregory"}
                  />
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
    </>
  );
};

export default MemosListed;
