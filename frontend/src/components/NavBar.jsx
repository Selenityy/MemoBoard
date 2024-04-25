import React from "react";
import "../styles/custom.scss";

import { Button, Col, Container, Row } from "react-bootstrap";
import LogoutBtn from "./LogoutBtn";

const NavBar = () => {
  return (
    <>
      {/* <Container className="nav-bar-contatiner"> */}
      <Row>
        <Col>
          <span>Home</span>
        </Col>
      </Row>
      <Row>
        <Col>
          <span>My Memos</span>
        </Col>
      </Row>
      <Row>
        <Col>
          <span>Today</span>
        </Col>
      </Row>
      <Row>
        <Col>
          <span>This Week</span>
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
              <span>Projects</span>
            </Col>
            <Col xs="auto">
              <Button size="sm">+</Button>
            </Col>
          </Row>
        </Col>
      </Row>
      <Row>
        <Col>
          <LogoutBtn />
        </Col>
      </Row>
      {/* </Container> */}
    </>
  );
};

export default NavBar;
