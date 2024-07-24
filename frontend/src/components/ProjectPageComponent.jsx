"use client";

import React, { useState, useEffect, useRef } from "react";
import { Row, Col, Button } from "react-bootstrap";
import ContentEditable from "react-contenteditable";
import uniqid from "uniqid";
import { useDispatch } from "react-redux";
import { fetchMemos } from "@/redux/features/memoSlice";
import "../styles/main.scss";
import MemosListed from "./MemosListed";

const ProjectPageComponent = ({ project }) => {
  // console.log("project:", project);
  const dispatch = useDispatch();
  const projectMemoArray = project.memos;
  const projectId = project._id;
  const [projectMemos, setProjectMemos] = useState([]);
  const [ellipsisDropdown, setEllipsisDropdown] = useState(null);
  const [memoProjects, setMemoProjects] = useState([]);
  // console.log("project memos:", projectMemos);
  // console.log("memo projects:", memoProjects);

  // grab all memos for the specific project
  useEffect(() => {
    const getProjectParentMemos = async () => {
      try {
        const memos = await dispatch(fetchMemos()).unwrap();
        const filteredMemos = memos.filter(
          (memo) => memo.project && memo.project._id === projectId
        );
        setProjectMemos(filteredMemos);
        // setMemoProjects(project);
      } catch (error) {
        console.error("Error getting a project's parent memos:", error);
      }
    };
    getProjectParentMemos();
  }, [dispatch, projectId]);

  // Get section names saved form local storage
  const getInitialSections = () => {
    const savedSections = JSON.parse(localStorage.getItem("sections"));
    return (
      savedSections || [{ id: uniqid(), name: "My Memos", memos: projectMemos }]
    );
  };

  const [sections, setSections] = useState(getInitialSections);
  // console.log("sections:", sections);

  const sectionRefs = useRef(
    sections.reduce((acc, section) => {
      acc[section.id] = React.createRef();
      return acc;
    }, {})
  );

  // Update sections when projectMemos changes
  useEffect(() => {
    if (
      sections.length === 1 &&
      sections[0].name === "My Memos" &&
      sections[0].memos.length === 0
    ) {
      setSections([
        { id: sections[0].id, name: "My Memos", memos: projectMemos },
      ]);
    }
  }, [projectMemos]);

  // Change section names
  const handleNameChange = (id) => {
    const newName = sectionRefs.current[id].current.innerHTML;
    setSections(
      sections.map((section) =>
        section.id === id ? { ...section, name: newName } : section
      )
    );
  };

  // Adding Sections
  const onAddSectionClick = () => {
    const newSection = { id: uniqid(), name: "Section Name", memos: [] };
    sectionRefs.current[newSection.id] = React.createRef();
    setSections([...sections, newSection]);
    // if there is no name and no memos, delete it
  };

  // Adding Memos
  const onAddMemoClick = () => {
    // create memo
    // attach memo to the section it's under and update the local storage
    // update project to include memo
    // console.log("create memo");
  };

  // Delete sections
  const onEllipsisClick = (sectionId) => {
    setEllipsisDropdown(ellipsisDropdown === sectionId ? null : sectionId);
  };

  const onDeleteSectionClick = (sectionId) => {
    const section = sections.find((section) => section.id === sectionId);
    if (section.memos.length === 0) {
      setSections(sections.filter((section) => section.id !== sectionId));
    } else {
      console.log("delete or move the memos first");
    }
  };

  // Set new sections to local storage
  useEffect(() => {
    localStorage.setItem("sections", JSON.stringify(sections));
  }, [sections]);

  return (
    <div className="scrollable-row">
      <Row className="mt-4 flex-nowrap">
        {sections.map((section, index) => (
          <Col key={section.id} xs={3}>
            <Row className="mb-3">
              <Col>
                <ContentEditable
                  innerRef={sectionRefs.current[section.id]}
                  html={section.name}
                  onBlur={() => handleNameChange(section.id)}
                  tagName="div"
                  className="section-names"
                />
              </Col>
              {index !== 0 && (
                <Col xs="auto">
                  <div onClick={() => onEllipsisClick(section.id)}>...</div>
                  {ellipsisDropdown === section.id && (
                    <Row>
                      <Col>
                        <div onClick={() => onDeleteSectionClick(section.id)}>
                          Delete
                        </div>
                      </Col>
                    </Row>
                  )}
                </Col>
              )}
            </Row>
            <Row>
              {/* <Col>
                <ul>
                  {section.memos.map((memo) => (
                    <li key={memo._id}>{memo.body}</li>
                  ))}
                </ul>
              </Col> */}
              <Col>
                <MemosListed
                  project={project}
                  setProjectMemos={setProjectMemos}
                  projectMemos={projectMemos}
                  setMemoProjects={setMemoProjects}
                  memoProjects={memoProjects}
                />
              </Col>
            </Row>
            <Row>
              <Col>
                <Button onClick={onAddMemoClick}>+ Add Memo</Button>
              </Col>
            </Row>
          </Col>
        ))}
        <Col xs={3}>
          <Button onClick={onAddSectionClick}>+ Add Section</Button>
        </Col>
        {/* <Col>
          <MemosListed
            project={project}
            setProjectMemos={setProjectMemos}
            projectMemos={projectMemos}
          />
        </Col> */}
      </Row>
    </div>
  );
};

export default ProjectPageComponent;
