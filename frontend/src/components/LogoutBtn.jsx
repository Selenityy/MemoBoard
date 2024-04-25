"use client";

import { logout } from "@/redux/features/userSlice";
import { useRouter } from "next/navigation";
import { Button } from "react-bootstrap";
import { useDispatch } from "react-redux";

const LogoutBtn = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = async (e) => {
    e.preventDefault();
    await router.push("/");
    localStorage.removeItem("token");
    dispatch(logout());
  };
  return (
    <>
      <Button onClick={handleLogout} size="sm">
        Logout
      </Button>
    </>
  );
};

export default LogoutBtn;
