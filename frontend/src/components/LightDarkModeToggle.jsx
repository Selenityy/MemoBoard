"use client";

import React from "react";
import Form from "react-bootstrap/Form";
import { MdOutlineDarkMode, MdOutlineLightMode } from "react-icons/md";
import { Col, Container, Row } from "react-bootstrap";
import { useTheme } from "@/context/ThemeContext";
import "../styles/custom.scss";

const LightDarkModeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Container>
      <Row className="align-items-center">
        <Col className="pe-2 ps-0">
          <MdOutlineLightMode />
        </Col>
        <Col>
          <Form>
            <Form.Group controlId="dark-mode-switch">
              <Form.Switch
                checked={theme === "dark"}
                onChange={toggleTheme}
                aria-label="Dark Mode Switch"
              />
            </Form.Group>
          </Form>
        </Col>
        <Col className="p-0">
          <MdOutlineDarkMode />
        </Col>
      </Row>
    </Container>
  );
};

export default LightDarkModeToggle;
