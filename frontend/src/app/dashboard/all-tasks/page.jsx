import "../../../styles/main.scss";
import { Col, Row } from "react-bootstrap";
import React from "react";
import AllMemos from "@/components/AllMemos";

const AllTasks = () => {
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
          <div>My Memos </div>
        </Col>
      </Row>
      {/* <AllMemos /> */}
    </>
  );
};

export default AllTasks;
