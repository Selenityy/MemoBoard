"use client";

import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from "react";
import { Row, Col, Button, Container } from "react-bootstrap";
import { MdCheckBoxOutlineBlank, MdCheckBox } from "react-icons/md";
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
import { format, parseISO } from "date-fns";
import Calendar from "react-calendar";
import { CiCalendar } from "react-icons/ci";
import "react-calendar/dist/Calendar.css";
import MemoDetailsModal from "./MemoDetailsModal";
import ContentEditable from "react-contenteditable";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import NewMemoModal from "./NewMemoModal";
import {
  addAllMemosToSection,
  addMemoToSection,
  createSection,
  deleteSection,
  fetchAllSections,
  updateSection,
  removeMemoFromAllSections,
} from "@/redux/features/sectionSlice";
import { updateProject } from "@/redux/features/projectSlice";
import { debounce, filter } from "lodash";
import { synchronizeMemos } from "@/redux/features/memoSlice";

const allProjects = createSelector(
  [(state) => state.project.allIds, (state) => state.project.byId],
  (allIds, byId) => {
    return allIds.map((id) => byId[id]);
  }
);

const sectionsFromSlice = createSelector(
  [
    (state) => state.section.allIds,
    (state) => state.section.byId,
    (state, projectId) => projectId,
  ],
  (allIds, byId, projectId) => {
    return allIds
      .map((id) => byId[id])
      .filter((section) => section.project === projectId);
  }
);

const memosFromSlice = createSelector(
  [(state) => state.memo.allIds, (state) => state.memo.byId],
  (allIds, byId) => {
    return allIds.map((id) => byId[id]);
  }
);

const ProjectPageSections = ({ project }) => {
  const { theme } = useTheme();
  const dispatch = useDispatch();
  // const allSectionsAllIds = useSelector((state) => state.section.allIds);
  // const allSectionsById = useSelector((state) => state.section.byId);
  // console.log("allSectionsAllIds:", allSectionsAllIds);
  // console.log("allSectionsById:", allSectionsById);

  const getSectionsFromSlice = useMemo(
    () => sectionsFromSlice,
    [sectionsFromSlice]
  );

  const projectSections = useSelector((state) =>
    getSectionsFromSlice(state, project._id)
  );
  // console.log("get sections of project", projectSections);

  // const allMemos = useSelector(memosFromSlice);
  // console.log("all memos from slice:", allMemos);

  const projectId = project._id;
  const [projectMemos, setProjectMemos] = useState([]);
  // console.log("are there project memos:", projectMemos);

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
  // console.log("memo progress page selection:", memoProgress);
  // console.log("memo projects page seletcion:", memoProjects);
  const [showEllipsis, setShowEllipsis] = useState(false);

  const projects = useSelector(allProjects);
  // console.log("all projects selector", projects);

  const [submemos, setSubmemos] = useState([]);
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
  // console.log("project options:", projectOptions);

  const [newMemoTemplate, setNewMemoTemplate] = useState({
    body: "",
    dueDateTime: null,
    notes: "",
    progress: "Not Started",
    project: null,
    parentId: null,
    submemos: [],
  });

  const [ellipsisDropdown, setEllipsisDropdown] = useState(null);
  const [newMemoSection, setNewMemoSection] = useState("");

  const [lastUpdate, setLastUpdate] = useState(Date.now());

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
        // console.log("project mew:", project);

        setMemoProjects(project);
      } catch (error) {
        console.error("Error getting a project's parent memos:", error);
      }
    };
    getProjectParentMemos();
  }, [dispatch, projectId, lastUpdate]);

  // useEffect to fetch sections
  useEffect(() => {
    if (projectSections.length >= 2) {
      console.log("project sections is 2 or more");
      const fetchSections = async () => {
        try {
          await dispatch(fetchAllSections(projectId)).unwrap();
        } catch (error) {
          console.error("Error creating a new project sections:", error);
        }
      };
      fetchSections();
    }
  }, [dispatch, projectSections.length, projectId, lastUpdate]);

  useEffect(() => {
    async function handleSectionInitialization() {
      if (projectSections.length === 0 && projectMemos.length > 0) {
        console.log("Initializing new section...");
        try {
          const formData = {
            user: project.user,
            name: "To Do",
            memo: [],
            index: 0,
            project: projectId,
          };
          const newSection = await dispatch(
            createSection({ projectId, formData })
          ).unwrap();
          console.log("New section created:", newSection);

          // Add memos to newly created section if applicable
          const selectedMemos = projectMemos.map((memo) => memo.id);
          const addedMemos = await dispatch(
            addAllMemosToSection({
              sectionId: newSection._id,
              projectId,
              selectedMemos,
            })
          );
          console.log("added memos:", addedMemos);

          // Update project redux
          const projectData = { sections: [newSection._id] };
          console.log("projectData:", projectData);
          await dispatch(
            updateProject({
              projectId,
              projectData,
            })
          );
        } catch (error) {
          console.error("Error during section initialization:", error);
        }
      }
    }

    handleSectionInitialization();
  }, [dispatch, projectId, project.user, projectSections, projectMemos]);

  const sectionRefs = useRef(
    projectSections.reduce((acc, section) => {
      acc[section.id] = React.createRef();
      return acc;
    }, {})
  );

  const onAddSectionClick = async () => {
    console.log("inside add section");
    const currentSections = projectSections; // Assuming this is up to date with all current sections
    const newIndex =
      currentSections.length > 0
        ? Math.max(...currentSections.map((s) => s.index)) + 1
        : 0;
    try {
      const formData = {
        user: project.user,
        name: "New Section",
        memos: [],
        index: newIndex,
        project: projectId,
      };
      const newSection = await dispatch(
        createSection({ projectId, formData })
      ).unwrap();
      console.log("new section:", newSection);

      const updatedSectionIds = [
        ...currentSections.map((section) => section._id),
        newSection._id,
      ];
      console.log("updated section ids:", updatedSectionIds);

      const res = await dispatch(
        updateProject({
          projectId,
          projectData: { sections: updatedSectionIds },
        })
      );
      console.log("res:", res);
    } catch (error) {
      console.error("Error adding a section:", error);
    }
  };

  const handleSectionNameChange = useCallback(
    debounce(async (id, e) => {
      const newName = e.target.value;
      try {
        await dispatch(
          updateSection({
            projectId: project._id,
            sectionId: id,
            sectionData: { name: newName },
          })
        ).unwrap();
      } catch (error) {
        console.error("Error updating section name:", error);
      }
    }, 500),
    [dispatch, project._id]
  );

  const onEllipsisClick = (sectionId) => {
    setEllipsisDropdown(ellipsisDropdown === sectionId ? null : sectionId);
  };

  const onDeleteSectionClick = async (sectionId) => {
    // find the section to delete
    const sectionToDelete = projectSections.find(
      (section) => section._id === sectionId
    );

    // check if there are no memos in the section
    if (sectionToDelete.memos.length > 0) {
      alert("Please remove all memos from the section before deleting it.");
      console.error(
        "Please remove all memos from the section before deleting it."
      );
      return;
    }

    try {
      // remove the section from the backend logic
      await dispatch(
        deleteSection({
          sectionId,
          projectId: sectionToDelete.project,
        })
      ).unwrap();

      // update the project redux to sections without the deleted one
      const updatedSections = projectSections.filter(
        (section) => section._id !== sectionId
      );

      await dispatch(
        updateProject({
          projectId: sectionToDelete.project,
          projectData: {
            sections: updatedSections.map((section) => section._id),
          },
        })
      );

      await dispatch(fetchAllSections(sectionToDelete.project));

      setLastUpdate(Date.now());
    } catch (error) {
      console.error("Error deleteing section:", error);
    }
  };

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

    const foundProject = projects.find(
      (p) => p._id === (memo.project._id || memo.project)
    );
    setMemoProjects([{ value: foundProject._id, label: foundProject.name }]);

    // setMemoProjects(
    //   memo.project
    //     ? [{ value: memo.project._id, label: memo.project.name }]
    //     : []
    // );
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
    setSubmemos(newMemoTemplate.submemos || "");

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
      setLastUpdate(Date.now());
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
      setLastUpdate(Date.now());
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
      setLastUpdate(Date.now());
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
      setLastUpdate(Date.now());
    } catch (error) {
      console.error("Error updating memo notes:", error);
    }
  };

  const updateProgress = async (selectedOption) => {
    // console.log("selected option progress:", selectedOption);
    // set up the updated memo structure to pass to the backend
    const memoId = selectedMemo._id;
    const updatedMemo = {
      ...selectedMemo,
      progress: selectedOption[0].value,
    };
    // console.log("progress updated memo:", updatedMemo);
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
      ).unwrap();

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
      setLastUpdate(Date.now());
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
      setLastUpdate(Date.now());
    } catch (error) {
      console.error("Error updating memo:", error);
    }
  };

  const updateProjectMemos = async (selectedOption) => {
    // set up the updated memo structure to pass to the backend
    const memoId = selectedMemo._id;
    const originalProjectId = selectedMemo.project;
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

      // Remove memo from old project's sections
      if (originalProjectId && originalProjectId !== updatedProject._id) {
        await dispatch(
          removeMemoFromAllSections({ projectId: originalProjectId, memoId })
        );
      }

      // Remove memo from old project
      if (originalProjectId && originalProjectId !== updatedProject._id) {
        await dispatch(
          updateProject({
            projectId: originalProjectId,
            projectData: { removeMemos: [memoId] },
          })
        );
      }

      // Conditionally add memo to new project
      if (updatedProject && originalProjectId !== updatedProject._id) {
        await dispatch(
          updateProject({
            projectId: updatedProject._id,
            projectData: { addMemos: [memoId] },
          })
        );

        // Find the first section in the new project to add the memo
        const sections = await dispatch(
          fetchAllSections(updatedProject._id)
        ).unwrap();
        if (sections.length > 0) {
          await dispatch(
            addMemoToSection({
              sectionId: sections[0]._id,
              projectId: updatedProject._id,
              memoId,
            })
          );
        }
      }

      // Fetch all memos again to reflect the updated project list
      const memos = await dispatch(fetchMemos()).unwrap();
      const filteredMemos = memos.filter(
        (memo) =>
          memo.project &&
          memo.project._id === originalProjectId &&
          memo._id !== memoId
      );
      setProjectMemos(filteredMemos);
      setLastUpdate(Date.now());
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
    // find the project label
    const selectedProject = projects.find(
      (project) => project.name === memoProjects[0].label
    );

    const formData = {
      body: memoBody,
      dueDateTime: memoDueDate,
      notes: memoNotes,
      progress: memoProgress.label,
      project: selectedProject._id,
      parentId: memoParentId || null,
    };

    try {
      // create new memo in redux & backend
      const newMemo = await dispatch(createMemo(formData)).unwrap();

      // find the section it was clicked in
      if (newMemoSection) {
        const updatedSectionData = {
          memos: [
            ...projectSections.find((section) => section._id === newMemoSection)
              .memos,
            newMemo._id,
          ],
        };

        // update the section in redux & backend
        await dispatch(
          updateSection({
            sectionId: newMemoSection,
            projectId: selectedProject._id,
            sectionData: updatedSectionData,
          })
        ).unwrap();

        // update the project in redux & backend
        await dispatch(
          updateProject({
            projectId: selectedProject._id,
            projectData: {
              memos: selectedProject.memos.map((memo) => memo._id),
            },
          })
        ).unwrap();
      }

      // reset for next new memo
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
    const memoId = memo._id;
    try {
      // delete memo from backend
      await dispatch(deleteMemo(memo._id));

      // update section redux
      const sectionToUpdate = projectSections.find((section) =>
        section.memos.some((memo) => memo._id === memoId)
      );
      if (sectionToUpdate) {
        const updatedSectionMemos = sectionToUpdate.memos.filter(
          (id) => id !== memo._id
        );

        await dispatch(
          updateSection({
            sectionId: sectionToUpdate._id,
            projectId: projectId,
            sectionData: { memos: updatedSectionMemos },
          })
        ).unwrap();
      }

      // remove memo from redux state
      setProjectMemos((prevMemos) =>
        prevMemos.filter((m) => m._id !== memo._id)
      );

      // update project
      const updatedProjectMemos = projectMemos.filter(
        (m) => m._id !== memo._id
      );
      await dispatch(
        updateProject({
          projectId: projectId,
          projectData: {
            memos: updatedProjectMemos.map((memo) => memo._id),
          },
        })
      ).unwrap();

      // UI clean up
      setSelectedMemo(null);
      handleClose();
    } catch (error) {
      console.error("Error deleting memo:", error);
    }
  };

  const onDragEnd = async (result) => {
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
      const newSections = Array.from(projectSections);
      const [movedSection] = newSections.splice(source.index, 1);
      newSections.splice(destination.index, 0, movedSection);

      // Prepare updated sections with new indexes
      const updatedSections = newSections.map((section, index) => ({
        ...section,
        index: index,
      }));

      updatedSections.forEach(async (section) => {
        try {
          await dispatch(
            updateSection({
              sectionId: section._id,
              projectId: section.project,
              sectionData: { index: section.index },
            })
          ).unwrap();
        } catch (error) {
          console.error("Error updating section index:", error);
        }
      });

      try {
        const updatedSectionIds = updatedSections.map((section) => section._id);
        await dispatch(
          updateProject({
            projectId: projectId,
            projectData: { sections: updatedSectionIds },
          })
        ).unwrap();
      } catch (error) {
        console.error("Error updating project with new sections:", error);
      }
    } else if (type === "memo") {
      // Handling memo reordering within and between sections
      const startSectionIndex = projectSections.findIndex(
        (section) => section._id === source.droppableId
      );
      const finishSectionIndex = projectSections.findIndex(
        (section) => section._id === destination.droppableId
      );

      if (startSectionIndex === finishSectionIndex) {
        // Moving memos within the same section
        const section = projectSections[startSectionIndex];
        const newMemos = Array.from(section.memos);
        const [movedMemo] = newMemos.splice(source.index, 1);
        newMemos.splice(destination.index, 0, movedMemo);

        const updatedSection = { ...section, memos: newMemos };

        try {
          // Update the section with the new memos order
          await dispatch(
            updateSection({
              sectionId: section._id,
              projectId: section.project,
              sectionData: {
                memos: updatedSection.memos.map((memo) => memo._id),
              },
            })
          ).unwrap();
        } catch (error) {
          console.error("Error updating memo order within section:", error);
        }
      } else {
        // Moving memos between different sections
        const startSection = projectSections[startSectionIndex];
        const finishSection = projectSections[finishSectionIndex];

        const newStartMemos = Array.from(startSection.memos);
        const [movedMemo] = newStartMemos.splice(source.index, 1);

        const newFinishMemos = Array.from(finishSection.memos);
        newFinishMemos.splice(destination.index, 0, movedMemo);

        const newStartSection = { ...startSection, memos: newStartMemos };
        const newFinishSection = { ...finishSection, memos: newFinishMemos };

        try {
          // Update start section
          await dispatch(
            updateSection({
              sectionId: newStartSection._id,
              projectId: newStartSection.project,
              sectionData: {
                memos: newStartSection.memos.map((memo) => memo._id),
              },
            })
          ).unwrap();

          // Update finish section
          await dispatch(
            updateSection({
              sectionId: newFinishSection._id,
              projectId: newFinishSection.project,
              sectionData: {
                memos: newFinishSection.memos.map((memo) => memo._id),
              },
            })
          ).unwrap();
        } catch (error) {
          console.error("Error updating sections:", error);
        }
      }
    }
  };

  const handleSync = () => {
    dispatch(synchronizeMemos());
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
          updateProjectMemos={updateProjectMemos}
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
          updateProjectMemos={updateProjectMemos}
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
      {/* <button onClick={handleSync}>Synchronize Memos</button> */}
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
                  {projectSections.map((section, index) => (
                    <Col key={section._id} xs={3}>
                      <Draggable
                        key={section._id}
                        draggableId={section._id}
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
                                    innerRef={sectionRefs.current[section._id]}
                                    html={section.name}
                                    onChange={(e) =>
                                      handleSectionNameChange(section._id, e)
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
                                        onEllipsisClick(section._id)
                                      }
                                    >
                                      ...
                                    </div>
                                    {ellipsisDropdown === section._id && (
                                      <Row>
                                        <Col>
                                          <div
                                            onClick={() =>
                                              onDeleteSectionClick(section._id)
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
                                <Droppable
                                  droppableId={section._id}
                                  type="memo"
                                >
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
                                              key={memo._id}
                                              draggableId={memo._id}
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
                                                    {memo.progress ===
                                                    "Completed" ? (
                                                      <MdCheckBox
                                                        onClick={() =>
                                                          checkboxToggle(
                                                            memo,
                                                            memo._id
                                                          )
                                                        }
                                                        style={{
                                                          color: "green",
                                                        }}
                                                      />
                                                    ) : (
                                                      <MdCheckBoxOutlineBlank
                                                        onClick={() =>
                                                          checkboxToggle(
                                                            memo,
                                                            memo._id
                                                          )
                                                        }
                                                      />
                                                    )}
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
                                                        // onClick={() =>
                                                        //   toggleCalendar(
                                                        //     memo._id
                                                        //   )
                                                        // }
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
                                    onClick={() => handleAddClick(section._id)}
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
