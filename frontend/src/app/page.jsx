"use client";

import { useRef, useState, useEffect } from "react";
import LoginHeader from "@/components/LoginHeader";
import "../styles/main.scss";
import LoginForm from "@/components/LoginForm";
import { Col, Container, Row } from "react-bootstrap";
import SignUpBtn from "@/components/SignUpBtn";
import { useTheme } from "@/context/ThemeContext";
import SignupForm from "@/components/SignupForm";
import LoginLink from "@/components/LoginLink";

const Auth = () => {
  const { theme } = useTheme();
  const containerRef = useRef(null);
  const signupFormRef = useRef(null);
  const [showSignUpForm, setShowSignUpForm] = useState(false);

  const handleOutsideClick = (event) => {
    if (
      signupFormRef.current &&
      !signupFormRef.current.contains(event.target)
    ) {
      setShowSignUpForm(false);
    }
  };

  useEffect(() => {
    if (showSignUpForm) {
      document.addEventListener("click", handleOutsideClick);
    } else {
      document.removeEventListener("click", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [showSignUpForm]);

  return (
    <div className={theme === "dark" ? "login-page-dark" : "login-page-light"}>
      <LoginHeader />
      <Container
        className="my-5 py-5"
        ref={containerRef}
        style={{ position: "relative" }}
      >
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
        {showSignUpForm ? (
          <Row>
            <Col>
              <SignupForm ref={signupFormRef} />
            </Col>
          </Row>
        ) : (
          <Row>
            <Col>
              <LoginForm />
            </Col>
          </Row>
        )}
        <Row className="justify-content-center mt-2">
          <Col xs="auto">
            {!showSignUpForm ? (
              <SignUpBtn setShowSignUpForm={setShowSignUpForm} />
            ) : (
              <LoginLink setShowSignUpForm={setShowSignUpForm} />
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Auth;
