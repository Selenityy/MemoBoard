import Modal from "react-bootstrap/Modal";
import React, { useState } from "react";
import { Button, Col, Container, Row, Form } from "react-bootstrap";
import { useTheme } from "@/context/ThemeContext";
import { useDispatch } from "react-redux";

const ProjectModal = (props) => {
  const { theme } = useTheme();
  const dispatch = useDispatch();
  const [projectDetails, setProjectDetails] = useState({
    name: "",
    color: "#C8A2C8",
    description: "",
  });
  const [validated, setValidated] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProjectDetails((prev) => ({ ...prev, [name]: value }));
  };

  const addProjectSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
    }
    setValidated(true);
    try {
      const res = await dispatch(createProject(projectDetails)).unwrap();
      console.log("res", res);
      setProjectDetails({
        name: "",
        color: "#C8A2C8",
        description: "",
      });
      setValidated(false);
      setErrorMessage("");
    } catch (error) {
      setErrorMessage(error);
      setValidated(false);
      console.error("Server error failed to add project:", error);
    }
  };

  const closeModal = async (e) => {
    e.preventDefault();
    props.onHide();
    setProjectDetails({
      name: "",
      color: "#C8A2C8",
      description: "",
    });
  };

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="project-modal-title-vcenter"
      centered
      dialogClassName="custom-modal-width"
    >
      <Modal.Header className={theme === "dark" ? "modal-dark" : "modal-light"}>
        <Modal.Title id="project-modal-title-vcenter">Add Project</Modal.Title>
      </Modal.Header>
      <Modal.Body className={theme === "dark" ? "modal-dark" : "modal-light"}>
        <Container>
          <Form noValidate validated={validated}>
            <Row className="justify-content-between">
              <Col xs={9}>
                <Form.Group className="mb-3" controlId="formName">
                  <Form.Label>Name:</Form.Label>
                  <Form.Control
                    className={
                      theme === "dark"
                        ? "project-form-styling-dark"
                        : "project-form-styling-light"
                    }
                    type="text"
                    name="name"
                    value={projectDetails.name}
                    onChange={handleChange}
                    required
                  />
                  <Form.Control.Feedback
                    type="invalid"
                    className="input-feedback"
                  >
                    Please provide a name.
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col xs="auto">
                <Form.Group className="mb-3" controlId="formColor">
                  <Form.Label>Color</Form.Label>
                  <Form.Control
                    type="color"
                    name="color"
                    title="Choose your color"
                    className={
                      theme === "dark"
                        ? "project-form-styling-dark"
                        : "project-form-styling-light"
                    }
                    onChange={handleChange}
                    value={projectDetails.color}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Group className="mb-3" controlId="formDescription">
                  <Form.Label>Description:</Form.Label>
                  <Form.Control
                    className={
                      theme === "dark"
                        ? "project-form-styling-dark"
                        : "project-form-styling-light"
                    }
                    as="textarea"
                    name="description"
                    rows={3}
                    onChange={handleChange}
                    value={projectDetails.description}
                  />
                </Form.Group>
              </Col>
            </Row>
            <div style={{ color: "red" }}>{errorMessage}</div>
          </Form>
        </Container>
      </Modal.Body>
      <Modal.Footer className={theme === "dark" ? "modal-dark" : "modal-light"}>
        <Button variant="secondary" onClick={closeModal}>
          Close
        </Button>
        <Button onClick={addProjectSubmit} variant="primary">
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ProjectModal;
