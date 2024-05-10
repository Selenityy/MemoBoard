"use client";

import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import { QuillComponent } from "@/components/Quill";

const PersonalNotesWidget = () => {
  return (
    <Container
      style={{
        width: "100%",
        border: "1px solid grey",
        borderRadius: "16px",
        padding: "none",
      }}
    >
      <Row>
        <Col xs={12} style={{ padding: "16px 0px 5px 25px" }}>
          <span style={{ fontWeight: "bold" }}>Personal Notes</span>
        </Col>
        <Col xs={12} style={{ width: "full", height: "400px" }}>
          <QuillComponent />
        </Col>
      </Row>
    </Container>
  );
};

export default PersonalNotesWidget;
