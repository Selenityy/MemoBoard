"use client";

import "../../styles/main.scss";
import { Col, Row } from "react-bootstrap";
import { useTheme } from "@/context/ThemeContext";
import React from "react";

const AllTasks = () => {
  const { theme } = useTheme();
  return <div>All Tasks</div>;
};

export default AllTasks;
