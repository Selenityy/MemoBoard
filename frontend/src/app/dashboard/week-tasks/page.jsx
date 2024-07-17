"use client";

import "../../../styles/main.scss";
import { Col, Row } from "react-bootstrap";
import { useTheme } from "@/context/ThemeContext";
import React from "react";

const WeekTasks = () => {
  const { theme } = useTheme();
  return (
    <div
      style={{
        fontSize: "1.5rem",
        fontWeight: "700",
        paddingBottom: "20px",
      }}
    >
      Week Tasks
    </div>
  );
};

export default WeekTasks;
