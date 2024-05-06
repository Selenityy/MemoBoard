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
  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchAndFormateUserInfo = async () => {
      try {
        await dispatch(fetchUserInfo()).unwrap();
        const date = new Date();
        const options = {
          weekday: "long",
          month: "long",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
          timeZone: user.timezone,
          timeZoneName: "short",
        };
        const formatter = new Intl.DateTimeFormat("en-US", options);
        setDateString(formatter.format(date));
        console.log("Formatted date:", formatter.format(date));
      } catch (error) {
        console.error(error);
      }
    };
    fetchAndFormateUserInfo();
  }, [user.timezone, dispatch]);

  return (
    <>
      <Row>
        <Col>{dateString && <span>{dateString}</span>}</Col>
      </Row>
      <Row>
        <Col>
          <span>Good afternoon, {user.firstName}</span>
        </Col>
      </Row>
    </>
  );
};

export default DashboardPage;
