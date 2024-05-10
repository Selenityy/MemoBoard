"use client";

import React, { useEffect } from "react";
import { MdCheckBoxOutlineBlank } from "react-icons/md";
import { createSelector } from "reselect";
import { useSelector, useDispatch } from "react-redux";
import { useTheme } from "@/context/ThemeContext";
import { fetchAllMemos } from "@/redux/features/memoSlice";
import { format, parseISO, isToday, isPast, compareAsc } from "date-fns";

const selectedMemos = createSelector(
  [(state) => state.memo.allIds, (state) => state.memo.byId],
  (allIds, byId) => {
    return allIds
      .map((id) => byId[id])
      .filter(
        (memo) =>
          memo.dueDateTime &&
          (!isPast(parseISO(memo.dueDateTime)) ||
            isToday(parseISO(memo.dueDateTime))) &&
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

const UpcomingTasks = () => {
  const { theme } = useTheme();
  const dispatch = useDispatch();
  const memos = useSelector(selectedMemos);

  useEffect(() => {
    dispatch(fetchAllMemos());
  }, [dispatch]);

  return (
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
            <MdCheckBoxOutlineBlank />
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
  );
};

export default UpcomingTasks;
