"use client";

import { useRouter } from "next/navigation";
import { Button } from "react-bootstrap";
import { useTheme } from "@/context/ThemeContext";

const SignUpBtn = () => {
  const router = useRouter();
  const { theme } = useTheme();

  const signupRedirect = async (e) => {
    e.preventDefault();
    router.push("/signup");
  };
  return (
    <>
      <Button
        onClick={signupRedirect}
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
