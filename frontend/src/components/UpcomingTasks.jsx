"use client";

import React, { useEffect, useRef, useState } from "react";
import { Row, Col, Container } from "react-bootstrap";
import { MdCheckBoxOutlineBlank } from "react-icons/md";
import { createSelector } from "reselect";
import { useSelector, useDispatch } from "react-redux";
import { useTheme } from "@/context/ThemeContext";
import {
  fetchAllMemos,
  updateMemo,
  createMemo,
} from "@/redux/features/memoSlice";
import { format, parseISO, isToday, isPast, compareAsc } from "date-fns";
import { IoMdAdd } from "react-icons/io";
import Calendar from "react-calendar";
import { CiCalendar } from "react-icons/ci";
import "react-calendar/dist/Calendar.css";
import Modal from "react-bootstrap/Modal";

const selectedMemos = createSelector(
  [(state) => state.memo.allIds, (state) => state.memo.byId],
  (allIds, byId) => {
    return allIds
      .map((id) => byId[id])
      .filter((memo) => {
        const dueDate = memo.dueDateTime ? parseISO(memo.dueDateTime) : null;
        return (
          memo.progress !== "Completed" &&
          (!dueDate || !isPast(dueDate) || isToday(dueDate))
        );
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
      });
  }
);

const UpcomingTasks = () => {
  const { theme } = useTheme();
  const dispatch = useDispatch();
  const memos = useSelector(selectedMemos);
  const [newMemoLine, setNewMemoLine] = useState(false);
  const [newMemoText, setNewMemoText] = useState("");
  const [showCalendar, setShowCalendar] = useState({});
  const [showBigCalendar, setShowBigCalendar] = useState({});
  const [showMemoModal, setShowMemoModal] = useState(false);
  const [selectedMemo, setSelectedMemo] = useState(null);
  const inputRef = useRef(null);
  const calendarRefs = useRef({});

  useEffect(() => {
    dispatch(fetchAllMemos());
  }, [dispatch]);

  useEffect(() => {
    if (newMemoLine && inputRef.current) {
      inputRef.current.focus();
    }
  }, [newMemoLine]);

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

  const handleAddClick = () => {
    setNewMemoLine(true);
    setNewMemoText("");
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

  const toggleCalendar = (id) => {
    setShowCalendar((prevState) => {
      const newState = { ...prevState, [id]: !prevState[id] };
      return newState;
    });
  };

  const toggleBigCalendar = (id) => {
    setShowBigCalendar((prevState) => {
      const newState = { ...prevState, [id]: !prevState[id] };
      return newState;
    });
  };

  const toggleMemoModal = (memo) => {
    setSelectedMemo(memo);
    setShowMemoModal(true);
  };

  const handleClose = () => {
    setShowMemoModal(false);
    setShowBigCalendar(false);
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
                  <button>&#10003; Mark Complete</button>
                  <div style={{ color: "black", fontSize: "1rem" }}>...</div>
                </>
              ) : (
                <>
                  <button style={{ backgroundColor: "green" }}>
                    &#10003; Completed
                  </button>
                  <div style={{ color: "black", fontSize: "1rem" }}>...</div>
                </>
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
                    defaultValue={selectedMemo.body}
                  />
                </Col>
              </Row>
              <Row>
                <Col style={{ padding: "10px 20px 10px 20px" }}>
                  <div style={{ color: "black" }}>Due Date</div>
                </Col>
                <Col>
                  <div
                    style={{ color: "black" }}
                    onClick={() => toggleBigCalendar(selectedMemo._id)}
                  >
                    {selectedMemo.dueDateTime
                      ? format(parseISO(selectedMemo.dueDateTime), "MMM d")
                      : "No due date"}
                  </div>
                  <div
                    ref={(el) => (calendarRefs.current[selectedMemo._id] = el)}
                    style={{ position: "relative" }}
                  >
                    {!selectedMemo.dueDateTime && (
                      <CiCalendar
                        onClick={() => toggleBigCalendar(selectedMemo._id)}
                      />
                    )}
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
                          defaultValue={
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
                  ></textarea>
                </Col>
              </Row>
              <Row>
                <Col>
                  <button>+ Add submemo</button>
                </Col>
              </Row>
            </Container>
          </Modal.Body>
        </Modal>
      )}
      <Row
        style={{
          alignItems: "center",
        }}
      >
        <Col xs="auto" style={{ padding: "0px 0px 10px 10px", margin: "0px" }}>
          <button
            className={
              theme === "dark"
                ? "add-project-btn-dark"
                : "add-project-btn-light"
            }
            onClick={handleAddClick}
            style={{ padding: "0px", margin: "0px" }}
          >
            <IoMdAdd style={{ color: "#5a5b5c" }} size={20} className="me-2" />
          </button>
        </Col>
        <Col
          className={
            theme === "dark" ? "project-span-dark" : "project-span-light"
          }
          style={{ padding: "0px 0px 10px 0px", margin: "0px" }}
        >
          <span style={{ color: "#5a5b5c" }}>Create Memo</span>
        </Col>
      </Row>
      {newMemoLine && (
        <Row>
          <Col>
            <input
              ref={inputRef}
              type="text"
              defaultValue={newMemoText}
              onChange={(e) => setNewMemoText(e.target.value)}
              placeholder="Type new memo here..."
              className="form-control"
              onBlur={createMemoClick}
            />
          </Col>
        </Row>
      )}
      <div className={theme === "dark" ? "body-dark" : "body-light"}>
        <ul>
          {memos.map((memo) => (
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
                      defaultValue={
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
