import React from "react";
import LoginHeader from "@/components/LoginHeader";
import { Col, Row, Container } from "react-bootstrap";
import SignupForm from "@/components/SignupForm";
import LoginBtn from "@/components/LoginBtn";

const SignupPage = () => {
  return (
    <div className="login-page">
      <LoginHeader />
      <Container className="my-5 py-5">
        <Row className="mb-4">
          <Col xs={12}>
            <h2 className="text-center welcome-text">Welcome to MemoBoard</h2>
          </Col>
          <Col xs={12}>
            <h3 className="text-center sign-in-text">
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
