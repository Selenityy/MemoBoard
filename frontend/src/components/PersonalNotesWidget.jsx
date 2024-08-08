"use client";

import React, { useEffect } from "react";
import { Col, Container, Row } from "react-bootstrap";
import dynamic from "next/dynamic";
import { createSelector } from "reselect";
import { useSelector, useDispatch } from "react-redux";
import { fetchUserNotes } from "@/redux/features/userSlice";
import { useTheme } from "@/context/ThemeContext";

const getUser = (state) => state.user.user;
const userNotes = createSelector([getUser], (user) => user.notes);

const QuillComponent = dynamic(
  () =>
    import("@/components/Quill").then((module) => ({
      default: module.QuillComponent,
    })),
  {
    ssr: false,
  }
);

const PersonalNotesWidget = () => {
  const dispatch = useDispatch();
  const { theme } = useTheme();
  const userPersonalNotes = useSelector(userNotes);
  const userId = useSelector((state) => state.user.user._id);

  useEffect(() => {
    if (userId) {
      dispatch(fetchUserNotes());
    }
  }, [dispatch, userId]);

  return (
    <Container
      className={
        theme === "dark"
          ? "personal-notes-widget-container-dark"
          : "personal-notes-widget-container-light"
      }
    >
      <Row>
        <Col xs={12} style={{ padding: "16px 0px 5px 25px" }}>
          <span className="personal-notes-widget-title">Personal Notes</span>
        </Col>
        <Col xs={12} className="personal-notes-widget-quill-col">
          <QuillComponent userPersonalNotes={userPersonalNotes} />
        </Col>
      </Row>
    </Container>
  );
};

export default PersonalNotesWidget;
