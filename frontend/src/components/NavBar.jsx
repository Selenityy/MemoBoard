import React from "react";
import "../styles/custom.scss";

import { Button, Col, Container, Row, Stack } from "react-bootstrap";
import LogoutBtn from "./LogoutBtn";

const NavBar = () => {

  return (
    <>
      {/* <Container className="nav-bar-contatiner"> */}
      <Stack gap={2}>
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
        {/* {projects.map((project) => {
          <Row key={project.id}>
            <Col>
              <span>{project.name}</span>
            </Col>
          </Row>;
        })} */}
      </Stack>
      <div className="mt-auto">
        <Row>
          <Col>
            <LogoutBtn />
          </Col>
        </Row>
      </div>
      {/* </Container> */}
    </>
  );
};

export default NavBar;
