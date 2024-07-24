"use client";

import "../../../../styles/main.scss";
import { Row, Col } from "react-bootstrap";
import React, { useEffect, useState, useRef, useCallback } from "react";
import { useTheme } from "@/context/ThemeContext";
import { createSelector } from "reselect";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchProject,
  fetchProjects,
  updateProject,
} from "@/redux/features/projectSlice";
import { debounce } from "lodash";
import { useRouter } from "next/navigation";
import ProjectPageSections from "@/components/ProjectPageSections";
import ContentEditable from "react-contenteditable";

const getProjectById = createSelector(
  [(state) => state.project.byId, (_, projectId) => projectId],
  (byId, projectId) => byId[projectId]
);

const splitSlug = (slug) => {
  const lastIndex = slug.lastIndexOf("-");
  const firstPart = slug.substring(0, lastIndex);
  const secondPart = slug.substring(lastIndex + 1);

  return { firstPart, secondPart };
};

const ProjectPage = ({ params }) => {
  const { theme } = useTheme();
  const dispatch = useDispatch();
  const { slug } = params;
  const { secondPart: projectId } = splitSlug(slug);
  const router = useRouter();
  const project = useSelector((state) => getProjectById(state, projectId));
  const initialDisplayName = params.slug.replace(/-/g, " ");
  const [projectName, setProjectName] = useState(initialDisplayName);
  const [projectDescription, setProjectDescription] = useState(
    project?.description || ""
  );
  const [projectColor, setProjectColor] = useState(project?.color || "");
  const projectNameRef = useRef(null);
  const projectDescriptionRef = useRef(null);
  const colorInputRef = useRef(null);
  const [userChanged, setUserChanged] = useState(false);
  const [editingColor, setEditingColor] = useState(false);

  // console.log("params:", params);
  // console.log("project:", project);
  // console.log("project name:", projectName);
  // console.log("description:", projectDescription);
  // console.log("project id:", projectId);
  // console.log("project color:", projectColor);

  useEffect(() => {
    if (!project) {
      dispatch(fetchProjects());
    } else if (project && !userChanged) {
      const { firstPart, secondPart } = splitSlug(params.slug);
      setProjectName(firstPart.replace(/-/g, " "));
      setProjectDescription(project.description || "");
    }
  }, [dispatch, project, params.slug]);

  const handleProjectNameChange = useCallback(
    debounce(async (e) => {
      const newProjectName = e.target.value;
      const displayNameEdited = newProjectName.replace(/-/g, " ");
      // console.log("edited:", displayNameEdited);
      setProjectName(displayNameEdited);
      try {
        await dispatch(
          updateProject({
            projectId: project._id,
            projectData: { name: displayNameEdited },
          })
        );
        const newSlug = newProjectName.replace(/ /g, "-");
        // console.log("new slug:", newSlug);
        router.push(`/dashboard/project/${newSlug}-${projectId}`);
      } catch (error) {
        console.error("Error updating the project name:", error);
      }
    }, 500),
    [dispatch, projectName, router]
  );

  const handleProjectDescriptionChange = useCallback(
    debounce(async (e) => {
      const newProjectDescription = e.target.value;
      setProjectDescription(newProjectDescription);
      try {
        await dispatch(
          updateProject({
            projectId: project._id,
            projectData: { description: newProjectDescription },
          })
        );
      } catch (error) {
        console.error("Error updating the project description:", error);
      }
    }, 500),
    [dispatch, projectDescription]
  );

  const handleColorChange = (e) => {
    const newColor = e.target.value;
    setProjectColor(newColor);
    dispatch(
      updateProject({
        projectId: project._id,
        projectData: { color: newColor },
      })
    );
  };

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
                backgroundColor: projectColor,
                marginRight: "10px",
                cursor: "pointer",
                position: "relative",
              }}
              onClick={() => colorInputRef.current.click()}
            >
              <input
                ref={colorInputRef}
                type="color"
                value={projectColor}
                onChange={handleColorChange}
                style={{
                  opacity: 0,
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                  cursor: "pointer",
                  border: "none",
                  padding: 0,
                  top: 0,
                  left: 0,
                }}
              />
            </div>
            <ContentEditable
              innerRef={projectNameRef}
              html={projectName}
              onChange={(e) => handleProjectNameChange(e)}
              tagName="div"
              style={{
                fontSize: "1.5rem",
                fontWeight: "700",
              }}
              className={
                theme === "dark" ? "project-names-dark" : "project-names-light"
              }
            />
          </div>
        </Col>
      </Row>
      <Row>
        <Col>
          <ContentEditable
            innerRef={projectDescriptionRef}
            html={projectDescription}
            onChange={(e) => handleProjectDescriptionChange(e)}
            tagName="div"
          />
        </Col>
      </Row>
      <ProjectPageSections project={project} />
    </>
  );
};

export default ProjectPage;
