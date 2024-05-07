"use client";

import "../../styles/main.scss";
import { Col, Row, Form } from "react-bootstrap";
import { useTheme } from "@/context/ThemeContext";
import React, { useEffect, useState } from "react";
import { fetchTimeZone, fetchUserInfo } from "@/redux/features/userSlice";
import { useSelector, useDispatch } from "react-redux";

const DashboardPage = () => {
  const { theme } = useTheme();
  const dispatch = useDispatch();
  const [dateString, setDateString] = useState("");
  const { user } = useSelector((state) => state.user);
  const [timeOfDay, setTimeOfDay] = useState("");
  const [note, setNote] = useState("");

  const loadNotes = () => {
    const notes = localStorage.getItem("notes");
    setNote(notes);
  };

  useEffect(() => {
    const updateTimeOfDay = () => {
      const userTime = new Date().toLocaleString("en-US", {
        timeZone: user.timezone,
      });
      const userDate = new Date(userTime);
      const hours = userDate.getHours();
      if (hours < 12) {
        setTimeOfDay("morning");
      } else if (hours >= 12 && hours < 17) {
        setTimeOfDay("afternoon");
      } else {
        setTimeOfDay("evening");
      }
    };

    const fetchAndFormateUserInfo = async () => {
      try {
        await dispatch(fetchUserInfo()).unwrap();
        const date = new Date();
        const options = {
          weekday: "long",
          month: "long",
          day: "numeric",
          //   hour: "numeric",
          //   minute: "numeric",
          //   timeZone: user.timezone,
          //   timeZoneName: "short",
        };
        const formatter = new Intl.DateTimeFormat("en-US", options);
        setDateString(formatter.format(date));
        updateTimeOfDay();
      } catch (error) {
        console.error(error);
      }
    };
    fetchAndFormateUserInfo();
    loadNotes();

    if (localStorage.getItem("notes") === null) {
      localStorage.setItem("notes", note);
    }
  }, [user.timezone, user.firstName, dispatch]);

  const handleBlur = () => {
    handleSave(note);
    // setNotes(loadNotes()); // reload to update notes
  };

  const handleNoteChange = (e) => {
    setNote(e.target.value);
  };

  const handleSave = (note) => {
    setNote(note);
    localStorage.setItem("notes", note);
  };

  return (
    <>
      <Row>
        <Col>
          <span>Home</span>
        </Col>
      </Row>
      <Row>
        <Col>{dateString && <span>{dateString}</span>}</Col>
      </Row>
      <Row>
        <Col>
          <span>
            Good {timeOfDay}, {user.firstName}
          </span>
        </Col>
      </Row>
      <Row>
        <Col>
          <div>
            <span>My Tasks</span>
          </div>
        </Col>
        <Col>
          <div>
            <span>Projects</span>
          </div>
        </Col>
      </Row>
      <Row>
        <Col>
          <span>Notes</span>
          <Form.Control
            as="textarea"
            rows={3}
            value={note}
            onChange={handleNoteChange}
            onBlur={handleBlur}
            placeholder="Type your notes here..."
            style={{
              resize: "none",
              overflowY: "auto",
              maxHeight: "600px",
              maxWidth: "800px",
            }}
          />
        </Col>
      </Row>
    </>
  );
};

export default DashboardPage;
