import React from "react";
import "../styles/custom.scss";

import { Button, Col, Container, Row } from "react-bootstrap";

const NavBar = () => {
  return (
    <>
      {/* <Container className="nav-bar-contatiner"> */}
      <Row>
        <Col>
          <span>All Memos</span>
        </Col>
      </Row>
      <Row>
        <Col>
          <span>Today Memos</span>
        </Col>
      </Row>
      <Row>
        <Col>
          <span>This Week Memos</span>
        </Col>
      </Row>
      <Row>
        <Col>
          <hr></hr>
        </Col>
      </Row>
      <Row>
        <Col>
          <Row className="align-items-center">
            <Col xs={8}>
              <span>All Memos</span>
            </Col>
            <Col xs="auto">
              <Button size="sm">+</Button>
            </Col>
          </Row>
        </Col>
      </Row>
      {/* </Container> */}
    </>
  );
};

export default NavBar;
