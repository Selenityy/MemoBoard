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

const MemoModal = (props) => {
  const dispatch = useDispatch();
  const calendarRefs = useRef({});
  const submemoRef = useRef(null);

  const [memoNotes, setMemoNotes] = useState("");
  const [memoProgress, setMemoProgress] = useState("");
  const [memoProjects, setMemoProjects] = useState([]);
  const [submemos, setSubmemos] = useState([]);
  const [newSubMemoLine, setNewSubMemoLine] = useState(false);
  const [newSubMemoText, setNewSubMemoText] = useState("");

  const [showBigCalendar, setShowBigCalendar] = useState({});
  const [showEllipsis, setShowEllipsis] = useState(false);

  const options = [
    { value: "Not Started", label: "Not Started" },
    { value: "Active", label: "Active" },
    { value: "Pending", label: "Pending" },
    { value: "Completed", label: "Completed" },
    { value: "Cancelled", label: "Cancelled" },
  ];
  const [projectOptions, setProjectOptions] = useState([]);

  // USE EFFECTS
  useEffect(() => {
    const projectList = props.projects.map((project) => ({
      value: project._id,
      label: project.name,
    }));
    setProjectOptions(projectList);
  }, [props.projects]);

  useEffect(() => {
    setMemoNotes(props.memo.notes);
    setMemoProgress(
      options.find((option) => option.value === props.memo.progress)
    );
    setMemoProjects(
      props.memo.project
        ? [{ value: props.memo.project._id, label: props.memo.project.name }]
        : []
    );
    const fetchSubMemos = async () => {
      try {
        const res = await dispatch(fetchChildrenMemos(props.memo._id)).unwrap();
        setSubmemos(res.children);
      } catch (error) {
        console.error("Error fetching children memos:", error);
      }
    };
    fetchSubMemos();
  }, []);

  // UPDATES
  const updateMemoBody = async (memoBody) => {
    const updatedMemo = { ...props.memo, body: memoBody };
    try {
      await dispatch(
        updateMemo({ formData: updatedMemo, memoId: props.memo._id })
      );
      dispatch(fetchAllMemos());
      //   setSelectedMemo((prevMemo) => ({
      //     ...prevMemo,
      //     body: memoBody,
      //   }));
    } catch (error) {
      console.error("Error updating memo body:", error);
    }
  };

  const toggleMemoProgress = async (memo, memoId) => {
    const updatedProgress =
      memo.progress === "Completed" ? "Not Started" : "Completed";
    const updatedMemo = { ...memo, progress: updatedProgress };
    try {
      await dispatch(updateMemo({ formData: updatedMemo, memoId: memoId }));
      dispatch(fetchAllMemos());
      //   const memos = await dispatch(fetchMemos()).unwrap();
      //   const filteredMemos = memos.filter(
      //     (memo) => memo.project === props.memo.project._id
      //   );
    } catch (error) {
      console.error("Error updating memo:", error);
    }
  };

  const updateMemoProgress = async (selectedOption) => {
    const updatedMemo = {
      ...props.memo,
      progress: selectedOption[0].value,
    };
    setMemoProgress(selectedOption[0].value);
    try {
      await dispatch(
        updateMemo({
          formData: updatedMemo,
          memoId: props.memo._id,
        })
      );
      dispatch(fetchMemos());
      //   const memos = await dispatch(fetchMemos()).unwrap();
      //   const filteredMemos = memos.filter((memo) => memo.project === projectId);
      //   setProjectMemos(filteredMemos);
      //   setSelectedMemo((prevMemo) => ({
      //     ...prevMemo,
      //     progress: selectedOption[0].value,
      //   }));
    } catch (error) {
      console.error("Error updating progress:", error);
    }
  };

  const updateMemoProject = async (selectedOption) => {
    const updatedProjects = selectedOption.length
      ? selectedOption.map((option) => option.value)
      : null;
    const updatedMemo = {
      ...props.memo,
      project: updatedProjects,
    };
    setMemoProjects(selectedOption);
    try {
      await dispatch(
        updateMemo({
          formData: updatedMemo,
          memoId: props.memo._id,
        })
      );
      dispatch(fetchMemos());
      //   const memos = await dispatch(fetchMemos()).unwrap();
      //   const filteredMemos = memos.filter((memo) => memo.project === projectId);
      //   setProjectMemos(filteredMemos);
      //   setSelectedMemo((prevMemo) => ({
      //     ...prevMemo,
      //     project: updatedProjects,
      //   }));
    } catch (error) {
      console.error("Error updating project:", error);
    }
  };

  const updateNotes = async (memo) => {
    const updatedMemo = {
      ...memo,
      notes: memoNotes,
    };
    try {
      await dispatch(updateMemo({ formData: updatedMemo, memoId: memo._id }));
      dispatch(fetchMemos());
      //   const memos = await dispatch(fetchMemos()).unwrap();
      //   const filteredMemos = memos.filter((memo) => memo.project === projectId);
      //   setProjectMemos(filteredMemos);
      //   setSelectedMemo((prevMemo) => ({
      //     ...prevMemo,
      //     notes: memoNotes,
      //   }));
    } catch (error) {
      console.error("Error updating memo notes:", error);
    }
  };

  const updateMemoDueDate = async (date, memo) => {
    const updatedDueDate = { ...memo, dueDateTime: date.toISOString() };
    try {
      await dispatch(
        updateMemo({ formData: updatedDueDate, memoId: memo._id })
      );
      dispatch(fetchAllMemos());
      //   const memos = await dispatch(fetchMemos()).unwrap();
      //   const filteredMemos = memos.filter((memo) => memo.project === projectId);
      //   setProjectMemos(filteredMemos);
      //   setSelectedMemo((prevMemo) => ({
      //     ...prevMemo,
      //     dueDateTime: updatedMemo.dueDateTime,
      //   }));
    } catch (error) {
      console.error("Error updating memo due date:", error);
    }
  };

  const clearDueDate = async (memo) => {
    const updatedMemo = {
      ...memo,
      dueDateTime: null,
    };
    try {
      await dispatch(updateMemo({ formData: updatedMemo, memoId: memo._id }));
      dispatch(fetchMemos());
      //   const memos = await dispatch(fetchMemos()).unwrap();
      //   const filteredMemos = memos.filter((memo) => memo.project === projectId);
      //   setProjectMemos(filteredMemos);
      //   setSelectedMemo((prevMemo) => ({
      //     ...prevMemo,
      //     dueDateTime: null,
      //   }));
    } catch (error) {
      console.error("Error clearing memo due date/time:", error);
    }
  };

  const clickDeleteMemo = async (memo, memoId) => {
    try {
      await dispatch(deleteMemo(memoId));
      dispatch(fetchAllMemos());
      props.onHide();
    } catch (error) {
      console.error("Error deleting memo:", error);
    }
  };

  // SUBMEMOS
  const createSubMemoClick = async (memo) => {
    if (!newSubMemoText.trim()) {
      setNewSubMemoLine(false);
    } else {
      try {
        await dispatch(
          createMemo({
            body: newSubMemoText,
            parentId: memo._id,
            project: projectId,
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

  const handleSubMemoAddClick = () => {
    setNewSubMemoLine(true);
    setNewSubMemoText("");
  };

  // MODAL
  const clickEllipsis = () => {
    setShowEllipsis((prevState) => !prevState);
  };

  const toggleModalCalendar = (id) => {
    setShowBigCalendar((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  return (
    <Modal
      {...props}
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
          {props.memo.progress !== "Completed" ? (
            <>
              <button
                onClick={() => toggleMemoProgress(props.memo, props.memo._id)}
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
                onClick={() => toggleMemoProgress(props.memo, props.memo._id)}
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
              onClick={() => clickDeleteMemo(props.memo, props.memo._id)}
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
                value={props.memo.body}
                onChange={(e) => updateMemoBody(e.target.value)}
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
                {props.memo.dueDateTime ? (
                  <>
                    <div
                      style={{ color: "black", cursor: "pointer" }}
                      onClick={() => toggleModalCalendar(props.memo._id)}
                    >
                      {format(parseISO(props.memo.dueDateTime), "MMM d")}
                    </div>
                    <div
                      style={{
                        color: "black",
                        fontSize: "1rem",
                        cursor: "pointer",
                      }}
                      onClick={() => clearDueDate(props.memo)}
                    >
                      X
                    </div>
                  </>
                ) : (
                  <CiCalendar
                    style={{ color: "black" }}
                    onClick={() => toggleModalCalendar(props.memo._id)}
                  />
                )}
              </div>
              <div
                ref={(el) => (calendarRefs.current[props.memo._id] = el)}
                style={{ position: "relative" }}
              >
                {showBigCalendar[props.memo._id] && (
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
                        updateMemoDueDate(date, props.memo);
                        toggleModalCalendar(props.memo._id);
                      }}
                      value={
                        props.memo.dueDateTime
                          ? parseISO(props.memo.dueDateTime)
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
              <div style={{ color: "black" }}>Progress</div>
            </Col>
            <Col>
              <Select
                style={{ color: "black" }}
                options={options}
                values={[memoProgress]}
                onChange={(selectedOption) => {
                  updateMemoProgress(selectedOption);
                }}
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <div style={{ color: "black" }}>Projects</div>
            </Col>
            <Col>
              <Select
                clearable
                style={{ color: "black" }}
                options={projectOptions}
                values={memoProjects}
                onChange={(selectedOption) => {
                  updateMemoProject(selectedOption);
                }}
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <div style={{ color: "black" }}>Descriptions</div>
            </Col>
            {/* <Col>
              <textarea
                style={{ color: "black" }}
                placeholder="What is this memo about?"
                value={memoNotes}
                onChange={(e) => setMemoNotes(e.target.value)}
                onBlur={() => updateNotes(props.memo)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    updateNotes(props.memo);
                  }
                }}
              ></textarea>
            </Col> */}
          </Row>
          <Row>
            {/* <Col>
              <button onClick={handleSubMemoAddClick}>+ Add submemo</button>
            </Col> */}
          </Row>
          <Row>
            {/* <Col>
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
            </Col> */}
          </Row>
          <Row>
            {/* <Col>
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
                                : format(parseISO(submemo.dueDateTime), "MMM d")
                              : null}
                          </span>
                        </>
                      ) : (
                        <>
                          <span style={{ color: "black" }}>{submemo.body}</span>
                          {submemo.dueDateTime !== null && (
                            <span
                              style={{
                                cursor: submemo.dueDateTime
                                  ? "pointer"
                                  : "default",
                                color: isToday(parseISO(submemo.dueDateTime))
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
            </Col> */}
          </Row>
        </Container>
      </Modal.Body>
    </Modal>
  );
};

export default MemoModal;
