"use client";

import Logo from "@/components/Logo";
import React, { useEffect } from "react";
import AuthForm from "./AuthForm";
import { useRouter } from "next/navigation";
import { useUserContext } from "@/context/AuthContext";

const page = () => {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useUserContext();

  useEffect(() => {
    if (isLoading) return;
    const validRoute = async () => {
      const role = user?.role;

      if (isAuthenticated && role !== "user") {
        router.replace("/admin");
      }

      if (isAuthenticated && role === "user") {
        router.replace("/dashboard");
      }
    };

    validRoute();
  }, [isAuthenticated, isLoading]);
  return (
    <div className="flex flex-col items-center justify-center h-[100dvh] gap-3">
      <Logo width={90} />
      <div className="flex flex-col justify-center items-center rounded-md w-80 h-60 bg-primary gap-2">
        <AuthForm />
      </div>
    </div>
  );
};

export default page;
