"use client";

import "../../styles/main.scss";
import { Col, Row } from "react-bootstrap";
import { useTheme } from "@/context/ThemeContext";
import React from "react";

const ProjectPage = () => {
  const { theme } = useTheme();
  return <div>Project Page</div>;
};

export default ProjectPage;
