"use client";

import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import Nav from "react-bootstrap/Nav";
import UpcomingTasks from "./UpcomingTasks";
import OverdueTasks from "./OverdueTasks";
import CompletedTasks from "./CompletedTasks";
import { useTheme } from "@/context/ThemeContext";
import { useSelector } from "react-redux";

const MyTasksWidget = () => {
  const [activeTab, setActiveTab] = useState("upcoming");
  const { theme } = useTheme();
  const { user } = useSelector((state) => state.user);

  const renderTabContent = () => {
    switch (activeTab) {
      case "upcoming":
        return <UpcomingTasks user={user} />;
      case "overdue":
        return <OverdueTasks user={user} />;
      case "completed":
        return <CompletedTasks user={user} />;
      default:
        return <UpcomingTasks user={user} />;
    }
  };

  return (
    <Container
      className={
        theme === "dark"
          ? "my-task-widget-container-dark"
          : "my-task-widget-container-light"
      }
    >
      <Row>
        <Col>
          <div className="my-task-widget-my-memos-widget">My Memos</div>
        </Col>
      </Row>
      <Row className="my-task-widget-rows">
        <Col>
          <Nav
            variant="underline"
            defaultActiveKey="upcoming"
            onSelect={(selectedKey) => setActiveTab(selectedKey)}
          >
            <Nav.Item>
              <Nav.Link
                eventKey="upcoming"
                className={
                  theme === "dark"
                    ? "my-task-widget-nav-event-keys-dark"
                    : "my-task-widget-nav-event-keys-light"
                }
              >
                Upcoming
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                eventKey="overdue"
                className={
                  theme === "dark"
                    ? "my-task-widget-nav-event-keys-dark"
                    : "my-task-widget-nav-event-keys-light"
                }
              >
                Overdue
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                eventKey="completed"
                className={
                  theme === "dark"
                    ? "my-task-widget-nav-event-keys-dark"
                    : "my-task-widget-nav-event-keys-light"
                }
              >
                Completed
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </Col>
      </Row>
      <Row className="my-task-widget-render-tabs-row">
        <Col>{renderTabContent()}</Col>
      </Row>
    </Container>
  );
};

export default MyTasksWidget;
