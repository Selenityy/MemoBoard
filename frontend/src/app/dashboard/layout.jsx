import Header from "@/components/Header";
import React from "react";
import { Col, Container, Row } from "react-bootstrap";

const DashboardLayout = ({ children }) => {
  return (
    <Container fluid>
      <Row>
        <Col className="w-full m-0 p-0">
          <Header />
        </Col>
      </Row>
      <Row className="w-100%">
        <Col>{children}</Col>
      </Row>
    </Container>
  );
};

export default DashboardLayout;
