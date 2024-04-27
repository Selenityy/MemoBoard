import { useState, useEffect } from "react";
import "../styles/custom.scss";
import { Button, Col, Container, Row, Stack } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { fetchProjects } from "@/redux/features/projectSlice";
import { selectProjects } from "@/helpers/projectSelectors";
import { IoMdAdd } from "react-icons/io";
import ProjectModal from "./ProjectModal";

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
    <>
      {/* <Container className="nav-bar-contatiner"> */}
      <Stack gap={2}>
        <Row>
          <Col>
            <span>Home</span>
          </Col>
        </Row>
        <Row>
          <Col>
            <span>My Memos</span>
          </Col>
        </Row>
        <Row>
          <Col>
            <span>Today</span>
          </Col>
        </Row>
        <Row>
          <Col>
            <span>This Week</span>
          </Col>
        </Row>
        <Row>
          <Col>
            <hr></hr>
          </Col>
        </Row>
        <Row style={{ height: "100%" }}>
          <Col xs={12}>
            <Row className="align-items-center justify-content-between mb-2">
              <Col xs={8}>
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
            {projects.map((project) => (
              <Row key={project._id}>
                <Col>
                  <ul className="ps-3 mb-3">
                    <li className="p-0">
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <div
                          style={{
                            width: "20px",
                            height: "20px",
                            borderRadius: "7px",
                            backgroundColor: project.color,
                            marginRight: "10px",
                          }}
                        ></div>
                        <span>{project.name}</span>
                      </div>
                    </li>
                  </ul>
                </Col>
              </Row>
            ))}
          </Col>
        </Row>
      </Stack>
      <ProjectModal show={modalShow} onHide={() => setModalShow(false)} />
      {/* </Container> */}
    </>
  );
};

export default NavBar;
