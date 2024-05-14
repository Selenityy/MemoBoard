"use client";

import React, { useEffect, useRef, useState } from "react";
import { Row, Col } from "react-bootstrap";
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

const selectedMemos = createSelector(
  [(state) => state.memo.allIds, (state) => state.memo.byId],
  (allIds, byId) => {
    return allIds
      .map((id) => byId[id])
      .filter((memo) => {
        const dueDate = memo.dueDateTime ? parseISO(memo.dueDateTime) : null;
        return memo.progress !== "Completed" && (!dueDate || !isPast(dueDate));
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
  const inputRef = useRef(null);

  useEffect(() => {
    dispatch(fetchAllMemos());
  }, [dispatch]);

  useEffect(() => {
    if (newMemoLine && inputRef.current) {
      inputRef.current.focus();
    }
  }, [newMemoLine]);

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

  return (
    <>
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
              value={newMemoText}
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
                <li>{memo.body}</li>
                {memo.dueDateTime && (
                  <li
                    style={{
                      color: isToday(parseISO(memo.dueDateTime))
                        ? "green"
                        : "black",
                    }}
                  >
                    {isToday(parseISO(memo.dueDateTime))
                      ? "Today"
                      : format(parseISO(memo.dueDateTime), "MMM d")}
                  </li>
                )}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default UpcomingTasks;
