"use client";

import "../../styles/main.scss";
import { Col, Row } from "react-bootstrap";
import { useTheme } from "@/context/ThemeContext";
import React, { useEffect, useState } from "react";
import { fetchTimeZone, fetchUserInfo } from "@/redux/features/userSlice";
import { useSelector, useDispatch } from "react-redux";

const DashboardPage = () => {
  const { theme } = useTheme();
  const dispatch = useDispatch();
  const [dateString, setDateString] = useState("");
  console.log(dateString);
  const { user } = useSelector((state) => state.user);
  const [timeOfDay, setTimeOfDay] = useState("");

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
  }, [user.timezone, user.firstName, dispatch]);

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
    </>
  );
};

export default DashboardPage;
