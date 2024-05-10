"use client";

import React from "react";
import { Row, Col, Container } from "react-bootstrap";

const ProjectsWidget = () => {
  return (
    <Container
      style={{
        border: "1px solid grey",
        borderRadius: "16px",
        height: "400px",
        width: "100%",
        padding: "16px",
        margin: "0px",
      }}
    >
      <Row
        style={{
          marginLeft: "-16px",
          marginRight: "-16px",
          borderBottom: "1px solid grey",
          paddingLeft: "4px",
          paddingRight: "4px",
        }}
      >
        <Col>
          <span style={{ fontWeight: "bold" }}>Projects</span>
        </Col>
      </Row>
      <Row>
        <Col>
          <div>list of projects here</div>
        </Col>
      </Row>
    </Container>
  );
};

export default ProjectsWidget;
