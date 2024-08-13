"use client";

import { useState, useEffect } from "react";
import "../styles/main.scss";
import { Button, Col, Container, Row, Stack } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { useTheme } from "@/context/ThemeContext";
import { fetchProjects } from "@/redux/features/projectSlice";
import { selectProjects } from "@/helpers/projectSelectors";
import { IoMdAdd } from "react-icons/io";
import ProjectModal from "./ProjectModal";
import { RiHome2Line } from "react-icons/ri";
import { FaRegCheckCircle } from "react-icons/fa";
import { MdToday } from "react-icons/md";
import { BsCalendarWeek } from "react-icons/bs";
import { IoTodayOutline } from "react-icons/io5";
import { BsCalendar4Week } from "react-icons/bs";
import { useRouter } from "next/navigation";

const MobileNavBar = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const projects = useSelector(selectProjects);
  const [refreshDataTrigger, setRefreshDataTrigger] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    const updateProjects = async () => {
      try {
        await dispatch(fetchProjects());
      } catch (error) {
        console.error("Failed to get the projects:", error);
      }
    };
    updateProjects();
  }, [dispatch, refreshDataTrigger]);

  const homeClick = () => {
    router.push("/dashboard");
  };

  const allMemoClick = () => {
    // router.push("/dashboard/all-tasks");
  };

  const todayMemoClick = () => {
    // router.push("/dashboard/today-tasks");
  };

  const weekMemoClick = () => {
    // router.push("/dashboard/week-tasks");
  };

  const projectClick = (project) => {
    const formattedProjectName = project.name.replace(/\s+/g, "-");
    const projectId = project._id;
    router.push(`/dashboard/project/${formattedProjectName}-${projectId}`);
  };

  return (
    <Container
      fluid
      className={
        theme === "dark"
          ? "mobile-nav-bar-container-dark"
          : "mobile-nav-bar-container-light"
      }
    >
      <Row
        className={`${
          theme === "dark" ? "nav-icon-row-dark" : "nav-icon-row-light"
        } align-items-center nav-icon-row`}
        onClick={() => homeClick()}
      >
        <Col xs="auto">
          <RiHome2Line
            className={
              theme === "dark" ? "nav-icon-home-dark" : "nav-icon-home-light"
            }
          />
        </Col>
      </Row>
      <Row
        className={`${
          theme === "dark" ? "nav-icon-row-dark" : "nav-icon-row-light"
        } align-items-center nav-icon-row`}
        onClick={() => allMemoClick()}
      >
        <Col xs="auto">
          <FaRegCheckCircle
            className={
              theme === "dark" ? "nav-icon-memo-dark" : "nav-icon-memo-light"
            }
          />
        </Col>
      </Row>
      <Row
        className={`${
          theme === "dark" ? "nav-icon-row-dark" : "nav-icon-row-light"
        } align-items-center nav-icon-row`}
        onClick={() => todayMemoClick()}
      >
        <Col xs="auto">
          <IoTodayOutline
            className={
              theme === "dark" ? "nav-icon-today-dark" : "nav-icon-today-light"
            }
          />
        </Col>
      </Row>
      <Row
        className={`${
          theme === "dark" ? "nav-icon-row-dark" : "nav-icon-row-light"
        } align-items-center nav-icon-row`}
        onClick={() => weekMemoClick()}
      >
        <Col xs="auto">
          <BsCalendar4Week
            className={
              theme === "dark" ? "nav-icon-week-dark" : "nav-icon-week-light"
            }
          />
        </Col>
      </Row>
      <Row
        className={`${
          theme === "dark" ? "nav-icon-row-dark" : "nav-icon-row-light"
        } align-items-center nav-icon-row`}
        onClick={() => setModalShow(true)}
      >
        <Col xs="auto">
          <button
            className={
              theme === "dark"
                ? "add-project-btn-dark"
                : "add-project-btn-light"
            }
            // onClick={() => setModalShow(true)}
          >
            <IoMdAdd size={20} className="me-2" />
          </button>
        </Col>
      </Row>
      {/* PROJECTS */}
      {/* <Row className="justify-content-bewteen align-items-center d-none d-md-block">
        <Col xs="auto">
          <button
            className={
              theme === "dark"
                ? "add-project-btn-dark"
                : "add-project-btn-light"
            }
            onClick={() => setModalShow(true)}
          >
            <IoMdAdd size={20} className="me-2" />
          </button>
        </Col>
      </Row> */}
      {/* <Stack>
        {projects.map((project) => (
          <Row
            key={project._id}
            className={`align-items-center ${
              theme === "dark" ? "project-rows-dark" : "project-rows-light"
            }`}
          >
            <Col onClick={() => projectClick(project)}>
              <ul className="ps-1">
                <li className="p-0">
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <div
                      style={{
                        width: "15px",
                        height: "15px",
                        borderRadius: "4px",
                        backgroundColor: project.color,
                        marginRight: "10px",
                      }}
                    ></div>
                    <span
                      className={
                        theme === "dark"
                          ? "project-names-dark"
                          : "project-names-light"
                      }
                    >
                      {project.name}
                    </span>
                  </div>
                </li>
              </ul>
            </Col>
          </Row>
        ))}
      </Stack> */}
      <ProjectModal show={modalShow} onHide={() => setModalShow(false)} />
    </Container>
  );
};

export default MobileNavBar;
