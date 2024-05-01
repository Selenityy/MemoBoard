"use client";

import LoginHeader from "@/components/LoginHeader";
import "../styles/main.scss";
import LoginForm from "@/components/LoginForm";
import { Col, Container, Row } from "react-bootstrap";
import SignUpBtn from "@/components/SignUpBtn";
import { useTheme } from "@/context/ThemeContext";

const Auth = () => {
  const { theme } = useTheme();
  return (
    <div className={theme === "dark" ? "login-page-dark" : "login-page-light"}>
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
              To get started, please log in
            </h3>
          </Col>
        </Row>
        <Row className="justify-content-center pb-3">
          <Col xs="auto">
            <span style={{ color: "#1f1f1f" }}>Google</span>
          </Col>
        </Row>
        <Row className="div-hr-container">
          <Col className={`div-hr-border ${theme}`}>
            <div></div>
          </Col>
          <Col xs="auto">
            <span className={`sign-in-or-text ${theme}`}>or</span>
          </Col>
          <Col className={`div-hr-border ${theme}`}>
            <div></div>
          </Col>
        </Row>
        <Row>
          <Col>
            <LoginForm />
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col xs="auto">
            <SignUpBtn />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Auth;
