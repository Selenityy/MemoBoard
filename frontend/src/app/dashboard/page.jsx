"use client";

import "../../styles/custom.scss";
import { Col, Row } from "react-bootstrap";
import { useTheme } from "@/context/ThemeContext";
import React from "react";
import NavBar from "@/components/NavBar";
import Header from "@/components/Header";

const DashboardPage = () => {
  const { theme } = useTheme();
  return (
    <Row>
      <Col
        xs={2}
        // style={{ paddingTop: "1rem", borderRight: "0.5px solid black" }}
        className="nav-bar-contatiner"
      >
        <NavBar />
      </Col>
      <Col xs={10} className={theme === "dark" ? "body-dark" : "body-light"}>
        <div>Memos</div>
      </Col>
    </Row>
  );
};

export default DashboardPage;
