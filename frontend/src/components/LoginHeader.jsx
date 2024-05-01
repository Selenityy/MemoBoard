"use client";

import React from "react";
import Logo from "./Logo";
import { Col, Container, Dropdown, DropdownMenu, Row } from "react-bootstrap";
import "../styles/main.scss";
import LightDarkModeToggle from "./LightDarkModeToggle";
import { MdMenu } from "react-icons/md";
import { useTheme } from "@/context/ThemeContext";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { logout } from "@/redux/features/userSlice";

const Header = () => {
  const { theme, toggleTheme } = useTheme();
  const dispatch = useDispatch();
  const router = useRouter();

  const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
    <a
      href=""
      ref={ref}
      onClick={(e) => {
        e.preventDefault();
        onClick(e);
      }}
      style={{ color: "inherit", textDecoration: "none" }}
    >
      {children}
    </a>
  ));

  const handleLogout = async (e) => {
    e.preventDefault();
    await router.push("/");
    localStorage.removeItem("token");
    dispatch(logout());
  };

  return (
    <Container fluid>
      <Row
        className={`${
          theme === "dark" ? "header-dark" : "header-light"
        } align-items-center justify-content-between ps-1 pe-1`}
      >
        <Col xs={8} md="fluid">
          <Logo />
        </Col>
        <Col xs="auto">
          {/* <LightDarkModeToggle /> */}
          <Dropdown>
            <Dropdown.Toggle as={CustomToggle}>
              <MdMenu
                size={25}
                className={theme === "dark" ? "icon-dark" : "icon-light"}
              />
            </Dropdown.Toggle>
            <DropdownMenu
              className={`mt-1 ${
                theme === "dark" ? "dropdown-menu-dark" : "dropdown-menu-light"
              }`}
            >
              {theme === "dark" ? (
                <Dropdown.Item
                  onClick={toggleTheme}
                  className="dropdown-titles-dark"
                >
                  Light Mode
                </Dropdown.Item>
              ) : (
                <Dropdown.Item
                  onClick={toggleTheme}
                  className="dropdown-titles-light"
                >
                  Dark Mode
                </Dropdown.Item>
              )}
              {/* <Dropdown.Item
                onClick={handleLogout}
                className={
                  theme === "dark"
                    ? "dropdown-logout-dark"
                    : "dropdown-logout-light"
                }
              >
                Logout
              </Dropdown.Item> */}
            </DropdownMenu>
          </Dropdown>
        </Col>
      </Row>
    </Container>
  );
};

export default Header;
