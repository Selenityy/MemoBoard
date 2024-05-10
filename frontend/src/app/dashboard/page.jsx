"use client";

import "../../styles/main.scss";
import Quill from "quill";
import "quill/dist/quill.snow.css"; // Make sure to import Quill styles
import { Col, Row, Form } from "react-bootstrap";
import { useTheme } from "@/context/ThemeContext";
import React, { useEffect, useRef, useState } from "react";
import { fetchUserInfo } from "@/redux/features/userSlice";
import { useSelector, useDispatch } from "react-redux";
import MyTasksWidget from "@/components/MyTasksWidget";
import useLiveTime from "@/components/UseLiveTime";

const DashboardPage = () => {
  const { theme } = useTheme();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const [dateString, setDateString] = useState("Loading date...");
  const [timeOfDay, setTimeOfDay] = useState("Loading time of day...");
  const clock = useLiveTime(user.timezone || "America/Los_Angeles", 1000);
  const editorRef = useRef(null);
  const [editor, setEditor] = useState(null);

  const toolbarOptions = [
    ["bold", "italic", "underline", "strike"],
    ["blockquote", "code-block"],
    [{ header: 1 }, { header: 2 }],
    [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
    [{ color: [] }, { background: [] }],
    ["clean"],
  ];

  useEffect(() => {
    if (editorRef.current && !editor) {
      const quill = new Quill(editorRef.current, {
        theme: "snow",
        modules: {
          toolbar: toolbarOptions,
        },
      });
      setEditor(quill);

      quill.on("text-change", () => {
        const html = quill.root.innerHTML;
        localStorage.setItem("notes", html);
      });

      const storedNotes = localStorage.getItem("notes");
      if (storedNotes) {
        quill.root.innerHTML = storedNotes;
      }
    }
  }, [editorRef]);

  useEffect(() => {
    const fetchAndFormateUserInfo = async () => {
      try {
        const fetchedUserInfo = user.timezone
          ? user
          : await dispatch(fetchUserInfo()).unwrap();
        const timeZone = fetchedUserInfo.timezone;
        const userTimeStr = new Date().toLocaleString("en-US", { timeZone });
        const userTime = new Date(userTimeStr);
        const options = {
          weekday: "long",
          month: "long",
          day: "numeric",
        };
        const formatter = new Intl.DateTimeFormat("en-US", {
          ...options,
          timeZone,
        });

        setDateString(formatter.format(userTime));
        const hours = userTime.getHours();
        setTimeOfDay(
          hours < 12
            ? "morning"
            : hours >= 12 && hours < 17
            ? "afternoon"
            : "evening"
        );
      } catch (error) {
        console.error("Error fetching or formatting user info:", error);
      }
    };
    fetchAndFormateUserInfo();
    // }
  }, [user.timezone, user.firstName, dispatch]);

  return (
    <>
      <Row>
        <Col>
          <span>Home</span>
        </Col>
      </Row>
      <Row>
        <Col>
          <span>{clock}</span>
        </Col>
      </Row>
      <Row>
        <Col>
          <span>{dateString}</span>
        </Col>
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
            <MyTasksWidget />
          </div>
        </Col>
        <Col>
          <div>
            <span>Projects</span>
          </div>
        </Col>
      </Row>
      <Row
        style={{
          width: "50%",
          border: "1px solid grey",
          borderRadius: "16px",
          padding: "none",
        }}
      >
        <Col xs={12} style={{ padding: "16px 0px 5px 25px" }}>
          <span style={{ fontWeight: "bold" }}>Personal Notes</span>
        </Col>
        <Col xs={12}>
          <div
            ref={editorRef}
            style={{
              height: "200px",
              width: "full",
            }}
          />
          <div id="toolbar"></div>
        </Col>
      </Row>
    </>
  );
};

export default DashboardPage;
