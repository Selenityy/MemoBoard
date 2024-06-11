"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { Row, Col, Button, Container } from "react-bootstrap";
import { MdCheckBoxOutlineBlank } from "react-icons/md";
import { MdCheckBox } from "react-icons/md";
import { createSelector } from "reselect";
import { useSelector, useDispatch } from "react-redux";
import { useTheme } from "@/context/ThemeContext";
import {
  fetchAllMemos,
  fetchMemo,
  fetchChildrenMemos,
  updateMemo,
  createMemo,
  deleteMemo,
  fetchMemos,
} from "@/redux/features/memoSlice";
import { format, parseISO, isToday, isPast, compareAsc } from "date-fns";
import { IoMdAdd } from "react-icons/io";
import Calendar from "react-calendar";
import { CiCalendar } from "react-icons/ci";
import "react-calendar/dist/Calendar.css";
import Modal from "react-bootstrap/Modal";
import Select from "react-dropdown-select";
import MemoDetailsModal from "./MemoDetailsModal";
import ContentEditable from "react-contenteditable";
import uniqid from "uniqid";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import NewMemoModal from "./NewMemoModal";
import { fetchAllSections } from "@/redux/features/sectionSlice";

const allProjects = createSelector(
  [(state) => state.project.allIds, (state) => state.project.byId],
  (allIds, byId) => {
    return allIds.map((id) => byId[id]);
  }
);

const ProjectPageSections = ({ project }) => {
  const { theme } = useTheme();
  const dispatch = useDispatch();
  const projectId = project._id;
  const [projectMemos, setProjectMemos] = useState([]);

  const submemoRef = useRef(null);
  const calendarRefs = useRef({});

  const [showCalendar, setShowCalendar] = useState({});
  const [showBigCalendar, setShowBigCalendar] = useState({});

  const [showMemoModal, setShowMemoModal] = useState(false);
  const [selectedMemo, setSelectedMemo] = useState(null);

  const [showNewMemoModal, setShowNewMemoModal] = useState(false);

  const [memoBody, setMemoBody] = useState("");
  const [memoDueDate, setMemoDueDate] = useState();
  const [memoNotes, setMemoNotes] = useState("");
  const [memoProgress, setMemoProgress] = useState("");
  const [memoProjects, setMemoProjects] = useState([]);
  const [memoParentId, setMemoParentId] = useState("");

  const [showEllipsis, setShowEllipsis] = useState(false);

  const projects = useSelector(allProjects);

  const [submemos, setSubmemos] = useState([]);
  const [newMemoLine, setNewMemoLine] = useState(false);
  const [newMemoText, setNewMemoText] = useState("");
  const [newSubMemoLine, setNewSubMemoLine] = useState(false);
  const [newSubMemoText, setNewSubMemoText] = useState("");

  const options = [
    { value: "Not Started", label: "Not Started" },
    { value: "Active", label: "Active" },
    { value: "Pending", label: "Pending" },
    { value: "Completed", label: "Completed" },
    { value: "Cancelled", label: "Cancelled" },
  ];
  const [projectOptions, setProjectOptions] = useState([]);

  const [newMemoTemplate, setNewMemoTemplate] = useState({
    body: "",
    dueDateTime: null,
    notes: "",
    progress: "Not Started",
    project: null,
    parentId: null,
  });

  const [projectSections, setProjectSections] = useState([]);
  console.log("project sections:", projectSections);
  const [newMemoSection, setNewMemoSection] = useState("");

  // set all the ongoing projects as the options for the dropdown
  useEffect(() => {
    const projectList = projects.map((project) => ({
      value: project._id,
      label: project.name,
    }));
    setProjectOptions(projectList);
  }, [projects]);

  // grab all memos for the specific project
  useEffect(() => {
    const getProjectParentMemos = async () => {
      try {
        const memos = await dispatch(fetchMemos()).unwrap();
        const filteredMemos = memos.filter(
          (memo) => memo.project && memo.project._id === projectId
        );
        setProjectMemos(filteredMemos);
        setMemoProjects(project);
        // setProjectOptions(projects);
      } catch (error) {
        console.error("Error getting a project's parent memos:", error);
      }
    };
    getProjectParentMemos();
  }, [dispatch, projectId]);

  // grab all sections for the specific project
  useEffect(() => {
    const getProjectSections = async () => {
      try {
        const sections = await dispatch(fetchAllSections(projectId)).unwrap();
        const filteredSections = sections.filter(
          (section) => section.project && section.project._id === projectId
        );
        setProjectSections(filteredSections);
      } catch (error) {
        console.error("Error getting a project's sections:", error);
      }
    };
    getProjectSections();
  }, [dispatch, projectId]);

  // SECTIONS
  const [ellipsisDropdown, setEllipsisDropdown] = useState(null);

  const getInitialSections = () => {
    const savedSections = JSON.parse(localStorage.getItem("sections"));
    if (savedSections) {
      return savedSections;
    }
    return [{ id: uniqid(), name: "My Memos", memos: [] }];
  };

  const [sections, setSections] = useState(getInitialSections);
  // console.log("sections:", sections);

  const sectionRefs = useRef(
    sections.reduce((acc, section) => {
      acc[section.id] = React.createRef();
      return acc;
    }, {})
  );

  useEffect(() => {
    if (projectMemos.length > 0) {
      setSections((currentSections) => {
        // Create a map for quick lookup
        const memoMap = new Map(projectMemos.map((memo) => [memo.id, memo]));

        // Transform all sections
        const updatedSections = currentSections.map((section) => {
          const updatedMemos = section.memos.map((memo) =>
            memoMap.has(memo.id) ? memoMap.get(memo.id) : memo
          );

          // Filter out memos that are no longer associated with this section
          return {
            ...section,
            memos: updatedMemos.filter((memo) => memoMap.has(memo.id)),
          };
        });

        // Now handle any memos not already placed in any section
        projectMemos.forEach((memo) => {
          const isPlaced = updatedSections.some((section) =>
            section.memos.some((existingMemo) => existingMemo.id === memo.id)
          );

          if (!isPlaced) {
            // For simplicity, add unplaced memos to the first section or a specific "unassigned" section
            updatedSections[0].memos.push(memo);
          }
        });

        return updatedSections;
      });
    }
  }, [projectMemos]);

  useEffect(() => {
    localStorage.setItem("sections", JSON.stringify(sections));
  }, [sections]);

  //   const handleNameChange = (id) => {
  //     console.log("section id:", id);
  //     const newName = sectionRefs.current[id].current.innerHTML;
  //     console.log("new name:", newName);
  //     setSections(
  //       sections.map((section) =>
  //         section.id === id ? { ...section, name: newName } : section
  //       )
  //     );
  //   };

  //   const handleSectionNameChange = (id, e) => {
  //     const newName = e.target.value;
  //     setSections((prevSections) =>
  //       prevSections.map((section) =>
  //         section.id === id ? { ...section, name: newName } : section
  //       )
  //     );
  //   };

  const handleSectionNameChange = useCallback((id, e) => {
    const newName = e.target.value;
    setSections((prevSections) =>
      prevSections.map((section) =>
        section.id === id ? { ...section, name: newName } : section
      )
    );
  }, []);

  const onAddSectionClick = () => {
    const newSection = { id: uniqid(), name: "Section Name", memos: [] };
    sectionRefs.current[newSection.id] = React.createRef();
    setSections([...sections, newSection]);
    // if there is no name and no memos, delete it
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

  //   useEffect(() => {
  //     dispatch(fetchMemos());
  //   }, [dispatch]);

  //MODAL TOGGLE
  const toggleMemoModal = async (memo) => {
    setSelectedMemo(memo);
    setMemoBody(memo.body || "");
    setMemoNotes(memo.notes || "");
    setMemoDueDate(memo.dueDateTime || "");
    setMemoParentId(memo.parentId || "");

    const foundProgress = options.find(
      (option) => option.value === memo.progress
    );
    setMemoProgress(foundProgress || options[0]);

    setMemoProjects(
      memo.project
        ? [{ value: memo.project._id, label: memo.project.name }]
        : []
    );
    if (showMemoModal === false) {
      setShowMemoModal(true);
    }
    try {
      const res = await dispatch(fetchChildrenMemos(memo._id)).unwrap();
      setSubmemos(res.children || []);
    } catch (error) {
      console.error("Error fetching children memos:", error);
    }
  };

  const toggleNewMemoModal = async (newMemoTemplate) => {
    setSelectedMemo(newMemoTemplate);
    setMemoBody(newMemoTemplate.body || "");
    setMemoNotes(newMemoTemplate.notes || "");
    setMemoDueDate(newMemoTemplate.dueDateTime || "");
    setMemoParentId(newMemoTemplate.parentId || "");

    const foundProgress = options.find(
      (option) => option.value === newMemoTemplate.progress
    );
    setMemoProgress(foundProgress || options[0]);

    setMemoProjects(
      newMemoTemplate.project
        ? [
            {
              value: newMemoTemplate.project._id,
              label: newMemoTemplate.project.name,
            },
          ]
        : []
    );
    if (showNewMemoModal === false) {
      setShowNewMemoModal(true);
    }
  };

  const handleClose = () => {
    setShowMemoModal(false);
    setShowNewMemoModal(false);
    setShowBigCalendar(false);
    setSelectedMemo(null);
  };

  //CHECKBOX
  const checkboxToggle = async (memo, memoId) => {
    const updatedMemo = {
      ...memo,
      progress: "Active",
    };
    try {
      await dispatch(updateMemo({ formData: updatedMemo, memoId: memo._id }));
      dispatch(fetchAllMemos());
    } catch (error) {
      console.error("Error updating memo:", error);
    }
  };

  //CALENDAR
  const toggleCalendar = (id) => {
    setShowCalendar((prevState) => {
      const newState = { ...prevState, [id]: !prevState[id] };
      return newState;
    });
  };

  const toggleBigCalendar = (id) => {
    setShowBigCalendar((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      Object.keys(calendarRefs.current).forEach((id) => {
        if (
          calendarRefs.current[id] &&
          !calendarRefs.current[id].contains(event.target)
        ) {
          setShowCalendar((prevState) => ({
            ...prevState,
            [id]: false,
          }));
        }
      });
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const changeDueDate = async (date, memo) => {
    // set up the updated memo structure to pass to the backend
    const updatedMemo = {
      ...memo,
      dueDateTime: date.toISOString(),
    };
    setMemoDueDate(date.toISOString());
    try {
      // update the selected memo via the backend
      await dispatch(updateMemo({ formData: updatedMemo, memoId: memo._id }));

      // then update the selected memo within the modal
      setSelectedMemo((prevMemo) => ({
        ...prevMemo,
        dueDateTime: updatedMemo.dueDateTime,
      }));

      // then update the memos listed in the project page
      setProjectMemos((prevMemos) => {
        return prevMemos.map((m) => {
          if (m._id === memo.id) {
            return { ...m, dueDateTime: date.toISOString() };
          }
          return m;
        });
      });
    } catch (error) {
      console.error("Error updating memo due date/time:", error);
    }
  };

  const clearDueDate = async (memo) => {
    // set up the updated memo structure to pass to the backend
    const updatedMemo = {
      ...memo,
      dueDateTime: null,
    };
    try {
      // update the selected memo via the backend
      await dispatch(updateMemo({ formData: updatedMemo, memoId: memo._id }));

      // then update the selected memo within the modal
      setSelectedMemo((prevMemo) => ({
        ...prevMemo,
        dueDateTime: null,
      }));

      // then update the memos listed in the project page
      setProjectMemos((prevMemos) => {
        return prevMemos.map((m) => {
          if (m._id === memo.id) {
            return { ...m, dueDateTime: null };
          }
          return m;
        });
      });
    } catch (error) {
      console.error("Error clearing memo due date/time:", error);
    }
  };

  //UPDATES
  const updateBody = async (memo) => {
    // set up the updated memo structure to pass to the backend
    const updatedMemo = {
      ...memo,
      body: memoBody,
    };
    try {
      // update the selected memo via the backend
      await dispatch(updateMemo({ formData: updatedMemo, memoId: memo._id }));

      // then update the selected memo within the modal
      setSelectedMemo((prevMemo) => ({
        ...prevMemo,
        body: memoBody,
      }));

      // then update the memos listed in the project page
      setProjectMemos((prevMemos) => {
        return prevMemos.map((m) => {
          if (m._id === memo.id) {
            return { ...m, body: memoBody };
          }
          return m;
        });
      });
    } catch (error) {
      console.error("Error updating memo body:", error);
    }
  };

  const updateNotes = async (memo) => {
    // set up the updated memo structure to pass to the backend
    const updatedMemo = {
      ...memo,
      notes: memoNotes,
    };
    try {
      // update the selected memo via the backend
      await dispatch(updateMemo({ formData: updatedMemo, memoId: memo._id }));

      // then update the selected memo within the modal
      setSelectedMemo((prevMemo) => ({
        ...prevMemo,
        notes: memoNotes,
      }));

      // then update the memos listed in the project page
      setProjectMemos((prevMemos) => {
        return prevMemos.map((m) => {
          if (m._id === memo.id) {
            return { ...m, notes: memoNotes };
          }
          return m;
        });
      });
    } catch (error) {
      console.error("Error updating memo notes:", error);
    }
  };

  const updateProgress = async (selectedOption) => {
    // set up the updated memo structure to pass to the backend
    const memoId = selectedMemo._id;
    const updatedMemo = {
      ...selectedMemo,
      progress: selectedOption[0].value,
    };
    setMemoProgress({
      value: selectedOption[0].value,
      label: selectedOption[0].label,
    });
    try {
      // update the selected memo via the backend
      await dispatch(
        updateMemo({
          formData: updatedMemo,
          memoId,
        })
      );

      // then update the selected memo within the modal
      setSelectedMemo((prevMemo) => ({
        ...prevMemo,
        progress: selectedOption[0].value,
      }));

      // then update the memos listed in the project page
      setProjectMemos((prevMemos) => {
        return prevMemos.map((m) => {
          if (m._id === memoId) {
            return { ...m, progress: selectedOption[0].value };
          }
          return m;
        });
      });
    } catch (error) {
      console.error("Error updating progress:", error);
    }
  };

  const toggleMemoProgress = async (memo) => {
    // set up the updated memo structure to pass to the backend
    const updatedProgress =
      memo.progress === "Completed" ? "Not Started" : "Completed";
    const updatedMemo = { ...memo, progress: updatedProgress };
    try {
      // update the selected memo via the backend
      await dispatch(updateMemo({ formData: updatedMemo, memoId: memo._id }));

      // then update the selected memo within the modal
      setSelectedMemo((prevMemo) => ({
        ...prevMemo,
        progress: updatedProgress,
      }));

      // then update the memos listed in the project page
      setProjectMemos((prevMemos) => {
        return prevMemos.map((m) => {
          if (m._id === memo.id) {
            return { ...m, progress: updatedProgress };
          }
          return m;
        });
      });
    } catch (error) {
      console.error("Error updating memo:", error);
    }
  };

  const updateProject = async (selectedOption) => {
    // set up the updated memo structure to pass to the backend
    const memoId = selectedMemo._id;
    const originalProjectId = selectedMemo.project._id;
    const updatedProject = selectedOption.length
      ? {
          _id: selectedOption[0].value,
          name: selectedOption[0].label,
        }
      : null;

    const updatedMemo = {
      ...selectedMemo,
      project: updatedProject ? updatedProject._id : null,
    };
    setMemoProjects({
      _id: selectedOption[0].value,
      name: selectedOption[0].label,
    });

    try {
      // update the selected memo via the backend
      await dispatch(
        updateMemo({
          formData: updatedMemo,
          memoId,
        })
      );

      // then update the selected memo within the modal
      setSelectedMemo((prevMemo) => ({
        ...prevMemo,
        project: updatedProject,
      }));

      // Fetch all memos again to reflect the updated project list
      const memos = await dispatch(fetchMemos()).unwrap();
      const filteredMemos = memos.filter(
        (memo) =>
          memo.project &&
          memo.project._id === originalProjectId &&
          memo._id !== memoId
      );

      setProjectMemos(filteredMemos);
    } catch (error) {
      console.error("Error updating project:", error);
    }
  };

  //SUBMEMO
  const createSubMemoClick = async (memo) => {
    if (!newSubMemoText.trim()) {
      setNewSubMemoLine(false);
    } else {
      try {
        const parentMemo = await dispatch(fetchMemo(memo._id));
        const formData = {
          body: newSubMemoText,
          parentId: memo._id,
          project: parentMemo.project ? parentMemo.project : undefined,
        };
        await dispatch(createMemo(formData));
        await dispatch(fetchAllMemos());
        const res = await dispatch(fetchChildrenMemos(memo._id)).unwrap();
        setSubmemos(res.children);
        setNewSubMemoText("");
        setNewSubMemoLine(false);
      } catch (error) {
        console.error("Error creating submemo:", error);
      }
    }
  };

  const handleSubMemoAddClick = () => {
    setNewSubMemoLine(true);
    setNewSubMemoText("");
  };

  //MEMO CRUD
  const handleAddClick = (sectionId) => {
    setNewMemoSection(sectionId);
    toggleNewMemoModal(newMemoTemplate);
  };

  const handleNewMemoSave = async () => {
    // use the section it was clicked in as well
    const projectId = projects.find(
      (project) => project.name === memoProjects[0].label
    );
    try {
      const newMemo = await dispatch(
        createMemo({
          body: memoBody,
          dueDateTime: memoDueDate,
          notes: memoNotes,
          progress: memoProgress.label,
          project: projectId._id,
          parentId: memoParentId || null,
        })
      ).unwrap();
      const adjustedMemo = {
        ...newMemo,
        id: newMemo._id,
        project: {
          // Standardize the project field format
          _id: newMemo.project,
          name: memoProjects[0].label,
        },
      };
      // console.log("adjusted Memo:", adjustedMemo);
      setProjectMemos((prevMemos) => {
        const updatedMemos = [...prevMemos, adjustedMemo];
        console.log("Updated memos:", updatedMemos);
        return updatedMemos;
      });

      // put the new memo in the section that matches the newMemoSection
      setSections((prevSections) => {
        return prevSections.map((section) => {
          if (section.id === newMemoSection) {
            // Only update the section where the memo should be added
            return {
              ...section,
              memos: [...section.memos, adjustedMemo],
            };
          }
          return section;
        });
      });

      setShowNewMemoModal(false);
      setShowBigCalendar(false);
      setSelectedMemo(null);
    } catch (error) {
      console.error("Error creating memo:", error);
    }
  };

  const clickEllipsis = () => {
    setShowEllipsis((prevState) => !prevState);
  };

  const clickDeleteMemo = async (memo) => {
    try {
      await dispatch(deleteMemo(memo._id));
      setProjectMemos((prevMemos) =>
        prevMemos.filter((m) => m._id !== memo._id)
      );
      setSelectedMemo(null);
      handleClose();
    } catch (error) {
      console.error("Error deleting memo:", error);
    }
  };

  const onDragEnd = (result) => {
    const { source, destination, draggableId, type } = result;

    // Do nothing if there's no destination or the item is dropped in the same place it was dragged from
    if (
      !destination ||
      (destination.droppableId === source.droppableId &&
        destination.index === source.index)
    ) {
      return;
    }

    if (type === "column") {
      // Handling column (section) reordering
      const newSections = Array.from(sections);
      const [movedSection] = newSections.splice(source.index, 1);
      newSections.splice(destination.index, 0, movedSection);

      setSections(newSections);
    } else if (type === "memo") {
      // Handling memo reordering within and between sections
      const startSectionIndex = sections.findIndex(
        (section) => section.id === source.droppableId
      );
      const finishSectionIndex = sections.findIndex(
        (section) => section.id === destination.droppableId
      );

      if (startSectionIndex === finishSectionIndex) {
        // Moving memos within the same section
        const section = sections[startSectionIndex];
        const newMemos = Array.from(section.memos);
        const [movedMemo] = newMemos.splice(source.index, 1);
        newMemos.splice(destination.index, 0, movedMemo);

        const newSection = { ...section, memos: newMemos };
        const updatedSections = Array.from(sections);
        updatedSections[startSectionIndex] = newSection;

        setSections(updatedSections);
      } else {
        // Moving memos between different sections
        const startSection = sections[startSectionIndex];
        const finishSection = sections[finishSectionIndex];

        const newStartMemos = Array.from(startSection.memos);
        const [movedMemo] = newStartMemos.splice(source.index, 1);

        const newFinishMemos = Array.from(finishSection.memos);
        newFinishMemos.splice(destination.index, 0, movedMemo);

        const newStartSection = { ...startSection, memos: newStartMemos };
        const newFinishSection = { ...finishSection, memos: newFinishMemos };

        const updatedSections = Array.from(sections);
        updatedSections[startSectionIndex] = newStartSection;
        updatedSections[finishSectionIndex] = newFinishSection;

        setSections(updatedSections);
      }
    }
  };

  return (
    <>
      {showNewMemoModal && selectedMemo && (
        <NewMemoModal
          selectedMemo={selectedMemo}
          showNewMemoModal={showNewMemoModal}
          handleClose={handleClose}
          toggleMemoProgress={toggleMemoProgress}
          clickEllipsis={clickEllipsis}
          showEllipsis={showEllipsis}
          clickDeleteMemo={clickDeleteMemo}
          toggleMemoModal={toggleMemoModal}
          setMemoBody={setMemoBody}
          updateBody={updateBody}
          toggleBigCalendar={toggleBigCalendar}
          showBigCalendar={showBigCalendar}
          clearDueDate={clearDueDate}
          calendarRefs={calendarRefs}
          changeDueDate={changeDueDate}
          updateProgress={updateProgress}
          projectOptions={projectOptions}
          memoProjects={memoProjects}
          updateProject={updateProject}
          setMemoProjects={setMemoProjects}
          memoNotes={memoNotes}
          memoBody={memoBody}
          setMemoNotes={setMemoNotes}
          updateNotes={updateNotes}
          options={options}
          memoProgress={memoProgress}
          handleSubMemoAddClick={handleSubMemoAddClick}
          newSubMemoLine={newSubMemoLine}
          submemoRef={submemoRef}
          setNewSubMemoText={setNewSubMemoText}
          submemos={submemos}
          createSubMemoClick={createSubMemoClick}
          handleNewMemoSave={handleNewMemoSave}
          newMemoSection={newMemoSection}
          projectId={projectId}
          projects={projects}
        />
      )}
      {showMemoModal && selectedMemo && (
        <MemoDetailsModal
          selectedMemo={selectedMemo}
          showMemoModal={showMemoModal}
          handleClose={handleClose}
          toggleMemoProgress={toggleMemoProgress}
          clickEllipsis={clickEllipsis}
          showEllipsis={showEllipsis}
          clickDeleteMemo={clickDeleteMemo}
          toggleMemoModal={toggleMemoModal}
          setMemoBody={setMemoBody}
          updateBody={updateBody}
          toggleBigCalendar={toggleBigCalendar}
          showBigCalendar={showBigCalendar}
          clearDueDate={clearDueDate}
          calendarRefs={calendarRefs}
          changeDueDate={changeDueDate}
          updateProgress={updateProgress}
          projectOptions={projectOptions}
          memoProjects={memoProjects}
          updateProject={updateProject}
          memoNotes={memoNotes}
          memoBody={memoBody}
          setMemoNotes={setMemoNotes}
          updateNotes={updateNotes}
          options={options}
          memoProgress={memoProgress}
          handleSubMemoAddClick={handleSubMemoAddClick}
          newSubMemoLine={newSubMemoLine}
          submemoRef={submemoRef}
          setNewSubMemoText={setNewSubMemoText}
          submemos={submemos}
          createSubMemoClick={createSubMemoClick}
        />
      )}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="scrollable-row">
          <Droppable
            droppableId="all-columns"
            direction="horizontal"
            type="column"
          >
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                <Row className="mt-4 flex-nowrap">
                  {sections.map((section, index) => (
                    <Col key={section.id} xs={3}>
                      <Draggable
                        key={section.id}
                        draggableId={section.id}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            style={provided.draggableProps.style}
                          >
                            <div className="drag-handle">
                              <Row className="mb-3">
                                <Col {...provided.dragHandleProps}>
                                  <ContentEditable
                                    innerRef={sectionRefs.current[section.id]}
                                    html={section.name}
                                    onChange={(e) =>
                                      handleSectionNameChange(section.id, e)
                                    }
                                    tagName="div"
                                    className="section-names"
                                    style={{
                                      width: "min-content",
                                      paddingLeft: "5px",
                                      paddingRight: "5px",
                                    }}
                                  />
                                </Col>
                                {index !== 0 && (
                                  <Col xs="auto">
                                    <div
                                      onClick={() =>
                                        onEllipsisClick(section.id)
                                      }
                                    >
                                      ...
                                    </div>
                                    {ellipsisDropdown === section.id && (
                                      <Row>
                                        <Col>
                                          <div
                                            onClick={() =>
                                              onDeleteSectionClick(section.id)
                                            }
                                          >
                                            Delete
                                          </div>
                                        </Col>
                                      </Row>
                                    )}
                                  </Col>
                                )}
                              </Row>
                              <Row>
                                <Droppable droppableId={section.id} type="memo">
                                  {(provided) => (
                                    <Col>
                                      <div
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                        style={{
                                          minHeight: "20px",
                                          paddingBottom: "20px",
                                        }}
                                      >
                                        {section.memos.map(
                                          (memo, memoIndex) => (
                                            <Draggable
                                              key={memo.id}
                                              draggableId={memo.id}
                                              index={memoIndex}
                                            >
                                              {(provided) => (
                                                <div
                                                  ref={provided.innerRef}
                                                  {...provided.draggableProps}
                                                  {...provided.dragHandleProps}
                                                  className="memo-box"
                                                  onClick={() =>
                                                    toggleMemoModal(memo)
                                                  }
                                                >
                                                  <li
                                                    key={memo._id}
                                                    style={{
                                                      display: "flex",
                                                      alignItems: "center",
                                                      gap: "10px",
                                                      width: "100%",
                                                    }}
                                                  >
                                                    <MdCheckBoxOutlineBlank
                                                      onClick={() =>
                                                        checkboxToggle(
                                                          memo,
                                                          memo._id
                                                        )
                                                      }
                                                    />
                                                    <ul
                                                      style={{
                                                        flex: 1,
                                                        display: "flex",
                                                        justifyContent:
                                                          "space-between",
                                                      }}
                                                    >
                                                      <li>{memo.body}</li>
                                                      {memo.dueDateTime && (
                                                        <li
                                                          onClick={(e) => {
                                                            e.preventDefault();
                                                            toggleCalendar(
                                                              memo._id
                                                            );
                                                          }}
                                                          style={{
                                                            color: "grey",
                                                          }}
                                                        >
                                                          {format(
                                                            parseISO(
                                                              memo.dueDateTime
                                                            ),
                                                            "MMM d"
                                                          )}
                                                        </li>
                                                      )}
                                                    </ul>
                                                    <div
                                                      ref={(el) =>
                                                        (calendarRefs.current[
                                                          memo._id
                                                        ] = el)
                                                      }
                                                      style={{
                                                        position: "relative",
                                                      }}
                                                    >
                                                      {!memo.dueDateTime && (
                                                        <CiCalendar
                                                          onClick={() =>
                                                            toggleCalendar(
                                                              memo._id
                                                            )
                                                          }
                                                        />
                                                      )}
                                                      {showCalendar[
                                                        memo._id
                                                      ] && (
                                                        <div
                                                          style={{
                                                            position:
                                                              "absolute",
                                                            zIndex: 1000,
                                                            top: "100%",
                                                            left: 0,
                                                          }}
                                                        >
                                                          <Calendar
                                                            onChange={(
                                                              date
                                                            ) => {
                                                              changeDueDate(
                                                                date,
                                                                memo
                                                              );
                                                              toggleCalendar(
                                                                memo._id
                                                              );
                                                            }}
                                                            value={
                                                              memo.dueDateTime
                                                                ? parseISO(
                                                                    memo.dueDateTime
                                                                  )
                                                                : null
                                                            }
                                                            calendarType={
                                                              "gregory"
                                                            }
                                                          />
                                                        </div>
                                                      )}
                                                    </div>
                                                  </li>
                                                </div>
                                              )}
                                            </Draggable>
                                          )
                                        )}
                                        {provided.placeholder}
                                      </div>
                                    </Col>
                                  )}
                                </Droppable>
                              </Row>
                              <Row>
                                <Col>
                                  <Button
                                    onClick={() => handleAddClick(section.id)}
                                  >
                                    + Add Memo
                                  </Button>
                                </Col>
                              </Row>
                            </div>
                            {provided.placeholder}
                          </div>
                        )}
                      </Draggable>
                    </Col>
                  ))}
                  <Col xs={3}>
                    <Button onClick={onAddSectionClick}>+ Add Section</Button>
                  </Col>
                </Row>
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      </DragDropContext>
    </>
  );
};

export default ProjectPageSections;
