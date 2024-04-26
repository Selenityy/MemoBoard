import { useState, useEffect } from "react";
import "../styles/custom.scss";
import { Button, Col, Container, Row, Stack } from "react-bootstrap";
import LogoutBtn from "./LogoutBtn";
import { useSelector, useDispatch } from "react-redux";
import { fetchProjects } from "@/redux/features/projectSlice";
import { selectProjects } from "@/helpers/projectSelectors";
import { IoMdAdd } from "react-icons/io";

const NavBar = () => {
  const dispatch = useDispatch();

  const projects = useSelector(selectProjects);

  const [refreshDataTrigger, setRefreshDataTrigger] = useState(false);

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
            <Row className="align-items-center justify-content-between">
              <Col xs={8}>
                <span>Projects</span>
              </Col>
              <Col xs="auto">
                {/* <Button size="sm" className="btn-custom"> */}
                <IoMdAdd size={20} className="me-2" />
                {/* </Button> */}
              </Col>
            </Row>
            {/* </Col> */}
            {/* </Row> */}
            {projects.map((project) => (
              <Row key={project._id}>
                <Col>
                  <ul>
                    <li>{project.name}</li>
                  </ul>
                </Col>
              </Row>
            ))}
          </Col>
          {/* </Row> */}
          {/* <Row className="row-gap-3"> */}
          {/* <Col>
            <LogoutBtn />
          </Col> */}
        </Row>
      </Stack>
      {/* </Container> */}
    </>
  );
};

export default NavBar;
