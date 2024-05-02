import { Modal } from "react-bootstrap";
import React, { useState } from "react";
import { Button, Col, Container, Row, Form } from "react-bootstrap";
import { useTheme } from "@/context/ThemeContext";
import { useDispatch } from "react-redux";

const SettingsModal = (props) => {
  const { theme } = useTheme();
  const dispatch = useDispatch();
  const [settings, setSettings] = useState({
    username: "",
    emails: "",
    timezone: "",
  });
  const [validated, setValidated] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings((prev) => ({ ...prev, [name]: value }));
  };

  const savingSettings = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
    }
    setValidated(true);
    try {
      const res = 1;
      props.onHide();
      setSettings({
        username: "",
        emails: "",
        timezone: "",
      });
      setValidated(false);
      setErrorMessage("");
    } catch (error) {
      setErrorMessage(error);
      setValidated(false);
      console.error("Server error failed to update user informatino:", error);
    }
  };

  const closeModal = async (e) => {
    e.preventDefault();
    props.onHide();
    setSettings({
      username: "",
      emails: "",
      timezone: "",
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
      <Modal.Header
        className={`${theme === "dark" ? "modal-dark" : "modal-light"}`}
      >
        <Modal.Title
          id="settings-modal-title-vcenter"
          className={
            theme === "dark"
              ? "project-modal-title-dark"
              : "project-modal-title-light"
          }
        >
          Settings
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className={theme === "dark" ? "modal-dark" : "modal-light"}>
        <Container>
          <Form noValidate validated={validated}>
            <Row className="justify-content-between">
              <Col xs={9}>
                <Form.Group className="mb-3" controlId="formUsername">
                  <Form.Label
                    className={
                      theme === "dark"
                        ? "project-form-labels-dark"
                        : "project-form-labels-light"
                    }
                  >
                    Update Username:
                  </Form.Label>
                  <Form.Control
                    className={
                      theme === "dark"
                        ? "project-form-styling-dark"
                        : "project-form-styling-light"
                    }
                    type="text"
                    name="username"
                    value={settings.username}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            <div style={{ color: "red" }}>{errorMessage}</div>
          </Form>
        </Container>
      </Modal.Body>
      <Modal.Footer className={theme === "dark" ? "modal-dark" : "modal-light"}>
        <Button
          variant="secondary"
          onClick={closeModal}
          size="sm"
          className="save-close-btn"
        >
          Close
        </Button>
        <Button
          onClick={() => savingSettings()}
          variant="primary"
          size="sm"
          className="save-close-btn"
        >
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SettingsModal;
