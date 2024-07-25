"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

const useAuth = () => {
  const router = useRouter();
  const isAuthenticated = useSelector((state) => state.user.isLoggedIn);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  return isAuthenticated;
};

export default useAuth;
