"use client";

import React, { useState } from "react";
import {
  Form,
  Button,
  Container,
  FloatingLabel,
  Row,
  Col,
} from "react-bootstrap";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { loginUser } from "@/redux/features/userSlice";
import { useTheme } from "@/context/ThemeContext";

function LoginForm() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { theme } = useTheme();

  const [credentials, setCredentials] = useState({
    identifier: "",
    password: "",
  });
  const [testCredentials, setTestCredentials] = useState({
    identifier: "testuser2",
    password: "password123",
  });
  const [validated, setValidated] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
    }

    setValidated(true);
    try {
      const res = await dispatch(loginUser(credentials)).unwrap();
      const userId = res._id;
      if (userId) {
        await router.push("/dashboard");
        setCredentials({
          identifier: "",
          password: "",
        });
        setValidated(false);
        setErrorMessage("");
        // console.log("successful login!");
      } else {
        setErrorMessage("Username/Email or Passowrd is incorrect");
      }
    } catch (error) {
      setErrorMessage(error);
      setValidated(false);
      console.error("Server error failed to log in:", error);
    }
  };

  const handleTestLogIn = async (e) => {
    try {
      const res = await dispatch(loginUser(testCredentials)).unwrap();
      const userId = res._id;
      if (userId) {
        await router.push("/dashboard");
        setErrorMessage("");
        // console.log("successful login!");
      } else {
        setErrorMessage("Username/Email or Passowrd is incorrect");
      }
    } catch (error) {
      setErrorMessage(error);
      setValidated(false);
      console.error("Server error failed to log in:", error);
    }
  };

  return (
    <Container
      className={
        theme === "dark" ? "form-container-dark" : "form-container-light"
      }
    >
      <Row className="justify-content-center">
        <Col xs={12} sm={10} md={8}>
          <Form
            noValidate
            validated={validated}
            onSubmit={handleSubmit}
            className={
              theme === "dark" ? "form-input-box-dark" : "form-input-box-light"
            }
          >
            <FloatingLabel
              controlId="floatingIdentifier"
              label="Email or Username"
              className={`mb-3 ${
                theme === "dark"
                  ? "input-floating-dark"
                  : "input-floating-light"
              }`}
            >
              <Form.Control
                type="text"
                name="identifier"
                placeholder=""
                value={credentials.identifier}
                onChange={handleChange}
                required
              />
              <Form.Control.Feedback type="invalid" className="input-feedback">
                Please provide a valid email or username.
              </Form.Control.Feedback>
            </FloatingLabel>
            <FloatingLabel
              controlId="floatingPassword"
              label="Password"
              className={`mb-3 ${
                theme === "dark"
                  ? "input-floating-dark"
                  : "input-floating-light"
              }`}
            >
              <Form.Control
                type="password"
                name="password"
                placeholder="Password"
                value={credentials.password}
                onChange={handleChange}
                required
              />
              <Form.Control.Feedback type="invalid" className="input-feedback">
                Please provide a password.
              </Form.Control.Feedback>
            </FloatingLabel>
            <Button variant="primary" type="submit" className="submit-form-btn">
              Login
            </Button>
            <div style={{ color: "red" }}>{errorMessage}</div>
          </Form>
        </Col>
      </Row>
      <Row className="div-hr-container">
        <Col xs={3} style={{ padding: "0px", margin: "0px" }}>
          <hr></hr>
        </Col>
        <Col xs="auto">
          <span>or</span>
        </Col>
        <Col xs={3} style={{ padding: "0px", margin: "0px" }}>
          <hr></hr>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col xs={12} sm={10} md={8}>
          <Button
            variant="primary"
            type="submit"
            className="submit-form-btn"
            onClick={handleTestLogIn}
          >
            Login as Test User
          </Button>
        </Col>
      </Row>
    </Container>
  );
}

export default LoginForm;
