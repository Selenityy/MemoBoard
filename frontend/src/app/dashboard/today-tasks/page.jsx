"use client";

import "../../../styles/main.scss";
import { Col, Row } from "react-bootstrap";
import { useTheme } from "@/context/ThemeContext";
import React from "react";

const TodayTasks = () => {
  const { theme } = useTheme();
  return <div>Today Tasks</div>;
};

export default TodayTasks;
