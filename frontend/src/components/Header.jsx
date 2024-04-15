import React from "react";
import Logo from "./Logo";
import { Container } from "react-bootstrap";
import "../styles/custom.scss";

const Header = () => {
  return (
    <Container fluid>
      <Logo />
      <hr className="header-hr"></hr>
    </Container>
  );
};

export default Header;
