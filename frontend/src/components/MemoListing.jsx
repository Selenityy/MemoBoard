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
import MemoModal from "./MemoModal";

const allProjects = createSelector(
  [(state) => state.project.allIds, (state) => state.project.byId],
  (allIds, byId) => {
    return allIds.map((id) => byId[id]);
  }
);

const MemoListing = ({ project }) => {
  const { theme } = useTheme();
  const dispatch = useDispatch();
  const projectId = project._id;
  const [projectMemos, setProjectMemos] = useState([]);
  const projects = useSelector(allProjects);
  const [allProjectMemos, setAllProjectMemos] = useState([]);

  const calendarRefs = useRef({});

  const [showCalendar, setShowCalendar] = useState({});
  const [showMemoModal, setShowMemoModal] = useState(false);
  const [selectedMemo, setSelectedMemo] = useState(null);

  const [newMemoLine, setNewMemoLine] = useState(false);
  const [newMemoText, setNewMemoText] = useState("");

  useEffect(() => {
    dispatch(fetchMemos());
  }, [dispatch]);

  useEffect(() => {
    const getProjectParentMemos = async () => {
      try {
        const memos = await dispatch(fetchAllMemos()).unwrap();
        const filteredProjectMemos = memos.filter(
          (memo) => memo.project && memo.project.id === projectId
        );
        setAllProjectMemos(filteredProjectMemos);
        const filteredMemos = memos.filter(
          (memo) =>
            memo.parentId === null &&
            memo.project &&
            memo.project.id === projectId
        );
        setProjectMemos(filteredMemos);
      } catch (error) {
        console.error("Error getting a project's parent memos:", error);
      }
    };
    getProjectParentMemos();
  }, [dispatch, projectId]);

  //MODAL TOGGLE
  const toggleMemoModal = async (memo, project) => {
    setSelectedMemo(memo);
  };

  useEffect(() => {
    if (selectedMemo) {
      setShowMemoModal(true);
    }
  }, [selectedMemo]);

  const handleClose = () => {
    setShowMemoModal(false);
    // setShowBigCalendar(false);
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
    const updatedMemo = {
      ...memo,
      dueDateTime: date.toISOString(),
    };
    try {
      await dispatch(updateMemo({ formData: updatedMemo, memoId: memo._id }));
      //   dispatch(fetchMemos());
      const memos = await dispatch(fetchMemos()).unwrap();
      const filteredMemos = memos.filter((memo) => memo.project === projectId);
      setProjectMemos(filteredMemos);
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
      //   dispatch(fetchMemos());
      const memos = await dispatch(fetchMemos()).unwrap();
      const filteredMemos = memos.filter((memo) => memo.project === projectId);
      setProjectMemos(filteredMemos);
      setSelectedMemo((prevMemo) => ({
        ...prevMemo,
        dueDateTime: null,
      }));
    } catch (error) {
      console.error("Error clearing memo due date/time:", error);
    }
  };

  //MEMO CRUD
  const handleAddClick = () => {
    setNewMemoLine(true);
    setNewMemoText("");
  };

  const handleModalChange = (event) => {
    setModalValue(event.currentTarget.value);
  };

  return (
    <>
      {selectedMemo && (
        <MemoModal
          show={showMemoModal}
          onHide={handleClose}
          memo={selectedMemo}
          projectid={projectId}
          projects={projects}
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

export default MemoListing;
