"use client";

import "../../styles/main.scss";
import { Col, Row } from "react-bootstrap";
import { useTheme } from "@/context/ThemeContext";
import React, { useEffect, useRef, useState } from "react";
import { fetchUserInfo } from "@/redux/features/userSlice";
import { useSelector, useDispatch } from "react-redux";
import MyTasksWidget from "@/components/MyTasksWidget";
import useLiveTime from "@/components/UseLiveTime";
import { QuillComponent } from "@/components/Quill";
import PersonalNotesWidget from "@/components/PersonalNotesWidget";

const DashboardPage = () => {
  const { theme } = useTheme();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const [dateString, setDateString] = useState("Loading date...");
  const [timeOfDay, setTimeOfDay] = useState("Loading time of day...");
  const clock = useLiveTime(user.timezone || "America/Los_Angeles", 1000);

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
          <MyTasksWidget />
        </Col>
        <Col>
          <div>
            <span>Projects</span>
          </div>
        </Col>
      </Row>
      <Row>
        <Col>
          <PersonalNotesWidget />
        </Col>
      </Row>
    </>
  );
};

export default DashboardPage;
