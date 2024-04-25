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
        console.log("successful login!");
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
    <Container className="form-container">
      <Row className="justify-content-center">
        <Col xs={12} sm={10} md={8} lg={6}>
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <FloatingLabel
              controlId="floatingIdentifier"
              label="Email or Username"
              className="mb-3 input-floating"
            >
              <Form.Control
                type="text"
                name="identifier"
                placeholder=""
                className="input-label"
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
              className="mb-3 input-floating"
            >
              <Form.Control
                type="password"
                name="password"
                placeholder="Password"
                className="input-label"
                value={credentials.password}
                onChange={handleChange}
                required
              />
              <Form.Control.Feedback type="invalid" className="input-feedback">
                Please provide a password.
              </Form.Control.Feedback>
            </FloatingLabel>
            <Button variant="primary" type="submit" className="w-100">
              Login
            </Button>
            <div style={{ color: "red" }}>{errorMessage}</div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default LoginForm;
