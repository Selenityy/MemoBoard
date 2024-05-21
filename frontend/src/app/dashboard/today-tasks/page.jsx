import "../../../styles/main.scss";
import { Col, Row } from "react-bootstrap";
import React from "react";
import TodaysMemos from "@/components/TodaysMemos";

const TodayTasks = () => {
  return (
    <>
      <Row>
        <Col
          style={{
            fontSize: "1.5rem",
            fontWeight: "700",
            paddingBottom: "20px",
          }}
        >
          <div>Today's Memos </div>
        </Col>
      </Row>
      <TodaysMemos />
    </>
  );
};

export default TodayTasks;
