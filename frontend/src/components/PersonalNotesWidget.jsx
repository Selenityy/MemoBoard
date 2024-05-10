"use client";

import React from "react";
import { Col, Row } from "react-bootstrap";
import { QuillComponent } from "@/components/Quill";

const PersonalNotesWidget = () => {
  return (
    <Row
      style={{
        width: "50%",
        border: "1px solid grey",
        borderRadius: "16px",
        padding: "none",
      }}
    >
      <Col xs={12} style={{ padding: "16px 0px 5px 25px" }}>
        <span style={{ fontWeight: "bold" }}>Personal Notes</span>
      </Col>
      <Col xs={12} style={{ width: "full", height: "200px" }}>
        <QuillComponent />
      </Col>
    </Row>
  );
};

export default PersonalNotesWidget;
