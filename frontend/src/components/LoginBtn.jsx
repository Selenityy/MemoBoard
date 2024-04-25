"use client";

import { useRouter } from "next/navigation";
import { Button } from "react-bootstrap";

const LoginBtn = () => {
  const router = useRouter();

  const signupRedirect = async (e) => {
    e.preventDefault();
    router.push("/");
  };
  return (
    <>
      <Button onClick={signupRedirect} variant="link">
        Already have an account yet? Log in here.
      </Button>
    </>
  );
};

export default LoginBtn;
