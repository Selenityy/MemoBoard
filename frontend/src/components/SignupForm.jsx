"use client";

import { useState, forwardRef } from "react";
import {
  Form,
  Button,
  Container,
  FloatingLabel,
  Row,
  Col,
} from "react-bootstrap";
import { useDispatch } from "react-redux";
import { signupUser } from "@/redux/features/userSlice";
import { useTheme } from "@/context/ThemeContext";
import { useRouter } from "next/navigation";

const SignupForm = forwardRef((props, ref) => {
  const { theme } = useTheme();
  const dispatch = useDispatch();
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    password: "",
    timezone: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMismatch, setPasswordMismatch] = useState(false);
  const [emailInvalid, setEmailInvalid] = useState(false);
  const [usernameInvalid, setUsernameInvalid] = useState(false);
  const [validated, setValidated] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [userCreated, setUserCreated] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== confirmPassword) {
      setPasswordMismatch(true);
      e.stopPropagation();
      return;
    }

    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
    }

    setPasswordMismatch(false);
    setValidated(true);
    try {
      const res = await dispatch(signupUser(formData));
      // console.log("res:", res);
      if (signupUser.fulfilled.match(res)) {
        setUserCreated(true);
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          username: "",
          password: "",
          timezone: "",
        });
        setConfirmPassword("");
        setValidated(false);
        setErrorMessage("");
        // console.log("successful signup");
        router.push("/");
      } else {
        setValidated(false);
        setErrorMessage(res.payload);
        setEmailInvalid(true);
        setUsernameInvalid(true);
      }
    } catch (error) {
      setErrorMessage(error);
      setUserCreated(false);
      console.error("Server error failed to signup", error);
    }
  };

  return (
    <Container
      className={
        theme === "dark" ? "form-container-dark" : "form-container-light"
      }
      ref={ref}
      style={{ zIndex: "1000" }}
    >
      <Row className="justify-content-center">
        <Col>
          <Form
            noValidate
            validated={validated}
            onSubmit={handleSubmit}
            className={
              theme === "dark" ? "form-input-box-dark" : "form-input-box-light"
            }
          >
            <Row>
              <Col>
                <FloatingLabel
                  controlId="floatingFirstName"
                  label="First Name"
                  className={`mb-3 ${
                    theme === "dark"
                      ? "input-floating-dark"
                      : "input-floating-light"
                  }`}
                >
                  <Form.Control
                    type="text"
                    name="firstName"
                    placeholder=""
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                  <Form.Control.Feedback
                    type="invalid"
                    className="input-feedback"
                  >
                    Please provide a first name
                  </Form.Control.Feedback>
                </FloatingLabel>
              </Col>
              <Col>
                <FloatingLabel
                  controlId="floatingLastName"
                  label="Last Name"
                  className={`mb-3 ${
                    theme === "dark"
                      ? "input-floating-dark"
                      : "input-floating-light"
                  }`}
                >
                  <Form.Control
                    type="text"
                    name="lastName"
                    placeholder=""
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
                  <Form.Control.Feedback
                    type="invalid"
                    className="input-feedback"
                  >
                    Please provide a last name
                  </Form.Control.Feedback>
                </FloatingLabel>
              </Col>
            </Row>
            <Row>
              <Col>
                <FloatingLabel
                  controlId="floatingEmail"
                  label="Email"
                  className={`mb-3 ${
                    theme === "dark"
                      ? "input-floating-dark"
                      : "input-floating-light"
                  }`}
                >
                  <Form.Control
                    type="email"
                    name="email"
                    placeholder=""
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                  <Form.Control.Feedback
                    type="invalid"
                    className="input-feedback"
                  >
                    Please provide an email
                  </Form.Control.Feedback>
                </FloatingLabel>
              </Col>
              <Col>
                <FloatingLabel
                  controlId="floatingUsername"
                  label="Username"
                  className={`mb-3 ${
                    theme === "dark"
                      ? "input-floating-dark"
                      : "input-floating-light"
                  }`}
                >
                  <Form.Control
                    type="text"
                    name="username"
                    placeholder=""
                    value={formData.username}
                    onChange={handleChange}
                    required
                  />
                  <Form.Control.Feedback
                    type="invalid"
                    className="input-feedback"
                  >
                    Please provide a username
                  </Form.Control.Feedback>
                </FloatingLabel>
              </Col>
            </Row>
            <Row>
              <Col>
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
                    placeholder=""
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <Form.Control.Feedback
                    type="invalid"
                    className="input-feedback"
                  >
                    Please provide a password
                  </Form.Control.Feedback>
                </FloatingLabel>
              </Col>
              <Col>
                <FloatingLabel
                  controlId="floatingConfirmPassword"
                  label="Confirm Password"
                  className={`mb-3 ${
                    theme === "dark"
                      ? "input-floating-dark"
                      : "input-floating-light"
                  }`}
                >
                  <Form.Control
                    type="password"
                    name="confirmPassword"
                    placeholder=""
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      setPasswordMismatch(false);
                      setUserCreated(false);
                    }}
                    required
                    isInvalid={passwordMismatch}
                  />
                  <Form.Control.Feedback
                    type="invalid"
                    className="input-feedback"
                  >
                    {passwordMismatch
                      ? "Passwords do not match"
                      : "Please confirm your password"}
                  </Form.Control.Feedback>
                </FloatingLabel>
              </Col>
            </Row>
            <Button variant="primary" type="submit" className="submit-form-btn">
              Signup
            </Button>
            <div style={{ color: "red" }}>{errorMessage}</div>
          </Form>
        </Col>
      </Row>
      {userCreated && (
        <Row className="justify-content-center">
          <Col xs="auto" className="pt-2">
            <span style={{ color: "green" }}>Account creation successful!</span>
          </Col>
        </Row>
      )}
    </Container>
  );
});

export default SignupForm;
