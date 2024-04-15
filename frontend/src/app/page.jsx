import Header from "@/components/Header";
import "../styles/custom.scss";
import LoginForm from "@/components/LoginForm";
import { Col, Container, Row } from "react-bootstrap";

const Auth = () => {
  return (
    <div>
      <Header />
      <Container className="my-5 py-5">
        <Row className="mb-4">
          <Col xs={12}>
            <h2 className="text-center" style={{ fontSize: "1.75rem" }}>
              Welcome to MemoBoard
            </h2>
          </Col>
          <Col xs={12}>
            <h3 className="text-center" style={{ fontSize: "1.25rem" }}>
              To get started, please sign in
            </h3>
          </Col>
        </Row>
        <Row>
          <Col>
            <LoginForm />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Auth;
