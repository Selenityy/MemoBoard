"use client";

import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import dynamic from "next/dynamic";
import { createSelector } from "reselect";
import { useSelector, useDispatch } from "react-redux";
import { fetchUserNotes } from "@/redux/features/userSlice";

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
  const userPersonalNotes = useSelector(userNotes);
  const userId = useSelector((state) => state.user.user._id);

  useEffect(() => {
    if (userId) {
      dispatch(fetchUserNotes({ userId }));
    }
  }, [dispatch, userId]);

  return (
    <Container
      style={{
        width: "100%",
        border: "1px solid grey",
        borderRadius: "16px",
        padding: "none",
      }}
    >
      <Row>
        <Col xs={12} style={{ padding: "16px 0px 5px 25px" }}>
          <span style={{ fontWeight: "bold", fontSize: "1.2rem" }}>
            Personal Notes
          </span>
        </Col>
        <Col xs={12} style={{ width: "full", height: "300px" }}>
          <QuillComponent userPersonalNotes={userPersonalNotes} />
        </Col>
      </Row>
    </Container>
  );
};

export default PersonalNotesWidget;
