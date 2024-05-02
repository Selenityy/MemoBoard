"use client";

import "../../styles/main.scss";
import { Col, Row } from "react-bootstrap";
import { useTheme } from "@/context/ThemeContext";
import React, { useEffect, useState } from "react";
import { fetchTimeZone } from "@/redux/features/userSlice";
import { useDispatch } from "react-redux";

const DashboardPage = () => {
  const { theme } = useTheme();
  const dispatch = useDispatch();
  //   const date = new Date();

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

    console.log("Using timezone:", storedTimezone);
  }, [dispatch]);

  return (
    <>
      <span>Home</span>
    </>
  );
};

export default DashboardPage;
