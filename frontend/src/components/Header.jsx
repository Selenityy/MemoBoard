import React from "react";
import Logo from "./Logo";
import { Col, Container, Row } from "react-bootstrap";
import "../styles/custom.scss";
import LightDarkModeToggle from "./LightDarkModeToggle";

const Header = () => {
  return (
    <Container fluid>
      <Row className="header align-items-center justify-content-between">
        <Col xs={8} md="fluid">
          <Logo />
        </Col>
        <Col xs="auto">
          <LightDarkModeToggle />
        </Col>
      </Row>
      <Row style={{ backgroundColor: "#1f1f1f" }}>
        <hr className="header-hr"></hr>
      </Row>
    </Container>
  );
};

export default Header;
