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

// import Select from "react-select";

const allMemos = createSelector(
  [(state) => state.memo.allIds, (state) => state.memo.byId],
  (allIds, byId) => {
    return allIds
      .map((id) => byId[id])
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
      });
  }
);

const allProjects = createSelector(
  [(state) => state.project.allIds, (state) => state.project.byId],
  (allIds, byId) => {
    return allIds.map((id) => byId[id]);
  }
);

const AllMemos = () => {
  const { theme } = useTheme();
  const dispatch = useDispatch();

  const [notStartedMemos, setNotStartedMemos] = useState([]);
  const [activeMemos, setActiveMemos] = useState([]);
  const [pendingMemos, setPendingMemos] = useState([]);
  const [completedMemos, setCompletedMemos] = useState([]);
  const [cancelledMemos, setCancelledMemos] = useState([]);

  const memos = useSelector(allMemos);
  const projects = useSelector(allProjects);

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
  const [memoProgress, setMemoProgress] = useState("");
  const [memoProjects, setMemoProjects] = useState([]);

  const [showEllipsis, setShowEllipsis] = useState(false);

  const [lastUpdate, setLastUpdate] = useState(Date.now());
  const [projectMemos, setProjectMemos] = useState([]);
  const [memoBody, setMemoBody] = useState("");
  const [memoDueDate, setMemoDueDate] = useState();
  const [memoParentId, setMemoParentId] = useState("");

  const inputRef = useRef(null);
  const submemoRef = useRef(null);
  const calendarRefs = useRef({});

  const options = [
    { value: "Not Started", label: "Not Started" },
    { value: "Active", label: "Active" },
    { value: "Pending", label: "Pending" },
    { value: "Completed", label: "Completed" },
    { value: "Cancelled", label: "Cancelled" },
  ];
  const [projectOptions, setProjectOptions] = useState([]);

  //   console.log("memoProjects", memoProjects);
  //   console.log("options:", options);
  //   console.log("projectOptions:", projectOptions);

  useEffect(() => {
    dispatch(fetchAllMemos());
  }, [dispatch, lastUpdate]);

  useEffect(() => {
    const projectList = projects.map((project) => ({
      value: project._id,
      label: project.name,
    }));
    setProjectOptions(projectList);
  }, [projects]);

  useEffect(() => {
    const notStarted = [];
    const active = [];
    const pending = [];
    const completed = [];
    const cancelled = [];

    memos.forEach((memo) => {
      if (memo.progress === "Not Started") {
        notStarted.push(memo);
      } else if (memo.progress === "Active") {
        active.push(memo);
      } else if (memo.progress === "Pending") {
        pending.push(memo);
      } else if (memo.progress === "Completed") {
        completed.push(memo);
      } else if (memo.progress === "Cancelled") {
        cancelled.push(memo);
      }
    });
    setNotStartedMemos(notStarted);
    setActiveMemos(active);
    setPendingMemos(pending);
    setCompletedMemos(completed);
    setCancelledMemos(cancelled);
  }, [memos]);

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

  // const toggleMemoProgress = async (memo) => {
  //   const updatedProgress =
  //     memo.progress === "Completed" ? "Not Started" : "Completed";
  //   const updatedMemo = { ...memo, progress: updatedProgress };
  //   try {
  //     await dispatch(updateMemo({ formData: updatedMemo, memoId: memo._id }));
  //     dispatch(fetchAllMemos());
  //     setSelectedMemo((prevMemo) => ({
  //       ...prevMemo,
  //       progress: updatedProgress,
  //     }));
  //   } catch (error) {
  //     console.error("Error updating memo:", error);
  //   }
  // };

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
          createMemo({
            body: newSubMemoText,
            parentId: memo._id,
            project: memo.project._id,
          })
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

  // const updateNotes = async (memo) => {
  //   const updatedMemo = {
  //     ...memo,
  //     notes: memoNotes,
  //   };
  //   try {
  //     await dispatch(updateMemo({ formData: updatedMemo, memoId: memo._id }));
  //     dispatch(fetchAllMemos());
  //     setSelectedMemo((prevMemo) => ({
  //       ...prevMemo,
  //       notes: memoNotes,
  //     }));
  //   } catch (error) {
  //     console.error("Error updating memo notes:", error);
  //   }
  // };

  // const updateProgress = async (selectedOption) => {
  //   const updatedMemo = {
  //     ...selectedMemo,
  //     progress: selectedOption[0].value,
  //   };
  //   setMemoProgress(selectedOption[0].value);
  //   try {
  //     await dispatch(
  //       updateMemo({
  //         formData: updatedMemo,
  //         memoId: selectedMemo._id,
  //       })
  //     );
  //     dispatch(fetchAllMemos());
  //     setSelectedMemo((prevMemo) => ({
  //       ...prevMemo,
  //       progress: selectedOption[0].value,
  //     }));
  //   } catch (error) {
  //     console.error("Error updating progress:", error);
  //   }
  // };

  // const updateProject = async (selectedOption) => {
  //   const updatedProjects = selectedOption.length
  //     ? selectedOption.map((option) => option.value)
  //     : null;
  //   const updatedMemo = {
  //     ...selectedMemo,
  //     project: updatedProjects,
  //   };
  //   setMemoProjects(selectedOption);
  //   try {
  //     await dispatch(
  //       updateMemo({
  //         formData: updatedMemo,
  //         memoId: selectedMemo._id,
  //       })
  //     );
  //     dispatch(fetchAllMemos());
  //     setSelectedMemo((prevMemo) => ({
  //       ...prevMemo,
  //       project: updatedProjects,
  //     }));
  //   } catch (error) {
  //     console.error("Error updating project:", error);
  //   }
  // };

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
    // const originalProjectId = selectedMemo.project._id;
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
      ).unwrap();

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

  // const toggleMemoModal = async (memo) => {
  //   setSelectedMemo(memo);
  //   setMemoNotes(memo.notes);
  //   setMemoProgress(options.find((option) => option.value === memo.progress));
  //   setMemoProjects(
  //     memo.project
  //       ? [{ value: memo.project._id, label: memo.project.name }]
  //       : []
  //   );
  //   setShowMemoModal(true);
  //   try {
  //     const res = await dispatch(fetchChildrenMemos(memo._id)).unwrap();
  //     setSubmemos(res.children);
  //   } catch (error) {
  //     console.error("Error fetching children memos:", error);
  //   }
  // };

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
    setSelectedMemo(null);
  };

  const addMemoBtn = () => {
    toggleMemoModal();
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
      <Row
        style={{
          padding: "0px 20px 20px 20px",
          gap: "20px",
          height: "100%",
        }}
      >
        <Col
          style={{
            padding: "10px 20px 20px 20px",
            borderRadius: "12px",
            background:
              "linear-gradient(180deg, rgba(245,244,243,1) 0%, rgba(255,255,255,0) 100%)",
            overflow: "scroll",
          }}
        >
          <Row>
            <Col style={{ paddingBottom: "10px" }}>
              <div style={{ fontSize: "1.2rem", fontWeight: "600" }}>
                Not Started
              </div>
            </Col>
          </Row>
          <Row>
            <Col style={{ paddingBottom: "10px" }}>
              <button
                style={{
                  border: "1px solid",
                  borderRadius: "8px",
                  backgroundColor: "transparent",
                }}
                onClick={handleAddClick}
              >
                + Add Memo
              </button>
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
                  className="form-control"
                  onBlur={createMemoClick}
                />
              </Col>
            </Row>
          )}
          <Row>
            <Col>
              <ul>
                {notStartedMemos.map((memo) => (
                  <li
                    key={memo.id}
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
                            value={
                              memo.dueDateTime
                                ? parseISO(memo.dueDateTime)
                                : null
                            }
                            calendarType={"gregory"}
                          />
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </Col>
          </Row>
        </Col>
        <Col
          style={{
            padding: "10px 20px 20px 20px",
            borderRadius: "12px",
            background:
              "linear-gradient(180deg, rgba(245,244,243,1) 0%, rgba(255,255,255,0) 100%)",
            overflow: "scroll",
          }}
        >
          <Row>
            <Col style={{ paddingBottom: "10px" }}>
              <div style={{ fontSize: "1.2rem", fontWeight: "600" }}>
                Active
              </div>
            </Col>
          </Row>
          {/* <Row>
            <Col style={{ paddingBottom: "10px" }}>
              <button
                style={{
                  border: "1px solid",
                  borderRadius: "8px",
                  backgroundColor: "transparent",
                }}
                onClick={handleAddClick}
              >
                + Add Memo
              </button>
            </Col>
          </Row> */}
          {/* {newMemoLine && (
            <Row>
              <Col>
                <input
                  ref={inputRef}
                  type="text"
                  vlue={newMemoText}
                  onChange={(e) => setNewMemoText(e.target.value)}
                  placeholder="Type new memo here..."
                  className="form-control"
                  onBlur={createMemoClick}
                />
              </Col>
            </Row>
          )} */}
          <Row>
            <Col>
              <ul>
                {activeMemos.map((memo) => (
                  <li
                    key={memo.id}
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
                            value={
                              memo.dueDateTime
                                ? parseISO(memo.dueDateTime)
                                : null
                            }
                            calendarType={"gregory"}
                          />
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </Col>
          </Row>
        </Col>
        <Col
          style={{
            padding: "10px 20px 20px 20px",
            borderRadius: "12px",
            background:
              "linear-gradient(180deg, rgba(245,244,243,1) 0%, rgba(255,255,255,0) 100%)",
            overflow: "scroll",
          }}
        >
          <Row>
            <Col style={{ paddingBottom: "10px" }}>
              <div style={{ fontSize: "1.2rem", fontWeight: "600" }}>
                Pending
              </div>
            </Col>
          </Row>
          {/* <Row>
            <Col style={{ paddingBottom: "10px" }}>
              <button
                style={{
                  border: "1px solid",
                  borderRadius: "8px",
                  backgroundColor: "transparent",
                }}
                onClick={handleAddClick}
              >
                + Add Memo
              </button>
            </Col>
          </Row> */}
          {/* {newMemoLine && (
            <Row>
              <Col>
                <input
                  ref={inputRef}
                  type="text"
                  vlue={newMemoText}
                  onChange={(e) => setNewMemoText(e.target.value)}
                  placeholder="Type new memo here..."
                  className="form-control"
                  onBlur={createMemoClick}
                />
              </Col>
            </Row>
          )} */}
          <Row>
            <Col>
              <ul>
                {pendingMemos.map((memo) => (
                  <li
                    key={memo.id}
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
                            value={
                              memo.dueDateTime
                                ? parseISO(memo.dueDateTime)
                                : null
                            }
                            calendarType={"gregory"}
                          />
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </Col>
          </Row>
        </Col>
        <Col
          style={{
            padding: "10px 20px 20px 20px",
            borderRadius: "12px",
            background:
              "linear-gradient(180deg, rgba(245,244,243,1) 0%, rgba(255,255,255,0) 100%)",
            overflow: "scroll",
          }}
        >
          <Row>
            <Col style={{ paddingBottom: "10px" }}>
              <div style={{ fontSize: "1.2rem", fontWeight: "600" }}>
                Cancelled
              </div>
            </Col>
          </Row>
          {/* <Row>
            <Col style={{ paddingBottom: "10px" }}>
              <button
                style={{
                  border: "1px solid",
                  borderRadius: "8px",
                  backgroundColor: "transparent",
                }}
                onClick={() => addMemoBtn()}
              >
                + Add Memo
              </button>
            </Col>
          </Row> */}
          <Row>
            <Col>
              <ul>
                {cancelledMemos.map((memo) => (
                  <li
                    key={memo.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      width: "100%",
                      textDecoration: "line-through",
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
                            value={
                              memo.dueDateTime
                                ? parseISO(memo.dueDateTime)
                                : null
                            }
                            calendarType={"gregory"}
                          />
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </Col>
          </Row>
        </Col>
        <Col
          style={{
            padding: "10px 20px 20px 20px",
            borderRadius: "12px",
            background:
              "linear-gradient(180deg, rgba(245,244,243,1) 0%, rgba(255,255,255,0) 100%)",
            overflow: "scroll",
          }}
        >
          <Row>
            <Col style={{ paddingBottom: "10px" }}>
              <div style={{ fontSize: "1.2rem", fontWeight: "600" }}>
                Completed
              </div>
            </Col>
          </Row>
          <Row>
            <Col>
              <ul>
                {completedMemos.map((memo) => (
                  <li
                    key={memo.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      width: "100%",
                    }}
                  >
                    <MdCheckBox
                      onClick={() => checkboxToggle(memo, memo._id)}
                      style={{ color: "green" }}
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
                            value={
                              memo.dueDateTime
                                ? parseISO(memo.dueDateTime)
                                : null
                            }
                            calendarType={"gregory"}
                          />
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  );
};

export default AllMemos;
