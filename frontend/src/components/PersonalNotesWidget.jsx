"use client";

import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import dynamic from "next/dynamic";

const QuillComponent = dynamic(
  () =>
    import("@/components/Quill").then((module) => ({
      default: module.QuillComponent,
    })),
  {
    ssr: false,
  }
);

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
        <Col xs={12} style={{ width: "full", height: "300px" }}>
          <QuillComponent />
        </Col>
      </Row>
    </Container>
  );
};

export default PersonalNotesWidget;
