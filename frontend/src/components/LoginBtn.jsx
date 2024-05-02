"use client";

import { useRouter } from "next/navigation";
import { Button } from "react-bootstrap";
import { useTheme } from "@/context/ThemeContext";

const LoginBtn = () => {
  const router = useRouter();
  const { theme } = useTheme();

  const signupRedirect = async (e) => {
    e.preventDefault();
    router.push("/");
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
        Already have an account yet? Log in here.
      </Button>
    </>
  );
};

export default LoginBtn;
