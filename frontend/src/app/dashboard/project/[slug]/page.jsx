"use client";

import "../../../../styles/main.scss";
import { Row, Col } from "react-bootstrap";
import React, { useEffect } from "react";
import { useTheme } from "@/context/ThemeContext";
import { createSelector } from "reselect";
import { useSelector, useDispatch } from "react-redux";
import { fetchProject, fetchProjects } from "@/redux/features/projectSlice";
import ProjectPageComponent from "@/components/ProjectPageComponent";
import ProjectPageSections from "@/components/ProjectPageSections";

const makeGetProjectByDisplayName = () => {
  return createSelector(
    [
      (state) => state.project.allIds,
      (state) => state.project.byId,
      (_, displayName) => displayName,
    ],
    (allIds, byId, displayName) => {
      return allIds
        .map((id) => byId[id])
        .find((project) => project.name === displayName);
    }
  );
};

const ProjectPage = ({ params: { slug } }) => {
  const { theme } = useTheme();
  const dispatch = useDispatch();
  const displayName = slug.replace(/-/g, " ");
  const getProjectByDisplayName = makeGetProjectByDisplayName();
  const project = useSelector((state) =>
    getProjectByDisplayName(state, displayName)
  );

  useEffect(() => {
    if (!project) {
      dispatch(fetchProjects());
    }
  }, [dispatch, project]);

  return (
    <>
      <Row>
        <Col>
          <div
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <div
              style={{
                width: "25px",
                height: "25px",
                borderRadius: "4px",
                backgroundColor: project.color,
                marginRight: "10px",
              }}
            ></div>
            <span
              style={{
                fontSize: "1.5rem",
                fontWeight: "700",
              }}
              className={
                theme === "dark" ? "project-names-dark" : "project-names-light"
              }
            >
              {displayName}
            </span>
          </div>
        </Col>
      </Row>
      {/* <ProjectPageComponent project={project} /> */}
      <ProjectPageSections project={project} />
    </>
  );
};

export default ProjectPage;
