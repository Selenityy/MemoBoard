import Modal from "react-bootstrap/Modal";
import React from "react";
import { Button, Col, Container, Row, Form } from "react-bootstrap";
import { useTheme } from "@/context/ThemeContext";

const ProjectModal = (props) => {
  const { theme } = useTheme();
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
          <Form>
            <Row className="justify-content-between">
              <Col xs={9}>
                <Form.Group className="mb-3" controlId="name.ControlInput">
                  <Form.Label>Name:</Form.Label>
                  <Form.Control
                    className={
                      theme === "dark"
                        ? "project-form-styling-dark"
                        : "project-form-styling-light"
                    }
                    type="text"
                  />
                </Form.Group>
              </Col>
              <Col xs="auto">
                <Form.Group className="mb-3" controlId="color.ControlInput">
                  <Form.Label htmlFor="exampleColorInput">Color</Form.Label>
                  <Form.Control
                    type="color"
                    id="exampleColorInput"
                    defaultValue="#563d7c"
                    title="Choose your color"
                    className={
                      theme === "dark"
                        ? "project-form-styling-dark"
                        : "project-form-styling-light"
                    }
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Group
                  className="mb-3"
                  controlId="description.ControlInput"
                >
                  <Form.Label>Description:</Form.Label>
                  <Form.Control
                    className={
                      theme === "dark"
                        ? "project-form-styling-dark"
                        : "project-form-styling-light"
                    }
                    as="textarea"
                    rows={3}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Container>
      </Modal.Body>
      <Modal.Footer className={theme === "dark" ? "modal-dark" : "modal-light"}>
        <Button variant="secondary" onClick={props.onHide}>
          Close
        </Button>
        <Button variant="primary">Save Changes</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ProjectModal;
