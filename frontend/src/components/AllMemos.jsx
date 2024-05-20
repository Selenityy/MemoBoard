"use client";

import React, { memo, useEffect, useRef, useState } from "react";
import { Row, Col, Container } from "react-bootstrap";
import { MdCheckBoxOutlineBlank } from "react-icons/md";
import { MdCheckBox } from "react-icons/md";
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

const AllMemos = () => {
  const { theme } = useTheme();
  const dispatch = useDispatch();
  const [notStartedMemos, setNotStartedMemos] = useState([]);
  const [activeMemos, setActiveMemos] = useState([]);
  const [pendingMemos, setPendingMemos] = useState([]);
  const [completedMemos, setCompletedMemos] = useState([]);
  const memos = useSelector(allMemos);
  const [submemos, setSubmemos] = useState([]);
  const [newSubMemoLine, setNewSubMemoLine] = useState(false);
  const [newSubMemoText, setNewSubMemoText] = useState("");
  const [showCalendar, setShowCalendar] = useState({});
  const [showBigCalendar, setShowBigCalendar] = useState({});
  const [showMemoModal, setShowMemoModal] = useState(false);
  const [selectedMemo, setSelectedMemo] = useState(null);
  const [memoNotes, setMemoNotes] = useState("");
  const [showEllipsis, setShowEllipsis] = useState(false);
  const inputRef = useRef(null);
  const submemoRef = useRef(null);
  const calendarRefs = useRef({});

  useEffect(() => {
    dispatch(fetchAllMemos());
  }, [dispatch]);

  useEffect(() => {
    const notStarted = [];
    const active = [];
    const pending = [];
    const completed = [];

    memos.forEach((memo) => {
      if (memo.progress === "Not Started") {
        notStarted.push(memo);
      } else if (memo.progress === "Active") {
        active.push(memo);
      } else if (memo.progress === "Pending") {
        pending.push(memo);
      } else if (memo.progress === "Completed") {
        completed.push(memo);
      }
    });
    setNotStartedMemos(notStarted);
    setActiveMemos(active);
    setPendingMemos(pending);
    setCompletedMemos(completed);
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

  const toggleMemoProgress = async (memo) => {
    const updatedProgress =
      memo.progress === "Completed" ? "Not Started" : "Completed";
    const updatedMemo = { ...memo, progress: updatedProgress };
    try {
      await dispatch(updateMemo({ formData: updatedMemo, memoId: memo._id }));
      dispatch(fetchAllMemos());
      setSelectedMemo((prevMemo) => ({
        ...prevMemo,
        progress: updatedProgress,
      }));
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

  const updateNotes = async (memo) => {
    const updatedMemo = {
      ...memo,
      notes: memoNotes,
    };
    try {
      await dispatch(updateMemo({ formData: updatedMemo, memoId: memo._id }));
      dispatch(fetchAllMemos());
      setSelectedMemo((prevMemo) => ({
        ...prevMemo,
        notes: memoNotes,
      }));
    } catch (error) {
      console.error("Error updating memo notes:", error);
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
    console.log("Memo selected: ", memo);
    setSelectedMemo(memo);
    setMemoNotes(memo.notes);
    setShowMemoModal(true);
    console.log("showMemoModal: ", showMemoModal);
    console.log("selectedMemo: ", selectedMemo);
    try {
      const res = await dispatch(fetchChildrenMemos(memo._id)).unwrap();
      setSubmemos(res.children);
    } catch (error) {
      console.error("Error fetching children memos:", error);
    }
  };

  const handleClose = () => {
    setShowMemoModal(false);
    setShowBigCalendar(false);
  };

  const addMemoBtn = () => {
    console.log("clicked");
  };

  return (
    <>
      {showMemoModal && selectedMemo && (
        <Modal
          show={showMemoModal}
          onHide={handleClose}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title
              style={{
                fontSize: "0.5rem",
                display: "flex",
                width: "100%",
                justifyContent: "space-between",
                alignItems: "center",
                paddingRight: "10px",
              }}
            >
              {selectedMemo.progress !== "Completed" ? (
                <>
                  <button
                    onClick={() =>
                      toggleMemoProgress(selectedMemo, selectedMemo._id)
                    }
                  >
                    &#10003; Mark Complete
                  </button>
                  <div
                    onClick={clickEllipsis}
                    style={{ color: "black", fontSize: "1rem" }}
                  >
                    ...
                  </div>
                </>
              ) : (
                <>
                  <button
                    onClick={() =>
                      toggleMemoProgress(selectedMemo, selectedMemo._id)
                    }
                    style={{ backgroundColor: "green" }}
                  >
                    &#10003; Completed
                  </button>
                  <div
                    onClick={clickEllipsis}
                    style={{ color: "black", fontSize: "1rem" }}
                  >
                    ...
                  </div>
                </>
              )}
              {showEllipsis && (
                <div
                  onClick={() => clickDeleteMemo(selectedMemo)}
                  style={{ color: "black" }}
                >
                  Delete
                </div>
              )}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Container>
              <Row>
                <Col>
                  <textarea
                    aria-label="Memo Body"
                    style={{
                      width: "100%",
                      height: "40px",
                      overflow: "hidden",
                      resize: "none",
                      padding: "10px",
                      border: "none",
                    }}
                    value={selectedMemo.body}
                  />
                </Col>
              </Row>
              <Row>
                <Col style={{ padding: "10px 20px 10px 20px" }}>
                  <div style={{ color: "black" }}>Due Date</div>
                </Col>
                <Col>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    {selectedMemo.dueDateTime ? (
                      <>
                        <div
                          style={{ color: "black", cursor: "pointer" }}
                          onClick={() => toggleBigCalendar(selectedMemo._id)}
                        >
                          {format(parseISO(selectedMemo.dueDateTime), "MMM d")}
                        </div>
                        <div
                          style={{
                            color: "black",
                            fontSize: "1rem",
                            cursor: "pointer",
                          }}
                          onClick={() => clearDueDate(selectedMemo)}
                        >
                          X
                        </div>
                      </>
                    ) : (
                      <CiCalendar
                        style={{ color: "black" }}
                        onClick={() => toggleBigCalendar(selectedMemo._id)}
                      />
                    )}
                  </div>
                  <div
                    ref={(el) => (calendarRefs.current[selectedMemo._id] = el)}
                    style={{ position: "relative" }}
                  >
                    {showBigCalendar[selectedMemo._id] && (
                      <div
                        style={{
                          position: "absolute",
                          zIndex: 1050,
                          top: "100%",
                          left: 0,
                        }}
                      >
                        <Calendar
                          onChange={(date) => {
                            changeDueDate(date, selectedMemo);
                            toggleBigCalendar(selectedMemo._id);
                          }}
                          value={
                            selectedMemo.dueDateTime
                              ? parseISO(selectedMemo.dueDateTime)
                              : null
                          }
                          calendarType={"gregory"}
                          style={{ backgroundColor: "white", color: "black" }}
                        />
                      </div>
                    )}
                  </div>
                </Col>
              </Row>
              <Row>
                <Col>
                  <div style={{ color: "black" }}>Projects</div>
                </Col>
                <Col>
                  <div style={{ color: "black" }}>
                    list user project associated with the memo
                  </div>
                </Col>
              </Row>
              <Row>
                <Col>
                  <div style={{ color: "black" }}>Descriptions</div>
                </Col>
                <Col>
                  <textarea
                    style={{ color: "black" }}
                    placeholder="What is this memo about?"
                    value={memoNotes}
                    onChange={(e) => setMemoNotes(e.target.value)}
                    onBlur={() => updateNotes(selectedMemo)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        updateNotes(selectedMemo);
                      }
                    }}
                  ></textarea>
                </Col>
              </Row>
              <Row>
                <Col>
                  <button onClick={handleSubMemoAddClick}>+ Add submemo</button>
                </Col>
              </Row>
              <Row>
                <Col>
                  {newSubMemoLine && (
                    <Row>
                      <Col>
                        <input
                          ref={submemoRef}
                          type="text"
                          onChange={(e) => setNewSubMemoText(e.target.value)}
                          placeholder="Type new submemo here..."
                          className="form-control"
                          onBlur={() => createSubMemoClick(selectedMemo)}
                        />
                      </Col>
                    </Row>
                  )}
                </Col>
              </Row>
              <Row>
                <Col>
                  <ul>
                    {submemos.length > 0 &&
                      submemos.map((submemo) => (
                        <li
                          key={submemo._id}
                          style={{ listStyleType: "circle", color: "black" }}
                          onClick={() => toggleMemoModal(submemo)}
                        >
                          {submemo.progress === "Completed" ? (
                            <>
                              <span
                                style={{
                                  color: "grey",
                                  textDecoration: "line-through",
                                }}
                              >
                                {submemo.body}
                              </span>
                              <span
                                style={{
                                  cursor: submemo.dueDateTime
                                    ? "pointer"
                                    : "default",
                                  color: "grey",
                                  textDecoration: "line-through",
                                }}
                              >
                                {submemo.dueDateTime
                                  ? isToday(parseISO(submemo.dueDateTime))
                                    ? "Today"
                                    : format(
                                        parseISO(submemo.dueDateTime),
                                        "MMM d"
                                      )
                                  : null}
                              </span>
                            </>
                          ) : (
                            <>
                              <span style={{ color: "black" }}>
                                {submemo.body}
                              </span>
                              {submemo.dueDateTime !== null && (
                                <span
                                  style={{
                                    cursor: submemo.dueDateTime
                                      ? "pointer"
                                      : "default",
                                    color: isToday(
                                      parseISO(submemo.dueDateTime)
                                    )
                                      ? "green"
                                      : "black",
                                  }}
                                >
                                  {submemo.dueDateTime
                                    ? isToday(parseISO(submemo.dueDateTime))
                                      ? "Today"
                                      : format(
                                          parseISO(submemo.dueDateTime),
                                          "MMM d"
                                        )
                                    : null}
                                </span>
                              )}
                            </>
                          )}
                        </li>
                      ))}
                  </ul>
                </Col>
              </Row>
            </Container>
          </Modal.Body>
        </Modal>
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
                onClick={() => addMemoBtn()}
              >
                + Add Memo
              </button>{" "}
            </Col>
          </Row>
          <Row>
            <Col>
              <ul>
                {notStartedMemos.map((memo) => (
                  <li key={memo.id}>{memo.body}</li>
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
          <Row>
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
              </button>{" "}
            </Col>
          </Row>
          <Row>
            <Col>
              <ul>
                {activeMemos.map((memo) => (
                  <li key={memo.id}>{memo.body}</li>
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
          <Row>
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
          </Row>
          <Row>
            <Col>
              <ul>
                {pendingMemos.map((memo) => (
                  <li key={memo.id}>{memo.body}</li>
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
