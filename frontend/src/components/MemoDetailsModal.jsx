"use client";

import { Row, Col, Container } from "react-bootstrap";
import { useTheme } from "@/context/ThemeContext";
import { format, parseISO, isToday } from "date-fns";
import Calendar from "react-calendar";
import { CiCalendar } from "react-icons/ci";
import "react-calendar/dist/Calendar.css";
import Modal from "react-bootstrap/Modal";
import Select from "react-dropdown-select";

const MemoDetailsModal = ({
  selectedMemo,
  showMemoModal,
  handleClose,
  toggleMemoProgress,
  clickEllipsis,
  showEllipsis,
  clickDeleteMemo,
  toggleMemoModal,
  setMemoBody,
  updateBody,
  toggleBigCalendar,
  showBigCalendar,
  clearDueDate,
  calendarRefs,
  changeDueDate,
  updateProgress,
  projectOptions,
  memoProjects,
  updateProjectMemos,
  memoNotes,
  memoBody,
  setMemoNotes,
  updateNotes,
  options,
  memoProgress,
  handleSubMemoAddClick,
  newSubMemoLine,
  submemoRef,
  setNewSubMemoText,
  submemos,
  createSubMemoClick,
}) => {
  // console.log("memo progress modal:", memoProgress, options);
  // console.log("memo projects modal:", memoProjects, projectOptions);
  // console.log("selected memo:", selectedMemo);
  return (
    <div>
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
                {selectedMemo.parentId && (
                  <div
                    onClick={() => toggleMemoModal(selectedMemo.parentId)}
                    style={{ color: "black" }}
                  >
                    {selectedMemo.parentId.body}
                  </div>
                )}
              </Col>
            </Row>
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
                  value={memoBody}
                  onChange={(e) => setMemoBody(e.target.value)}
                  onBlur={() => updateBody(selectedMemo)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      updateBody(selectedMemo);
                    }
                  }}
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
                <div style={{ color: "black" }}>Progress</div>
              </Col>
              <Col>
                <Select
                  style={{ color: "black" }}
                  options={options}
                  values={[memoProgress]}
                  onChange={(selectedOption) => {
                    updateProgress(selectedOption);
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
                    updateProjectMemos(selectedOption);
                  }}
                />
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
              </Col>
            </Row>
          </Container>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default MemoDetailsModal;
