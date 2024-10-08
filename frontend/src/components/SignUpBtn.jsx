"use client";

import { Button } from "react-bootstrap";
import { useTheme } from "@/context/ThemeContext";

const SignUpBtn = ({ setShowSignUpForm }) => {
  const { theme } = useTheme();

  return (
    <>
      <Button
        onClick={() => setShowSignUpForm(true)}
        variant="link"
        className={
          theme === "dark" ? "signup-button-dark" : "signup-button-light"
        }
      >
        Don't have an account yet? Sign up here.
      </Button>
    </>
  );
};

export default SignUpBtn;
