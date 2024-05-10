import "../../styles/main.scss";
import { Col, Row } from "react-bootstrap";
import React from "react";
import MyTasksWidget from "@/components/MyTasksWidget";
import PersonalNotesWidget from "@/components/PersonalNotesWidget";
import ProjectsWidget from "@/components/ProjectsWidget";
import WelcomeComponent from "@/components/WelcomeComponent";

const DashboardPage = () => {
  return (
    <>
      <Row>
        <Col>
          <WelcomeComponent />
        </Col>
      </Row>
      <Row>
        <Col>
          <MyTasksWidget />
        </Col>
        <Col>
          <ProjectsWidget />
        </Col>
      </Row>
      <Row>
        <Col>
          <PersonalNotesWidget />
        </Col>
      </Row>
    </>
  );
};

export default DashboardPage;
