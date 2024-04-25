"use client";

import { useRouter } from "next/navigation";
import { Button } from "react-bootstrap";

const SignUpBtn = () => {
  const router = useRouter();

  const signupRedirect = async (e) => {
    e.preventDefault();
    router.push("/signup");
  };
  return (
    <>
      <Button onClick={signupRedirect} variant="link">
        Don't have an account yet? Sign up here.
      </Button>
    </>
  );
};

export default SignUpBtn;
