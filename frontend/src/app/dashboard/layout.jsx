"use client";

import Header from "@/components/Header";
import NavBar from "@/components/NavBar";
import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useTheme } from "@/context/ThemeContext";
import useAuth from "@/components/UseAuth";
import MobileNavBar from "@/components/MobileNavBar";

const DashboardLayout = ({ children }) => {
  const { theme } = useTheme();
  const isAuthenticated = useAuth();

  if (!isAuthenticated) {
    return (
      <div
        className={theme === "dark" ? "body-dark" : "body-light"}
        style={{ width: "100vw", height: "100vh", padding: "20px" }}
      >
        Restricted access, redirecting...
      </div>
    );
  }
  return (
    <Container
      fluid
      style={{ width: "100%", height: "100vh", overflowY: "scroll" }}
      className="container-fluid"
    >
      <Row>
        <Col className="w-full m-0 p-0">
          <Header />
        </Col>
      </Row>
      <Row className="min-vh-100 d-none d-md-flex">
        <Col
          xs={2}
          className={`${
            theme === "dark"
              ? "nav-bar-container-dark"
              : "nav-bar-container-light"
          }`}
        >
          <NavBar className="pe-2" />
        </Col>
        <Col
          className={`w-100% px-5 pt-3 ${
            theme === "dark" ? "body-dark" : "body-light"
          }`}
          style={{ overflowX: "auto" }}
        >
          {children}
        </Col>
      </Row>
      {/* Mobile version */}
      <Row className="min-vh-100 d-flex d-md-none">
        {/* <Col
          xs={2}
          className={`${
            theme === "dark"
              ? "mobile-nav-bar-container-dark"
              : "mobile-nav-bar-container-light"
          }`}
        >
          <MobileNavBar className="pe-2" />
        </Col> */}
        <Col
          className={`w-100% px-4 pt-3 ${
            theme === "dark" ? "body-dark" : "body-light"
          }`}
          style={{ overflowX: "auto" }}
        >
          {children}
        </Col>
      </Row>
      <Row
        className={`${
          theme === "dark"
            ? "mobile-nav-bar-row-dark"
            : "mobile-nav-bar-row-light"
        } d-md-none`}
      >
        <Col
          className={`${
            theme === "dark"
              ? "mobile-nav-bar-col-dark"
              : "mobile-nav-bar-col-light"
          } p-0`}
        >
          <MobileNavBar />
        </Col>
      </Row>
    </Container>
  );
};

export default DashboardLayout;
