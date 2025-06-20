"use client";

import Logo from "@/components/Logo";
import React, { useEffect } from "react";
import AuthForm from "./AuthForm";
import { getCurrentUser } from "@/lib/appwrite/api";
import { useRouter } from "next/navigation";

const page = () => {
  const router = useRouter();

  useEffect(() => {
    const validRoute = async () => {
      const user = await getCurrentUser();
      const role = user?.role;

      if (user && role !== "user") {
        router.replace("/admin");
      }

      if (user && role === "user") {
        router.replace("/dashboard");
      }
    };

    validRoute();
  }, []);
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
