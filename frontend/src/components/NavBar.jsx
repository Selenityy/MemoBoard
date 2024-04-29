import { useState, useEffect } from "react";
import "../styles/main.scss";
import { Button, Col, Container, Row, Stack } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
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

const NavBar = () => {
  const dispatch = useDispatch();
  const projects = useSelector(selectProjects);
  const [refreshDataTrigger, setRefreshDataTrigger] = useState(false);
  const [modalShow, setModalShow] = useState(false);

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

  return (
    <Container fluid style={{ padding: "0px" }}>
      <Row className="align-items-center nav-icon-row">
        <Col xs="auto">
          <RiHome2Line className="nav-icon-home" />
        </Col>
        <Col className="nav-bar-titles">
          <span>Home</span>
        </Col>
      </Row>
      <Row className="align-items-center nav-icon-row">
        <Col xs="auto">
          <FaRegCheckCircle className="nav-icon-memos" />
        </Col>
        <Col className="nav-bar-titles">
          <span>My Memos</span>
        </Col>
      </Row>
      <Row className="align-items-center nav-icon-row">
        <Col xs="auto">
          <IoTodayOutline className="nav-icon-today" />
        </Col>
        <Col className="nav-bar-titles">
          <span>Today</span>
        </Col>
      </Row>
      <Row className="align-items-center nav-icon-row">
        <Col xs="auto">
          <BsCalendar4Week className="nav-icon-week" />
        </Col>
        <Col className="nav-bar-titles">
          <span>This Week</span>
        </Col>
      </Row>
      <Row>
        <Col className="full-width-hr">
          <hr />
        </Col>
      </Row>
      {/* PROJECTS */}
      <Row className="justify-content-bewteen align-items-center">
        <Col className="project-span">
          <span>Projects</span>
        </Col>
        <Col xs="auto">
          <button
            className="add-project-btn"
            onClick={() => setModalShow(true)}
          >
            <IoMdAdd size={20} className="me-2" />
          </button>
        </Col>
      </Row>
      <Stack gap={3}>
        {projects.map((project) => (
          <Row key={project._id} className="align-items-center project-rows">
            <Col>
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
                    <span className="project-names">{project.name}</span>
                  </div>
                </li>
              </ul>
            </Col>
          </Row>
        ))}
      </Stack>
      <ProjectModal show={modalShow} onHide={() => setModalShow(false)} />
    </Container>
  );
};

export default NavBar;
