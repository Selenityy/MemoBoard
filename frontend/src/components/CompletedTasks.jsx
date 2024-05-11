"use client";

import React, { useEffect } from "react";
import { fetchAllMemos, updateMemo } from "@/redux/features/memoSlice";
import { useSelector, useDispatch } from "react-redux";
import { useTheme } from "@/context/ThemeContext";
import { MdCheckBox } from "react-icons/md";
import { createSelector } from "reselect";
import { format, parseISO } from "date-fns";

const selectCompletedMemos = createSelector(
  [(state) => state.memo.allIds, (state) => state.memo.byId],
  (allIds, byId) =>
    allIds.map((id) => byId[id]).filter((memo) => memo.progress === "Completed")
);

const CompletedTasks = () => {
  // any memo from all memos that are completed
  const { theme } = useTheme();
  const dispatch = useDispatch();
  const completedMemos = useSelector(selectCompletedMemos);

  useEffect(() => {
    dispatch(fetchAllMemos());
  }, [dispatch]);

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

  return (
    <div className={theme === "dark" ? "body-dark" : "body-light"}>
      <ul>
        {completedMemos.map((memo) => (
          <li
            key={memo._id}
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
              <li style={{ color: "grey" }}>{memo.body}</li>
              {memo.dueDateTime && (
                <li style={{ color: "grey" }}>
                  {format(parseISO(memo.dueDateTime), "MMM d")}
                </li>
              )}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CompletedTasks;
