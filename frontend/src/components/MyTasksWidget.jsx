"use client";

import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import Nav from "react-bootstrap/Nav";
import UpcomingTasks from "./UpcomingTasks";
import OverdueTasks from "./OverdueTasks";
import CompletedTasks from "./CompletedTasks";

const MyTasksWidget = () => {
  const [activeTab, setActiveTab] = useState("upcoming");

  const renderTabContent = () => {
    switch (activeTab) {
      case "upcoming":
        return <UpcomingTasks />;
      case "overdue":
        return <OverdueTasks />;
      case "completed":
        return <CompletedTasks />;
      default:
        return <UpcomingTasks />;
    }
  };
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
      <Row>
        <Col>
          <div style={{ fontWeight: "bold" }}>My Tasks</div>
        </Col>
      </Row>
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
          <Nav
            variant="underline"
            defaultActiveKey="upcoming"
            onSelect={(selectedKey) => setActiveTab(selectedKey)}
            // className="justify-content-around"
          >
            <Nav.Item>
              <Nav.Link eventKey="upcoming" style={{ color: "black" }}>
                Upcoming
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="overdue" style={{ color: "black" }}>
                Overdue
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="completed" style={{ color: "black" }}>
                Completed
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </Col>
      </Row>
      <Row style={{ padding: "12px" }}>
        <Col>{renderTabContent()}</Col>
      </Row>
    </Container>
  );
};

export default MyTasksWidget;
