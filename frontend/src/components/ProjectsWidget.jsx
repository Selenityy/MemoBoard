"use client";

import React, { useEffect } from "react";
import { Row, Col, Container } from "react-bootstrap";
import { useTheme } from "@/context/ThemeContext";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { createSelector } from "reselect";
import { fetchProjects } from "@/redux/features/projectSlice";
import { removeAllSections } from "@/redux/features/sectionSlice";

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
    const projectId = project._id;
    router.push(`/dashboard/project/${formattedProjectName}-${projectId}`);
  };

  // const massWipe = () => {
  //   dispatch(removeAllSections());
  //   console.log("deleted");
  // };

  return (
    <Container
      className={
        theme === "dark"
          ? "project-widget-containter-dark"
          : "project-widget-containter-light"
      }
    >
      {/* <Row>
        <Col>
          <div onClick={massWipe}>DELETE SECTIONS</div>
        </Col>
      </Row> */}
      <Row className="project-widget-rows">
        <Col>
          <span className="project-widget-project-span">Projects</span>
        </Col>
      </Row>
      <Row>
        <Col className="project-widget-project-cols">
          {allProjects.map((project) => (
            <div
              key={project._id}
              className={
                theme === "dark"
                  ? "project-widget-items-dark"
                  : "project-widget-items-light"
              }
              onClick={() => navToProject(project)}
              style={{ "--project-color": project.color }}
            >
              <ul className="project-widget-ul">
                <li>
                  <div className="project-widget-li-div"></div>
                </li>
                <li className="project-widget-li-project-name">
                  {project.name}
                </li>
              </ul>
            </div>
          ))}
        </Col>
      </Row>
    </Container>
  );
};

export default ProjectsWidget;
