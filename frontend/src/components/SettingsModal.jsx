import { Modal, Tab, Tabs } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import { Button, Col, Container, Row, Form } from "react-bootstrap";
import { useTheme } from "@/context/ThemeContext";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchUserId,
  fetchUserInfo,
  updateUserInfo,
  updateTimezone,
} from "@/redux/features/userSlice";
import TimezoneSelect from "react-timezone-select";

const SettingsModal = (props) => {
  const { theme } = useTheme();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const userId = user._id;
  const [userInfo, setUserInfo] = useState({
    newFirstName: "",
    newLastName: "",
    newUsername: "",
    newEmail: "",
    newTimezone: "",
  });
  const [selectedTimezone, setSelectedTimezone] = useState({
    value: user.timezone,
    label: user.timezone,
  });
  const [validated, setValidated] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [userInfoChanged, setUserInfoChanged] = useState(false);
  const [timezoneChanged, setTimezoneChanged] = useState(false);

  useEffect(() => {
    if (props.show === true) {
      const loadUserInfo = async () => {
        try {
          const userInfo = await dispatch(fetchUserInfo()).unwrap();
          if (user) {
            setUserInfo({
              newFirstName: user.firstName || "",
              newLastName: user.lastName || "",
              newUsername: user.username || "",
              newEmail: user.email || "",
              newTimezone: user.timezone || "",
            });
            setSelectedTimezone({
              value: user.timezone,
              label: user.timezone,
            });
          }
        } catch (error) {
          console.error("Failed to fetch user info:", error);
          setErrorMessage("Failed to load user information.");
        }
      };
      loadUserInfo();
    }
  }, [dispatch, props.show, user._id, user.timezone]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prev) => ({ ...prev, [name]: value }));
    setUserInfoChanged(true);
  };

  const handleTimezoneChange = (selectedOption) => {
    setSelectedTimezone(selectedOption);
    setTimezoneChanged(true);
  };

  const savingSettings = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
    }
    setValidated(true);

    try {
      if (userInfoChanged) {
        await dispatch(updateUserInfo({ userId, userInfo })).unwrap();
        setUserInfoChanged(false);
      }

      if (timezoneChanged) {
        let newTimezone = selectedTimezone.value;
        await dispatch(updateTimezone({ userId, newTimezone })).unwrap();
        setUserInfo({ newTimezone: selectedTimezone });
        setTimezoneChanged(false);
      }
      await dispatch(fetchUserInfo()).unwrap();

      props.onHide();
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
            <Tab eventKey="account" title="Account">
              <div>Select Timezone:</div>
              <div>
                <TimezoneSelect
                  value={selectedTimezone}
                  onChange={handleTimezoneChange}
                />
              </div>
            </Tab>
            <Tab eventKey="general" title="General"></Tab>
            {/* <Tab eventKey="tags" title="Tags"></Tab> */}
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
