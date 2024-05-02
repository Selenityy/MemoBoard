"use client";

import "../../../../styles/main.scss";
import { Col, Row } from "react-bootstrap";
import { useTheme } from "@/context/ThemeContext";
import React from "react";

const ProjectPage = ({ params: { slug } }) => {
  const { theme } = useTheme();
  const displayName = slug.replace(/-/g, " ");
  return (
    <div>
      <span>Project Page for {displayName}</span>
    </div>
  );
};

export default ProjectPage;
