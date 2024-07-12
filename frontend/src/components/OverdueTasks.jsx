"use client";

import React, { useEffect, useState, useRef } from "react";
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
} from "@/redux/features/memoSlice";
import { format, parseISO, isToday, isPast, compareAsc } from "date-fns";
import { IoMdAdd } from "react-icons/io";
import Calendar from "react-calendar";
import { CiCalendar } from "react-icons/ci";
import "react-calendar/dist/Calendar.css";
import Modal from "react-bootstrap/Modal";
import MemoDetailsModal from "./MemoDetailsModal";

const allProjects = createSelector(
  [(state) => state.project.allIds, (state) => state.project.byId],
  (allIds, byId) => {
    return allIds.map((id) => byId[id]);
  }
);

const selectedOverdueMemos = createSelector(
  [(state) => state.memo.allIds, (state) => state.memo.byId],
  (allIds, byId) => {
    return allIds
      .map((id) => byId[id])
      .filter(
        (memo) =>
          memo.dueDateTime &&
          isPast(parseISO(memo.dueDateTime)) &&
          !isToday(parseISO(memo.dueDateTime)) &&
          memo.progress !== "Completed"
      )
      .sort((a, b) => {
        const dateA = parseISO(a.dueDateTime);
        const dateB = parseISO(b.dueDateTime);
        if (isToday(dateA) && !isToday(dateB)) return -1;
        if (!isToday(dateA) && isToday(dateB)) return 1;
        return compareAsc(dateA, dateB);
      });
  }
);

const OverdueTasks = () => {
  const { theme } = useTheme();
  const dispatch = useDispatch();
  const overdueMemos = useSelector(selectedOverdueMemos);
  const projects = useSelector(allProjects);
  const [submemos, setSubmemos] = useState([]);
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

  const inputRef = useRef(null);
  const submemoRef = useRef(null);
  const calendarRefs = useRef({});

  useEffect(() => {
    dispatch(fetchAllMemos());
  }, [dispatch]);

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

  // const toggleMemoProgress = async (memo) => {
  //   // set up the updated memo structure to pass to the backend
  //   const updatedProgress =
  //     memo.progress === "Completed" ? "Not Started" : "Completed";
  //   const updatedMemo = { ...memo, progress: updatedProgress };
  //   try {
  //     // update the selected memo via the backend
  //     await dispatch(updateMemo({ formData: updatedMemo, memoId: memo._id }));

  //     // then update the selected memo within the modal
  //     setSelectedMemo((prevMemo) => ({
  //       ...prevMemo,
  //       progress: updatedProgress,
  //     }));

  //     // then update the memos listed in the project page
  //     setProjectMemos((prevMemos) => {
  //       return prevMemos.map((m) => {
  //         if (m._id === memo.id) {
  //           return { ...m, progress: updatedProgress };
  //         }
  //         return m;
  //       });
  //     });
  //     setLastUpdate(Date.now());
  //   } catch (error) {
  //     console.error("Error updating memo:", error);
  //   }
  // };

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
    setShowEllipsis(false);
  };

  return (
    <>
      {showMemoModal && selectedMemo && (
        // <Modal
        //   show={showMemoModal}
        //   onHide={handleClose}
        //   size="lg"
        //   aria-labelledby="contained-modal-title-vcenter"
        //   centered
        // >
        //   <Modal.Header closeButton>
        //     <Modal.Title
        //       style={{
        //         fontSize: "0.5rem",
        //         display: "flex",
        //         width: "100%",
        //         justifyContent: "space-between",
        //         alignItems: "center",
        //         paddingRight: "10px",
        //       }}
        //     >
        //       {selectedMemo.progress !== "Completed" ? (
        //         <>
        //           <button
        //             onClick={() =>
        //               checkCompleted(selectedMemo, selectedMemo._id)
        //             }
        //           >
        //             &#10003; Mark Complete
        //           </button>
        //           <div
        //             onClick={clickEllipsis}
        //             style={{ color: "black", fontSize: "1rem" }}
        //           >
        //             ...
        //           </div>
        //         </>
        //       ) : (
        //         <>
        //           <button style={{ backgroundColor: "green" }}>
        //             &#10003; Completed
        //           </button>
        //           <div
        //             onClick={clickEllipsis}
        //             style={{ color: "black", fontSize: "1rem" }}
        //           >
        //             ...
        //           </div>
        //         </>
        //       )}
        //       {showEllipsis && (
        //         <div
        //           onClick={() => clickDeleteMemo(selectedMemo)}
        //           style={{ color: "black" }}
        //         >
        //           Delete
        //         </div>
        //       )}
        //     </Modal.Title>
        //   </Modal.Header>
        //   <Modal.Body>
        //     <Container>
        //       <Row>
        //         <Col>
        //           <textarea
        //             aria-label="Memo Body"
        //             style={{
        //               width: "100%",
        //               height: "40px",
        //               overflow: "hidden",
        //               resize: "none",
        //               padding: "10px",
        //               border: "none",
        //             }}
        //             defaultValue={selectedMemo.body}
        //           />
        //         </Col>
        //       </Row>
        //       <Row>
        //         <Col style={{ padding: "10px 20px 10px 20px" }}>
        //           <div style={{ color: "black" }}>Due Date</div>
        //         </Col>
        //         <Col>
        //           <div
        //             style={{
        //               display: "flex",
        //               alignItems: "center",
        //               gap: "10px",
        //             }}
        //           >
        //             {selectedMemo.dueDateTime ? (
        //               <>
        //                 <div
        //                   style={{ color: "black", cursor: "pointer" }}
        //                   onClick={() => toggleBigCalendar(selectedMemo._id)}
        //                 >
        //                   {format(parseISO(selectedMemo.dueDateTime), "MMM d")}
        //                 </div>
        //                 <div
        //                   style={{
        //                     color: "black",
        //                     fontSize: "1rem",
        //                     cursor: "pointer",
        //                   }}
        //                   onClick={() => clearDueDate(selectedMemo)}
        //                 >
        //                   X
        //                 </div>
        //               </>
        //             ) : (
        //               <CiCalendar
        //                 style={{ color: "black" }}
        //                 onClick={() => toggleBigCalendar(selectedMemo._id)}
        //               />
        //             )}
        //           </div>
        //           <div
        //             ref={(el) => (calendarRefs.current[selectedMemo._id] = el)}
        //             style={{ position: "relative" }}
        //           >
        //             {showBigCalendar[selectedMemo._id] && (
        //               <div
        //                 style={{
        //                   position: "absolute",
        //                   zIndex: 1050,
        //                   top: "100%",
        //                   left: 0,
        //                 }}
        //               >
        //                 <Calendar
        //                   onChange={(date) => {
        //                     changeDueDate(date, selectedMemo);
        //                     toggleBigCalendar(selectedMemo._id);
        //                   }}
        //                   value={
        //                     selectedMemo.dueDateTime
        //                       ? parseISO(selectedMemo.dueDateTime)
        //                       : null
        //                   }
        //                   calendarType={"gregory"}
        //                   style={{ backgroundColor: "white", color: "black" }}
        //                 />
        //               </div>
        //             )}
        //           </div>
        //         </Col>
        //       </Row>
        //       <Row>
        //         <Col>
        //           <div style={{ color: "black" }}>Projects</div>
        //         </Col>
        //         <Col>
        //           <div style={{ color: "black" }}>
        //             list user project associated with the memo
        //           </div>
        //         </Col>
        //       </Row>
        //       <Row>
        //         <Col>
        //           <div style={{ color: "black" }}>Descriptions</div>
        //         </Col>
        //         <Col>
        //           <textarea
        //             style={{ color: "black" }}
        //             placeholder="What is this memo about?"
        //             value={memoNotes}
        //             onChange={(e) => setMemoNotes(e.target.value)}
        //             onBlur={() => updateNotes(selectedMemo)}
        //             onKeyDown={(e) => {
        //               if (e.key === "Enter") {
        //                 updateNotes(selectedMemo);
        //               }
        //             }}
        //           ></textarea>
        //         </Col>
        //       </Row>
        //       <Row>
        //         <Col>
        //           <button onClick={handleSubMemoAddClick}>+ Add submemo</button>
        //         </Col>
        //       </Row>
        //       <Row>
        //         <Col>
        //           {newSubMemoLine && (
        //             <Row>
        //               <Col>
        //                 <input
        //                   ref={submemoRef}
        //                   type="text"
        //                   onChange={(e) => setNewSubMemoText(e.target.value)}
        //                   placeholder="Type new submemo here..."
        //                   className="form-control"
        //                   onBlur={() => createSubMemoClick(selectedMemo)}
        //                 />
        //               </Col>
        //             </Row>
        //           )}
        //         </Col>
        //       </Row>
        //       <Row>
        //         <Col>
        //           <ul>
        //             {submemos.length > 0 &&
        //               submemos.map((submemo) => (
        //                 <li
        //                   key={submemo._id}
        //                   style={{ listStyleType: "circle", color: "black" }}
        //                   onClick={() => toggleMemoModal(submemo)}
        //                 >
        //                   {submemo.progress === "Completed" ? (
        //                     <>
        //                       <span
        //                         style={{
        //                           color: "grey",
        //                           textDecoration: "line-through",
        //                         }}
        //                       >
        //                         {submemo.body}
        //                       </span>
        //                       <span
        //                         style={{
        //                           cursor: submemo.dueDateTime
        //                             ? "pointer"
        //                             : "default",
        //                           color: "grey",
        //                           textDecoration: "line-through",
        //                         }}
        //                       >
        //                         {submemo.dueDateTime
        //                           ? isToday(parseISO(submemo.dueDateTime))
        //                             ? "Today"
        //                             : format(
        //                                 parseISO(submemo.dueDateTime),
        //                                 "MMM d"
        //                               )
        //                           : null}
        //                       </span>
        //                     </>
        //                   ) : (
        //                     <>
        //                       <span style={{ color: "black" }}>
        //                         {submemo.body}
        //                       </span>
        //                       {submemo.dueDateTime !== null && (
        //                         <span
        //                           style={{
        //                             cursor: submemo.dueDateTime
        //                               ? "pointer"
        //                               : "default",
        //                             color: isToday(
        //                               parseISO(submemo.dueDateTime)
        //                             )
        //                               ? "green"
        //                               : "black",
        //                           }}
        //                         >
        //                           {submemo.dueDateTime
        //                             ? isToday(parseISO(submemo.dueDateTime))
        //                               ? "Today"
        //                               : format(
        //                                   parseISO(submemo.dueDateTime),
        //                                   "MMM d"
        //                                 )
        //                             : null}
        //                         </span>
        //                       )}
        //                     </>
        //                   )}
        //                 </li>
        //               ))}
        //           </ul>
        //         </Col>
        //       </Row>
        //     </Container>
        //   </Modal.Body>
        // </Modal>
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
      <div className={theme === "dark" ? "body-dark" : "body-light"}>
        <ul>
          {overdueMemos.map((memo) => (
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
                    style={{ color: "red" }}
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

export default OverdueTasks;
