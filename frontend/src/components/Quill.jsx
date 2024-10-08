"use client";

import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useDispatch } from "react-redux";
import { updateUserNotes } from "@/redux/features/userSlice";
import { useCallback } from "react";
import debounce from "lodash/debounce";
import { useTheme } from "@/context/ThemeContext";

export const QuillComponent = ({ userPersonalNotes }) => {
  const dispatch = useDispatch();
  const { theme } = useTheme();
  const [value, setValue] = useState(userPersonalNotes);

  useEffect(() => {
    setValue(userPersonalNotes);
  }, [userPersonalNotes]);

  const handleChange = useCallback(
    debounce((content) => {
      dispatch(updateUserNotes(content));
    }, 400),
    [dispatch]
  );

  return (
    <ReactQuill
      theme="snow"
      value={value}
      onChange={handleChange}
      className={
        theme == "dark"
          ? "personal-notes-widget-content-dark"
          : "personal-notes-widget-content-light"
      }
    />
  );
};
