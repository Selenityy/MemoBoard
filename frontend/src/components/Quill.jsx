"use client";

import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export const QuillComponent = () => {
  const [value, setValue] = useState("");

  useEffect(() => {
    const storedNotes = localStorage.getItem("notes");
    if (storedNotes) {
      setValue(storedNotes);
    }
  }, []);

  const handleChange = (content) => {
    localStorage.setItem("notes", content);
    setValue(content);
  };

  return <ReactQuill theme="snow" value={value} onChange={handleChange} />;
};
