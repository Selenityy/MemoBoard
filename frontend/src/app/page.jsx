import LoginHeader from "@/components/LoginHeader";
import "../styles/main.scss";
import LoginForm from "@/components/LoginForm";
import { Col, Container, Row } from "react-bootstrap";
import SignUpBtn from "@/components/SignUpBtn";

const Auth = () => {
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
              To get started, please log in
            </h3>
          </Col>
        </Row>
        <Row className="justify-content-center pb-3">
          <Col xs="auto">
            <span style={{ color: "#1f1f1f" }}>Google</span>
          </Col>
        </Row>
        <Row className="align-items-center justify-content-center">
          <Col xs={5} sm={4} md={3} lg={2}>
            <div className="div-hr-border"></div>
          </Col>
          <Col xs="auto">
            <span style={{ color: "#1f1f1f" }}>or</span>
          </Col>
          <Col xs={5} sm={4} md={3} lg={2}>
            <div className="div-hr-border"></div>
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
