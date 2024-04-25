"use client";

import "../../styles/custom.scss";
import { Col, Row } from "react-bootstrap";
import { useTheme } from "@/context/ThemeContext";
import React from "react";
import NavBar from "@/components/NavBar";

const DashboardPage = () => {
  const { theme } = useTheme();
  return (
    <Row>
      <Col xs={2} className="nav-bar-contatiner">
        <NavBar />
      </Col>
      <Col xs={10} className={theme === "dark" ? "body-dark" : "body-light"}>
        <div>Memos</div>
      </Col>
    </Row>
  );
};

export default DashboardPage;
