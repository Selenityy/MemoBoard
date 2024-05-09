"use client";

import React, { useState, useEffect } from "react";
import { fetchAllMemos, fetchChildrenMemos } from "@/redux/features/memoSlice";
import { useSelector, useDispatch } from "react-redux";
import { useTheme } from "@/context/ThemeContext";
import { MdCheckBox } from "react-icons/md";
import { createSelector } from "reselect";

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

  return (
    <div className={theme === "dark" ? "body-dark" : "body-light"}>
      <ul>
        {completedMemos.map((memo) => (
          <div
            key={memo._id}
            style={{ display: "flex", alignItems: "center", gap: "10px" }}
          >
            <MdCheckBox />
            <li>{memo.body}</li>
          </div>
        ))}
      </ul>
    </div>
  );
};

export default CompletedTasks;
