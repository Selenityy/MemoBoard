"use client";

import React, { useEffect, useRef, useState } from "react";
import { Row, Col, Container } from "react-bootstrap";
import { MdCheckBoxOutlineBlank } from "react-icons/md";
import { createSelector } from "reselect";
import { useSelector, useDispatch } from "react-redux";
import { useTheme } from "@/context/ThemeContext";
import {
  fetchAllMemos,
  fetchChildrenMemos,
  updateMemo,
  createMemo,
  deleteMemo,
  fetchMemos,
} from "@/redux/features/memoSlice";
import { updateProject } from "@/redux/features/projectSlice";
import {
  addAllMemosToSection,
  addMemoToSection,
  createSection,
  deleteSection,
  fetchAllSections,
  updateSection,
  removeMemoFromAllSections,
} from "@/redux/features/sectionSlice";
import { format, parseISO, isToday, isPast, compareAsc } from "date-fns";
import { IoMdAdd } from "react-icons/io";
import Calendar from "react-calendar";
import { CiCalendar } from "react-icons/ci";
import "react-calendar/dist/Calendar.css";
import MemoDetailsModal from "./MemoDetailsModal";

const allProjects = createSelector(
  [(state) => state.project.allIds, (state) => state.project.byId],
  (allIds, byId) => {
    return allIds.map((id) => byId[id]);
  }
);

const getUserId = (state) => state.user.user._id;
const getMemos = (state) => state.memo.byId;

const selectedMemos = createSelector([getMemos, getUserId], (memos, userId) =>
  Object.values(memos)
    .filter((memo) => memo.user === userId && memo.progress !== "Completed")
    .filter((memo) => {
      const dueDate = memo.dueDateTime ? parseISO(memo.dueDateTime) : null;
      return !dueDate || !isPast(dueDate) || isToday(dueDate);
    })
    .sort((a, b) => {
      const dateA = a.dueDateTime
        ? parseISO(a.dueDateTime)
        : new Date(9999, 0, 1);
      const dateB = b.dueDateTime
        ? parseISO(b.dueDateTime)
        : new Date(9999, 0, 1);
      if (isToday(dateA) && !isToday(dateB)) return -1;
      if (!isToday(dateA) && isToday(dateB)) return 1;
      return compareAsc(dateA, dateB);
    })
);

// const selectedMemos = createSelector(
//   [(state) => state.memo.allIds, (state) => state.memo.byId],
//   (allIds, byId) => {
//     const uniqueIds = [...new Set(allIds)];
//     return uniqueIds
//       .map((id) => byId[id])
//       .filter((memo) => {
//         const dueDate = memo.dueDateTime ? parseISO(memo.dueDateTime) : null;
//         return (
//           memo.progress !== "Completed" &&
//           (!dueDate || !isPast(dueDate) || isToday(dueDate))
//         );
//       })
//       .sort((a, b) => {
//         const dateA = a.dueDateTime
//           ? parseISO(a.dueDateTime)
//           : new Date(9999, 0, 1);
//         const dateB = b.dueDateTime
//           ? parseISO(b.dueDateTime)
//           : new Date(9999, 0, 1);

//         if (isToday(dateA) && !isToday(dateB)) return -1;
//         if (!isToday(dateA) && isToday(dateB)) return 1;
//         return compareAsc(dateA, dateB);
//       });
//   }
// );

const UpcomingTasks = ({ user }) => {
  const { theme } = useTheme();
  const dispatch = useDispatch();
  const memos = useSelector(selectedMemos);
  // console.log("memos:", memos);
  // console.log("Current User:", user);
  const [submemos, setSubmemos] = useState([]);
  const [newMemoLine, setNewMemoLine] = useState(false);
  const [newMemoText, setNewMemoText] = useState("");
  const [newSubMemoLine, setNewSubMemoLine] = useState(false);
  const [newSubMemoText, setNewSubMemoText] = useState("");
  const [showCalendar, setShowCalendar] = useState({});
  const [showBigCalendar, setShowBigCalendar] = useState({});
  const [showMemoModal, setShowMemoModal] = useState(false);
  const [selectedMemo, setSelectedMemo] = useState(null);
  const [memoNotes, setMemoNotes] = useState("");
  const [showEllipsis, setShowEllipsis] = useState(false);

  const [memoBody, setMemoBody] = useState("");
  const [memoDueDate, setMemoDueDate] = useState();
  const [memoProgress, setMemoProgress] = useState("");
  const [memoProjects, setMemoProjects] = useState([]);
  const [memoParentId, setMemoParentId] = useState("");
  const projects = useSelector(allProjects);
  const options = [
    { value: "Not Started", label: "Not Started" },
    { value: "Active", label: "Active" },
    { value: "Pending", label: "Pending" },
    { value: "Completed", label: "Completed" },
    { value: "Cancelled", label: "Cancelled" },
  ];
  const [projectOptions, setProjectOptions] = useState([]);
  const [projectMemos, setProjectMemos] = useState([]);
  const [lastUpdate, setLastUpdate] = useState(Date.now());
  // console.log("selected memo:", selectedMemo);

  const inputRef = useRef(null);
  const submemoRef = useRef(null);
  const calendarRefs = useRef({});

  useEffect(() => {
    dispatch(fetchAllMemos());
  }, [dispatch, lastUpdate]);

  useEffect(() => {
    if (newMemoLine && inputRef.current) {
      inputRef.current.focus();
    }
  }, [newMemoLine]);

  useEffect(() => {
    const projectList = projects.map((project) => ({
      value: project._id,
      label: project.name,
    }));
    setProjectOptions(projectList);
  }, [projects]);

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

  const checkboxToggle = async (memo) => {
    const updatedMemo = {
      ...memo,
      progress: "Completed",
    };
    try {
      await dispatch(updateMemo({ formData: updatedMemo, memoId: memo._id }));
      dispatch(fetchAllMemos());
    } catch (error) {
      console.error("Error updating memo:", error);
    }
  };

  const checkCompleted = async (memo) => {
    const updatedMemo = {
      ...memo,
      progress: "Completed",
    };
    try {
      await dispatch(updateMemo({ formData: updatedMemo, memoId: memo._id }));
      dispatch(fetchAllMemos());
      setSelectedMemo((prevMemo) => ({
        ...prevMemo,
        progress: updatedMemo.progress,
      }));
    } catch (error) {
      console.error("Error updating memo:", error);
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
      setLastUpdate(Date.now());
    } catch (error) {
      console.error("Error updating memo:", error);
    }
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

  const createMemoClick = async () => {
    if (!newMemoText.trim()) {
      setNewMemoLine(false);
    } else {
      try {
        await dispatch(createMemo({ body: newMemoText, parentId: null }));
        dispatch(fetchAllMemos());
        setNewMemoText("");
        setNewMemoLine(false);
      } catch (error) {
        console.error("Error creating memo:", error);
      }
    }
  };

  const createSubMemoClick = async (memo) => {
    if (!newSubMemoText.trim()) {
      setNewSubMemoLine(false);
    } else {
      try {
        await dispatch(
          createMemo({ body: newSubMemoText, parentId: memo._id })
        );
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

  const handleAddClick = () => {
    setNewMemoLine(true);
    setNewMemoText("");
  };

  const handleSubMemoAddClick = () => {
    setNewSubMemoLine(true);
    setNewSubMemoText("");
  };

  const changeDueDate = async (date, memo) => {
    const updatedMemo = {
      ...memo,
      dueDateTime: date.toISOString(),
    };
    try {
      await dispatch(updateMemo({ formData: updatedMemo, memoId: memo._id }));
      dispatch(fetchAllMemos());
      setSelectedMemo((prevMemo) => ({
        ...prevMemo,
        dueDateTime: updatedMemo.dueDateTime,
      }));
    } catch (error) {
      console.error("Error updating memo due date/time:", error);
    }
  };

  const clearDueDate = async (memo) => {
    const updatedMemo = {
      ...memo,
      dueDateTime: null,
    };
    try {
      await dispatch(updateMemo({ formData: updatedMemo, memoId: memo._id }));
      dispatch(fetchAllMemos());
      setSelectedMemo((prevMemo) => ({
        ...prevMemo,
        dueDateTime: null,
      }));
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
      setLastUpdate(Date.now());
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
      setLastUpdate(Date.now());
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
      setLastUpdate(Date.now());
    } catch (error) {
      console.error("Error updating progress:", error);
    }
  };

  const updateProjectMemos = async (selectedOption) => {
    // set up the updated memo structure to pass to the backend
    const memoId = selectedMemo._id;
    const originalProjectId = selectedMemo.project
      ? selectedMemo.project._id
      : null;
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

    if (updatedMemo.project) {
      setMemoProjects({
        _id: selectedOption[0].value,
        name: selectedOption[0].label,
      });
    } else if (updatedMemo.project === null) {
      setMemoProjects([]);
    }

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

      // Remove memo from old project's sections
      if (originalProjectId && originalProjectId !== updatedProject?._id) {
        await dispatch(
          removeMemoFromAllSections({ projectId: originalProjectId, memoId })
        );
      }

      // Remove memo from old project
      if (originalProjectId && originalProjectId !== updatedProject?._id) {
        await dispatch(
          updateProject({
            projectId: originalProjectId,
            projectData: { removeMemos: [memoId] },
          })
        );
      }

      // Conditionally add memo to new project
      if (updatedProject && originalProjectId !== updatedProject?._id) {
        await dispatch(
          updateProject({
            projectId: updatedProject._id,
            projectData: { addMemos: [memoId] },
          })
        );

        // Find the first section in the new project to add the memo
        const sections = await dispatch(
          fetchAllSections(updatedProject._id)
        ).unwrap();
        if (sections.length > 0) {
          await dispatch(
            addMemoToSection({
              sectionId: sections[0]._id,
              projectId: updatedProject._id,
              memoId,
            })
          );
        }
      }

      // Fetch all memos again to reflect the updated project list
      const memos = await dispatch(fetchMemos()).unwrap();
      const filteredMemos = memos.filter(
        (memo) =>
          memo.project &&
          memo.project._id === originalProjectId &&
          memo._id !== memoId
      );
      setProjectMemos(filteredMemos);
      setLastUpdate(Date.now());
    } catch (error) {
      console.error("Error updating project:", error);
    }
  };

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

  const toggleMemoModal = async (memo) => {
    setSelectedMemo(memo);
    setMemoBody(memo.body || "");
    setMemoNotes(memo.notes || "");
    setMemoDueDate(memo.dueDateTime || "");
    setMemoParentId(memo.parentId || "");

    const foundProgress = options.find(
      (option) => option.value === memo.progress
    );
    setMemoProgress(foundProgress || options[0]);

    const foundProject =
      memo.project &&
      projects.find((p) => p._id === (memo.project._id || memo.project));
    setMemoProjects(
      foundProject
        ? [
            {
              value: foundProject._id,
              label: foundProject.name,
            },
          ]
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
    setShowEllipsis(false);
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
          updateProjectMemos={updateProjectMemos}
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
      <Row className="upcoming-tasks-row">
        <Col xs="auto" className="upcoming-tasks-col">
          <button
            className={
              theme === "dark"
                ? "upcoming-tasks-add-memo-btn-dark"
                : "upcoming-tasks-add-memo-btn-light"
            }
            onClick={handleAddClick}
          >
            <IoMdAdd size={20} className="me-2 upcoming-tasks-add-memo-icon" />
          </button>
        </Col>
        <Col
          className={
            theme === "dark"
              ? "upcoming-tasks-span-dark"
              : "upcoming-tasks-span-light"
          }
        >
          <span>Create Memo</span>
        </Col>
      </Row>
      <Row>
        <Col>
          <hr></hr>
        </Col>
      </Row>
      {newMemoLine && (
        <Row>
          <Col>
            <input
              ref={inputRef}
              type="text"
              vlue={newMemoText}
              onChange={(e) => setNewMemoText(e.target.value)}
              placeholder="Type new memo here..."
              className={
                theme === "dark"
                  ? "upcoming-tasks-new-memo-line-dark"
                  : "upcoming-tasks-new-memo-line-light"
              }
              onBlur={createMemoClick}
            />
          </Col>
        </Row>
      )}
      <div>
        <ul>
          {memos.map((memo) => (
            <li
              key={memo._id}
              className={
                theme === "dark"
                  ? "dashboard-tasks-memos-li-dark"
                  : "dashboard-tasks-memos-li-light"
              }
            >
              <MdCheckBoxOutlineBlank
                onClick={() => checkboxToggle(memo, memo._id)}
              />
              <ul className="dashboard-tasks-memos-ul">
                <li onClick={() => toggleMemoModal(memo)}>{memo.body}</li>
                {memo.dueDateTime && (
                  <li
                    onClick={(e) => {
                      e.preventDefault();
                      toggleCalendar(memo._id);
                    }}
                    style={{
                      cursor: memo.dueDateTime ? "pointer" : "default",
                      color: isToday(parseISO(memo.dueDateTime))
                        ? "green"
                        : "black",
                    }}
                  >
                    {memo.dueDateTime
                      ? isToday(parseISO(memo.dueDateTime))
                        ? "Today"
                        : format(parseISO(memo.dueDateTime), "MMM d")
                      : null}
                  </li>
                )}
              </ul>
              <div
                ref={(el) => (calendarRefs.current[memo._id] = el)}
                // style={{ position: "relative" }}
              >
                {!memo.dueDateTime && (
                  <CiCalendar onClick={() => toggleCalendar(memo._id)} />
                )}
                {showCalendar[memo._id] && (
                  <div
                    // style={{
                    //   position: "absolute",
                    //   zIndex: 1000,
                    //   top: "100%",
                    //   left: 0,
                    // }}
                    className="dashboard-tasks-calendar-div"
                  >
                    <Calendar
                      onChange={(date) => {
                        changeDueDate(date, memo);
                        toggleCalendar(memo._id);
                      }}
                      value={
                        memo.dueDateTime ? parseISO(memo.dueDateTime) : null
                      }
                      calendarType={"gregory"}
                    />
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default UpcomingTasks;
