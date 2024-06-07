"use client";

import Header from "@/components/Header";
import NavBar from "@/components/NavBar";
import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useTheme } from "@/context/ThemeContext";

const DashboardLayout = ({ children }) => {
  const { theme } = useTheme();
  return (
    <Container
      fluid
      style={{ width: "full", height: "100vh", overflowY: "scroll" }}
    >
      <Row>
        <Col className="w-full m-0 p-0">
          <Header />
        </Col>
      </Row>
      <Row>
        <Col
          xs={2}
          className={`${
            theme === "dark"
              ? "nav-bar-contatiner-dark"
              : "nav-bar-contatiner-light"
          }`}
        >
          <NavBar />
        </Col>
        <Col
          className={`w-100% px-4 pt-3 ${
            theme === "dark" ? "body-dark" : "body-light"
          }`}
          style={{ overflowX: "auto" }}
        >
          {children}
        </Col>
      </Row>
    </Container>
  );
};

export default DashboardLayout;
