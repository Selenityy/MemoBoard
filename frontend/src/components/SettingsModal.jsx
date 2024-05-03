import { Modal, Tab, Tabs } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import { Button, Col, Container, Row, Form } from "react-bootstrap";
import { useTheme } from "@/context/ThemeContext";
import { useDispatch } from "react-redux";
import {
  fetchUserId,
  fetchUserInfo,
  updateUserInfo,
} from "@/redux/features/userSlice";

const SettingsModal = (props) => {
  const { theme } = useTheme();
  const dispatch = useDispatch();
  const [userInfo, setUserInfo] = useState({
    newFirstName: "",
    newLastName: "",
    newUsername: "",
    newEmail: "",
    newTimezone: "",
  });
  const [validated, setValidated] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const updateUserInfo = async () => {
      try {
        // userId
        const userIdRes = await dispatch(fetchUserId());
        setUserId(userIdRes.payload);

        // userInfo
        const res = await dispatch(fetchUserInfo());
        const userInfoRes = res.payload;
        setUserInfo({
          newFirstName: userInfoRes.firstName,
          newLastName: userInfoRes.lastName,
          newUsername: userInfoRes.username,
          newEmail: userInfoRes.email,
          newTimezone: userInfoRes.timezone,
        });
      } catch (error) {
        console.error("Failed to get the user info:", error);
      }
    };
    updateUserInfo();
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prev) => ({ ...prev, [name]: value }));
  };

  const savingSettings = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
    }
    setValidated(true);
    try {
      await dispatch(updateUserInfo({ userId, userInfo })).unwrap();
      props.onHide();
      setUserInfo({
        newFirstName: "",
        newLastName: "",
        newUsername: "",
        newEmail: "",
        newTimezone: "",
      });
      setValidated(false);
      setErrorMessage("");
    } catch (error) {
      setErrorMessage(error);
      setValidated(false);
      console.error("Server error failed to update user information:", error);
    }
  };

  const closeModal = async (e) => {
    e.preventDefault();
    props.onHide();
    setUserInfo({
      newFirstName: "",
      newLastName: "",
      newUsername: "",
      newEmail: "",
      newTimezone: "",
    });
  };

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="project-modal-title-vcenter"
      centered
      dialogClassName="settings-modal-width"
    >
      <Modal.Header className="settings-modal-header">
        <Modal.Title
          id="settings-modal-title-vcenter"
          className={`settings-modal-title {
            theme === "dark"
              ? "project-modal-title-dark"
              : "project-modal-title-light"
          }`}
        >
          Settings
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className={theme === "dark" ? "modal-dark" : "modal-light"}>
        <Container>
          <Tabs
            defaultActiveKey="profile"
            id="justify-tab-settings"
            className="small-tabs"
            justify
          >
            <Tab eventKey="profile" title="Profile">
              <Form
                noValidate
                validated={validated}
                className="settings-modal-body"
              >
                <Row className="justify-content-between">
                  <Col>
                    <Form.Group className="mb-3" controlId="formFirstName">
                      <Form.Label
                        className={
                          theme === "dark"
                            ? "project-form-labels-dark"
                            : "project-form-labels-light"
                        }
                      >
                        First Name:
                      </Form.Label>
                      <Form.Control
                        className={
                          theme === "dark"
                            ? "project-form-styling-dark"
                            : "project-form-styling-light"
                        }
                        type="text"
                        name="newFirstName"
                        value={userInfo.newFirstName}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group className="mb-3" controlId="formLastName">
                      <Form.Label
                        className={
                          theme === "dark"
                            ? "project-form-labels-dark"
                            : "project-form-labels-light"
                        }
                      >
                        Last Name:
                      </Form.Label>
                      <Form.Control
                        className={
                          theme === "dark"
                            ? "project-form-styling-dark"
                            : "project-form-styling-light"
                        }
                        type="text"
                        name="newLastName"
                        value={userInfo.newLastName}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row className="justify-content-between">
                  <Col>
                    <Form.Group className="mb-3" controlId="formUsername">
                      <Form.Label
                        className={
                          theme === "dark"
                            ? "project-form-labels-dark"
                            : "project-form-labels-light"
                        }
                      >
                        Username:
                      </Form.Label>
                      <Form.Control
                        className={
                          theme === "dark"
                            ? "project-form-styling-dark"
                            : "project-form-styling-light"
                        }
                        type="text"
                        name="newUsername"
                        value={userInfo.newUsername}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group className="mb-3" controlId="formEmail">
                      <Form.Label
                        className={
                          theme === "dark"
                            ? "project-form-labels-dark"
                            : "project-form-labels-light"
                        }
                      >
                        Email:
                      </Form.Label>
                      <Form.Control
                        className={
                          theme === "dark"
                            ? "project-form-styling-dark"
                            : "project-form-styling-light"
                        }
                        type="email"
                        name="newEmail"
                        value={userInfo.newEmail}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <div style={{ color: "red" }}>{errorMessage}</div>
              </Form>
            </Tab>
            <Tab eventKey="account" title="Account"></Tab>
            <Tab eventKey="general" title="General"></Tab>
            <Tab eventKey="tags" title="Tags"></Tab>
            <Tab eventKey="display" title="Display"></Tab>
          </Tabs>
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
          onClick={savingSettings}
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
