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

function LoginForm() {
  const dispatch = useDispatch();
  const router = useRouter();

  const [credentials, setCredentials] = useState({
    identifier: "",
    password: "",
  });
  const [validated, setValidated] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
    }

    setValidated(true);
    try {
      const res = await dispatch(loginUser(credentials));
      const userId = res.payload._id;
      if (userId) {
        setCredentials({
          identifier: "",
          password: "",
        });
      }
      router.push("/dashboard");
      console.log("successful login!");
    } catch (error) {
      setErrorMessage("Server error when attempting to log in");
      console.error("Server error failed to log in:", error);
    }
  };

  return (
    <Container className="form-container">
      <Row className="justify-content-center">
        <Col xs={12} sm={10} md={8} lg={6}>
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <FloatingLabel
              controlId="floatingInput"
              label="Email or Username"
              className="mb-3"
            >
              <Form.Control
                type="text"
                name="identifier"
                placeholder="name@example.com or Username"
                className="input-floating"
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
              className="mb-3"
            >
              <Form.Control
                type="password"
                name="password"
                placeholder="Password"
                className="input-floating"
                value={credentials.password}
                onChange={handleChange}
                required
              />
              <Form.Control.Feedback type="invalid" className="input-feedback">
                Please provide a password.
              </Form.Control.Feedback>
            </FloatingLabel>
            <Button variant="primary" type="submit" className="w-100">
              Log In
            </Button>
            <div>{errorMessage}</div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default LoginForm;
