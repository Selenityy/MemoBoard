"use client";

import React, { useState, useEffect, useRef } from "react";
import { Row, Col, Button } from "react-bootstrap";
import ContentEditable from "react-contenteditable";
import uniqid from "uniqid";
import "../styles/main.scss";
import MemoListing from "./MemoListing";

const ProjectPageComponent = ({ project }) => {
  const projectMemoArray = project.memos;
  const [ellipsisDropdown, setEllipsisDropdown] = useState(null);

  const getInitialSections = () => {
    const savedSections = JSON.parse(localStorage.getItem("sections"));
    return (
      savedSections || [
        { id: uniqid(), name: "Section Name", memos: projectMemoArray },
      ]
    );
  };

  const [sections, setSections] = useState(getInitialSections);
  const sectionRefs = useRef(
    sections.reduce((acc, section) => {
      acc[section.id] = React.createRef();
      return acc;
    }, {})
  );

  const handleNameChange = (id) => {
    const newName = sectionRefs.current[id].current.innerHTML;
    setSections(
      sections.map((section) =>
        section.id === id ? { ...section, name: newName } : section
      )
    );
  };

  const onAddSectionClick = () => {
    const newSection = { id: uniqid(), name: "Section Name", memos: [] };
    sectionRefs.current[newSection.id] = React.createRef();
    setSections([...sections, newSection]);
    // if there is no name and no memos, delete it
  };

  const onAddMemoClick = () => {
    // create memo
    // attach memo to the section it's under and update the local storage
    // update project to include memo
    console.log("create memo");
  };

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
              <Col>
                <ul>
                  {section.memos.map((memo) => (
                    <li key={memo._id}>{memo.body}</li>
                  ))}
                </ul>
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
        <Col>
          <MemoListing project={project} />
        </Col>
      </Row>
    </div>
  );
};

export default ProjectPageComponent;
