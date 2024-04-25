"use client";

import { useState } from "react";
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

const SignupForm = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    password: "",
    timezone: "",
  });
  const [validated, setValidated] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [userCreated, setUserCreated] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
    }

    setValidated(true);
    try {
      const res = await dispatch(signupUser(formData)).unwrap();
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
        setValidated(false);
        console.log("successful signup");
      }
    } catch (error) {
      setErrorMessage(
        "Error occured when attempting to signup. Please check your information above and try again."
      );
      console.error("Server error failed to signup", error);
    }
  };

  return (
    <Container className="form-container">
      <Row className="justify-content-center">
        <Col xs={12} sm={10} md={8} lg={6}>
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <FloatingLabel
              controlId="floatingInput"
              label="First Name"
              className="mb-3 input-floating"
            >
              <Form.Control
                type="text"
                name="firstName"
                placeholder=""
                className="input-label"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
              <Form.Control.Feedback type="invalid" className="input-feedback">
                Please provide a first name
              </Form.Control.Feedback>
            </FloatingLabel>
            <FloatingLabel
              controlId="floatingInput"
              label="Last Name"
              className="mb-3 input-floating"
            >
              <Form.Control
                type="text"
                name="lastName"
                placeholder=""
                className="input-label"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
              <Form.Control.Feedback type="invalid" className="input-feedback">
                Please provide a last name
              </Form.Control.Feedback>
            </FloatingLabel>
            <FloatingLabel
              controlId="floatingInput"
              label="Email"
              className="mb-3 input-floating"
            >
              <Form.Control
                type="email"
                name="email"
                placeholder=""
                className="input-label"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <Form.Control.Feedback type="invalid" className="input-feedback">
                Please provide a email
              </Form.Control.Feedback>
            </FloatingLabel>
            <FloatingLabel
              controlId="floatingInput"
              label="Username"
              className="mb-3 input-floating"
            >
              <Form.Control
                type="text"
                name="username"
                placeholder=""
                className="input-label"
                value={formData.username}
                onChange={handleChange}
                required
              />
              <Form.Control.Feedback type="invalid" className="input-feedback">
                Please provide a username
              </Form.Control.Feedback>
            </FloatingLabel>
            <FloatingLabel
              controlId="floatingInput"
              label="Password"
              className="mb-3 input-floating"
            >
              <Form.Control
                type="password"
                name="password"
                placeholder=""
                className="input-label"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <Form.Control.Feedback type="invalid" className="input-feedback">
                Please provide a password
              </Form.Control.Feedback>
            </FloatingLabel>
            <Button variant="primary" type="submit" className="w-100">
              Signup
            </Button>
            <div>{errorMessage}</div>
          </Form>
        </Col>
      </Row>
      {userCreated && (
        <Row>
          <Col>
            <span>Account creation successful!</span>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default SignupForm;
