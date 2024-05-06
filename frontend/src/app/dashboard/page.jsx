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
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [dateString, setDateString] = useState("");
  const [selectedTimezone, setSelectedTimezone] = useState({ value: "UTC" });

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const res = await dispatch(fetchUserInfo()).unwrap();
        setUsername(res.username);
        setFirstName(res.firstName);
        setSelectedTimezone(res.timezone);
      } catch (error) {
        console.error("Failed to get the username", error);
      }
    };
    getUserInfo();
  }, [dispatch]);

  useEffect(() => {
    let storedTimezone = localStorage.getItem("timezone");

    if (!storedTimezone) {
      const updateTimezone = async () => {
        try {
          const response = await dispatch(fetchTimeZone());
          localStorage.setItem("timezone", response.payload);
          storedTimezone = response.payload;
        } catch (error) {
          console.error("Failed to get the timezone", error);
        }
      };
      updateTimezone();
    }
  }, [dispatch]);

  useEffect(() => {
    const formatDate = () => {
      const date = new Date();
      const options = {
        weekday: "long",
        month: "long",
        day: "numeric",
      };
      const formatter = new Intl.DateTimeFormat("en-US", options);
      setDateString(formatter.format(date));
    };
    formatDate();
  }, []);

  return (
    <>
      <Row>
        <Col>
          <span>{dateString}</span>
        </Col>
      </Row>
      <Row>
        <Col>
          <span>Good afternoon, {firstName}</span>
        </Col>
      </Row>
    </>
  );
};

export default DashboardPage;
