"use client";

import React, { useEffect } from "react";
import { Row, Col, Container } from "react-bootstrap";
import { useTheme } from "@/context/ThemeContext";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { createSelector } from "reselect";
import { fetchProjects } from "@/redux/features/projectSlice";

const selectAllProjects = createSelector(
  [(state) => state.project.allIds, (state) => state.project.byId],
  (allIds, byId) => allIds.map((id) => byId[id])
);

const ProjectsWidget = () => {
  const { theme } = useTheme();
  const dispatch = useDispatch();
  const router = useRouter();
  const allProjects = useSelector(selectAllProjects);

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  const navToProject = (project) => {
    const formattedProjectName = project.name.replace(/\s+/g, "-");
    router.push(`/dashboard/project/${formattedProjectName}`);
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
      <Row
        style={{
          marginLeft: "-16px",
          marginRight: "-16px",
          borderBottom: "none",
          paddingLeft: "4px",
          paddingRight: "4px",
        }}
      >
        <Col>
          <span
            style={{
              fontWeight: "bold",
              fontSize: "1.2rem",
            }}
          >
            Projects
          </span>
        </Col>
      </Row>
      <Row>
        <Col
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gridAutoFlow: "row",
            padding: "20px 30px 30px 30px",
            gap: "20px",
          }}
        >
          {allProjects.map((project) => (
            <div
              key={project._id}
              className={
                theme === "dark"
                  ? "project-widget-items-dark"
                  : "project-widget-items-light"
              }
              onClick={() => navToProject(project)}
            >
              <ul
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <li>
                  <div
                    style={{
                      width: "30px",
                      height: "30px",
                      borderRadius: "4px",
                      backgroundColor: project.color,
                      marginRight: "10px",
                    }}
                  ></div>
                </li>
                <li style={{ fontSize: "1rem" }}>{project.name}</li>
              </ul>
            </div>
          ))}
        </Col>
      </Row>
    </Container>
  );
};

export default ProjectsWidget;
