import "../../styles/main.scss";
import { Col, Container, Row } from "react-bootstrap";
import React from "react";
import MyTasksWidget from "@/components/MyTasksWidget";
import PersonalNotesWidget from "@/components/PersonalNotesWidget";
import ProjectsWidget from "@/components/ProjectsWidget";
import WelcomeComponent from "@/components/WelcomeComponent";

const DashboardPage = () => {
  return (
    <>
      {/* <Row>
        <Col xs={1}>
          <span style={{ fontWeight: "bold" }}>Home</span>
        </Col>
      </Row> */}
      <Row>
        <Col style={{ paddingBottom: "20px" }}>
          <WelcomeComponent />
        </Col>
      </Row>
      <Container>
        <Row style={{ gap: "20px", marginBottom: "20px" }}>
          <Col style={{ padding: "0px" }}>
            <MyTasksWidget />
          </Col>
          <Col style={{ padding: "0px" }}>
            <ProjectsWidget />
          </Col>
        </Row>
        <Row style={{ paddingBottom: "20px" }}>
          <Col xs={12} style={{ padding: "0px" }}>
            <PersonalNotesWidget />
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default DashboardPage;
