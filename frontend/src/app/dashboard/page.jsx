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

const DashboardPage = () => {
  const { theme } = useTheme();
  const dispatch = useDispatch();
  const [dateString, setDateString] = useState("Loading date...");
  const { user } = useSelector((state) => state.user);
  const [timeOfDay, setTimeOfDay] = useState("Loading time of day...");
  const [clock, setClock] = useState("Loading time...");
  const editorRef = useRef(null);
  const [editor, setEditor] = useState(null);

  const toolbarOptions = [
    ["bold", "italic", "underline", "strike"], // toggled buttons
    ["blockquote", "code-block"],

    [{ header: 1 }, { header: 2 }], // custom button values
    [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
    // [{ script: "sub" }, { script: "super" }], // superscript/subscript
    // [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
    // [{ direction: "rtl" }], // text direction

    // [{ size: ["small", false, "large", "huge"] }], // custom dropdown
    // [{ header: [1, 2, 3, 4, 5, 6, false] }],

    [{ color: [] }, { background: [] }], // dropdown with defaults from theme
    // [{ font: [] }],
    // [{ align: [] }],

    ["clean"], // remove formatting button
  ];

  useEffect(() => {
    if (editorRef.current && !editor) {
      const quill = new Quill(editorRef.current, {
        theme: "snow",
        modules: {
          toolbar: toolbarOptions,
        },
        // placeholder: "Your personal notepad...",
      });
      setEditor(quill);

      quill.on("text-change", () => {
        const html = quill.root.innerHTML;
        localStorage.setItem("notes", html);
      });

      // Load stored notes if any
      const storedNotes = localStorage.getItem("notes");
      if (storedNotes) {
        quill.root.innerHTML = storedNotes;
      }
    }
  }, [editorRef]);

  useEffect(() => {
    if (!user.timezone) {
      dispatch(fetchUserInfo());
    } else {
      const updateTimeOfDay = () => {
        try {
          const timeZone = user.timezone;
          const userTime = new Date().toLocaleString("en-US", {
            timeZone,
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
        } catch (error) {
          console.log("Error updating time of day:", error);
        }
      };

      const fetchAndFormateUserInfo = async () => {
        try {
          const fetchedUserInfo = await dispatch(fetchUserInfo()).unwrap();
          const timeZone = fetchedUserInfo.timezone;
          const userTimeStr = new Date().toLocaleString("en-US", { timeZone });
          const userTime = new Date(userTimeStr);
          const options = {
            weekday: "long",
            month: "long",
            day: "numeric",
            //   hour: "numeric",
            //   minute: "numeric",
            //   timeZone: user.timezone,
            //   timeZoneName: "short",
          };
          const timeOptions = {
            hour: "numeric",
            minute: "numeric",
            hour12: true,
          };

          const formatter = new Intl.DateTimeFormat("en-US", {
            ...options,
            timeZone,
          });

          const timeFormatter = new Intl.DateTimeFormat("en-US", {
            ...timeOptions,
          });
          setDateString(formatter.format(userTime));
          setClock(timeFormatter.format(userTime));
          updateTimeOfDay(userTime);
        } catch (error) {
          console.error("Error fetching or formatting user info:", error);
        }
      };
      fetchAndFormateUserInfo();
    }
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
