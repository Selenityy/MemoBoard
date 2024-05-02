"use client";

import "../../../styles/main.scss";
import { Col, Row } from "react-bootstrap";
import { useTheme } from "@/context/ThemeContext";
import React from "react";

const WeekTasks = () => {
  const { theme } = useTheme();
  return <div>Week Tasks</div>;
};

export default WeekTasks;
