"use client";

import React from "react";
import LoginHeader from "@/components/LoginHeader";
import { Col, Row, Container } from "react-bootstrap";
import SignupForm from "@/components/SignupForm";
import LoginBtn from "@/components/LoginBtn";
import { useTheme } from "@/context/ThemeContext";

const SignupPage = () => {
  const { theme } = useTheme();

  return (
    <div className="login-page">
      <LoginHeader />
      <Container className="my-5 py-5">
        <Row className="mb-4">
          <Col xs={12}>
            <h2
              className={`text-center ${
                theme === "dark" ? "welcome-text-dark" : "welcome-text-light"
              }`}
            >
              Welcome to MemoBoard
            </h2>
          </Col>
          <Col xs={12}>
            <h3
              className={`text-center ${
                theme === "dark" ? "sign-in-text-dark" : "sign-in-text-light"
              }`}
            >
              To get started, please sign up
            </h3>
          </Col>
        </Row>
        <Row>
          <Col>
            <SignupForm />
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col xs="auto">
            <LoginBtn />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default SignupPage;
