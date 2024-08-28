"use client";

import { Row, Col, Button, Container } from "react-bootstrap";
import { useTheme } from "@/context/ThemeContext";
import { format, parseISO, isToday } from "date-fns";
import Calendar from "react-calendar";
import { CiCalendar } from "react-icons/ci";
import "react-calendar/dist/Calendar.css";
import Modal from "react-bootstrap/Modal";
import Select from "react-dropdown-select";
import { MdArrowBack } from "react-icons/md";

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
  const { theme } = useTheme();

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
        <Modal.Header
          className={theme === "dark" ? "memo-modal-dark" : "memo-modal-light"}
          closeButton
        >
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
                <Button
                  variant="outline-success"
                  size="sm"
                  onClick={() =>
                    toggleMemoProgress(selectedMemo, selectedMemo._id)
                  }
                >
                  &#10003; Mark Complete
                </Button>
                <div className="memo-modal-parent-div-ellipsis-delete">
                  <div
                    onClick={clickEllipsis}
                    className={
                      theme === "dark"
                        ? "memo-modal-ellipsis-dark"
                        : "memo-modal-ellipsis-light"
                    }
                  >
                    ...
                  </div>
                  {showEllipsis && (
                    <div
                      onClick={() => clickDeleteMemo(selectedMemo)}
                      className={
                        theme === "dark"
                          ? "memo-modal-delete-dark"
                          : "memo-modal-delete-light"
                      }
                    >
                      Delete
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Button
                  variant="success"
                  size="sm"
                  onClick={() =>
                    toggleMemoProgress(selectedMemo, selectedMemo._id)
                  }
                  // style={{ backgroundColor: "green" }}
                >
                  &#10003; Completed
                </Button>
                <div className="memo-modal-parent-div-ellipsis-delete">
                  <div
                    onClick={clickEllipsis}
                    className={
                      theme === "dark"
                        ? "memo-modal-ellipsis-dark"
                        : "memo-modal-ellipsis-light"
                    }
                  >
                    ...
                  </div>
                  {showEllipsis && (
                    <div
                      onClick={() => clickDeleteMemo(selectedMemo)}
                      className={
                        theme === "dark"
                          ? "memo-modal-delete-dark"
                          : "memo-modal-delete-light"
                      }
                    >
                      Delete
                    </div>
                  )}
                </div>
              </>
            )}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body
          className={theme === "dark" ? "memo-modal-dark" : "memo-modal-light"}
        >
          <Container>
            <Row>
              <Col>
                {selectedMemo.parentId && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                    onClick={() => toggleMemoModal(selectedMemo.parentId)}
                  >
                    <div style={{ height: "min-content" }}>
                      <MdArrowBack style={{ marginTop: "0px" }} />
                    </div>
                    <div
                      // onClick={() => toggleMemoModal(selectedMemo.parentId)}
                      className={
                        theme === "dark"
                          ? "memo-modal-memo-body-dark"
                          : "memo-modal-memo-body-light"
                      }
                      style={{ padding: "0px", height: "min-content" }}
                    >
                      {selectedMemo.parentId.body}
                    </div>
                  </div>
                )}
              </Col>
            </Row>
            <Row>
              <Col style={{ padding: "0px" }}>
                <textarea
                  aria-label="Memo Body"
                  className={
                    theme === "dark"
                      ? "memo-modal-memo-body-dark"
                      : "memo-modal-memo-body-light"
                  }
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
              <Col style={{ paddingTop: "10px", paddingBottom: "10px" }}>
                <div
                  className={
                    theme === "dark" ? "memo-modal-dark" : "memo-modal-light"
                  }
                >
                  Due Date
                </div>
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
                      className={
                        theme === "dark"
                          ? "memo-modal-dark"
                          : "memo-modal-light"
                      }
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
                <div
                  className={
                    theme === "dark" ? "memo-modal-dark" : "memo-modal-light"
                  }
                >
                  Progress
                </div>
              </Col>
              <Col>
                <Select
                  className={`${
                    theme === "dark"
                      ? "memo-modal-selects-dark react-dropdown-select-item-dark"
                      : "memo-modal-selects-light react-dropdown-select-item-light"
                  }`}
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
                <div
                  className={
                    theme === "dark" ? "memo-modal-dark" : "memo-modal-light"
                  }
                >
                  Projects
                </div>
              </Col>
              <Col>
                <Select
                  clearable
                  className={`${
                    theme === "dark"
                      ? "memo-modal-selects-dark react-dropdown-select-item-dark"
                      : "memo-modal-selects-light react-dropdown-select-item-light"
                  }`}
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
                <div
                  className={
                    theme === "dark" ? "memo-modal-dark" : "memo-modal-light"
                  }
                >
                  Descriptions
                </div>
              </Col>
              <Col>
                <textarea
                  className={
                    theme === "dark"
                      ? "memo-modal-descriptions-dark"
                      : "memo-modal-descriptions-light"
                  }
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
                <Button
                  variant="outline-primary"
                  onClick={handleSubMemoAddClick}
                >
                  + Add submemo
                </Button>
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
                        // className="form-control"
                        className={`${
                          theme === "dark"
                            ? "memo-modal-subtask-line-dark"
                            : "memo-modal-subtask-line-light"
                        } form-control`}
                        onBlur={() => createSubMemoClick(selectedMemo)}
                      />
                    </Col>
                  </Row>
                )}
              </Col>
            </Row>
            <Row>
              <Col>
                <ul className="memo-modal-submemos-ul">
                  {submemos.length > 0 &&
                    submemos.map((submemo) => (
                      <li
                        key={submemo._id}
                        style={{
                          listStyle: "circle",
                          paddingTop: "10px",
                        }}
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
                            <span
                              className={
                                theme === "dark"
                                  ? "memo-modal-submemos-li-dark"
                                  : "memo-modal-submemos-li-light"
                              }
                            >
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
