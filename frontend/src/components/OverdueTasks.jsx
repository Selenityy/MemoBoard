import React, { useEffect } from "react";
import { MdCheckBoxOutlineBlank } from "react-icons/md";
import { createSelector } from "reselect";
import { useSelector, useDispatch } from "react-redux";
import { useTheme } from "@/context/ThemeContext";
import { fetchAllMemos } from "@/redux/features/memoSlice";
import { format, parseISO } from "date-fns";

const selectedOverdueMemos = createSelector(
  [(state) => state.memo.allIds, (state) => state.memo.byId],
  (allIds, byId) => {
    const now = new Date();
    return allIds
      .map((id) => byId[id])
      .filter(
        (memo) =>
          new Date(memo.dueDateTime) < now && memo.progress !== "Completed"
      );
  }
);

const OverdueTasks = () => {
  const { theme } = useTheme();
  const dispatch = useDispatch();
  const overdueMemos = useSelector(selectedOverdueMemos);

  useEffect(() => {
    dispatch(fetchAllMemos());
  }, [dispatch]);

  return (
    <div className={theme === "dark" ? "body-dark" : "body-light"}>
      <ul>
        {overdueMemos.map((memo) => (
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
                <li style={{ color: "red" }}>
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

export default OverdueTasks;
