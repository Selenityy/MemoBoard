"use client";

import "../../styles/main.scss";
import { Col, Row } from "react-bootstrap";
import { useTheme } from "@/context/ThemeContext";
import React from "react";

const DashboardPage = () => {
  const { theme } = useTheme();
  return <div>Profile Page</div>;
};

export default DashboardPage;
