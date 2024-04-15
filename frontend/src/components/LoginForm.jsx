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

function LoginForm() {
  const [credentials, setCredentials] = useState({
    identifier: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(credentials);
    // Implement login logic here
  };

  return (
    <Container className="form-container my-5 py-5">
      <Row className="justify-content-center">
        <Col xs={12} sm={10} md={8} lg={6}>
          <Form onSubmit={handleSubmit}>
            <FloatingLabel
              controlId="floatingInput"
              label="Email address or Username"
              className="mb-3"
            >
              <Form.Control
                type="text"
                name="identifier"
                placeholder="name@example.com or Username"
                value={credentials.identifier}
                onChange={handleChange}
                required
              />
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
                value={credentials.password}
                onChange={handleChange}
                required
              />
            </FloatingLabel>
            <Button variant="primary" type="submit" className="w-100">
              Log In
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default LoginForm;
