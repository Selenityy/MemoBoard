"use client";

import { Button } from "react-bootstrap";
import { useTheme } from "@/context/ThemeContext";

const LoginLink = ({ setShowSignUpForm }) => {
  const { theme } = useTheme();

  return (
    <>
      <Button
        onClick={() => setShowSignUpForm(false)}
        variant="link"
        className={
          theme === "dark" ? "signup-button-dark" : "signup-button-light"
        }
      >
        Already have an account? Log in here.
      </Button>
    </>
  );
};

export default LoginLink;
