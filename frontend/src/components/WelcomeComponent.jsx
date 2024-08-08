"use client";

import { Col, Container, Row } from "react-bootstrap";
import { useTheme } from "@/context/ThemeContext";
import React, { useEffect, useState } from "react";
import { fetchUserInfo } from "@/redux/features/userSlice";
import { useSelector, useDispatch } from "react-redux";
import useLiveTime from "@/components/UseLiveTime";

const WelcomeComponent = () => {
  const { theme } = useTheme();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const [dateString, setDateString] = useState("Loading date...");
  const [timeOfDay, setTimeOfDay] = useState("Loading time of day...");
  const clock = useLiveTime(user.timezone || "America/Detroit", 1000);

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
    <Container className="welcome-container">
      <Row>
        <Col>
          <span className="dashboard-clock ">{clock}</span>
        </Col>
      </Row>
      <Row>
        <Col>
          <span className="dashboard-date">{dateString}</span>
        </Col>
      </Row>
      <Row>
        <Col>
          <span className="dashboard-greetings">
            Good {timeOfDay}, {user.firstName}
          </span>
        </Col>
      </Row>
    </Container>
  );
};

export default WelcomeComponent;
