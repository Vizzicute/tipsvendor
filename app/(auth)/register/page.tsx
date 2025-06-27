"use client";

import React, { useEffect } from "react";
import RegisterForm from "./RegisterForm";
import Link from "next/link";
import GoogleButton from "../GoogleButton";
import Logo from "@/components/Logo";
import { useUserContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

const date = new Date();
const year = date.getFullYear();

const page = () => {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useUserContext();

  useEffect(() => {
    if(isLoading) return;
    const validRoute = async () => {
      if (isAuthenticated) {
        router.replace("/dashboard");
      }
    };

    validRoute();
  }, [isAuthenticated, isLoading]);
  return (
    <div className="flex flex-wrap justify-center items-center mt-8 space-y-4">
      <Link href={"/"}>
        <Logo width={100} />
      </Link>
      <h2 className="font-lilita-one w-full text-center text-lg text-stone-500">
        Register
      </h2>
      <div className="w-3/4 px-5 md:w-1/3">
        <RegisterForm />
        <span className="w-full ps-4 text-start font-inter text-sm">
          Already have Account? &nbsp;
          <Link href={"/register"} className="text-blue-600 font-semibold">
            Login
          </Link>
        </span>
      </div>
      <div className="w-full my-4 text-center text-gray-500">or</div>
      <div className="w-3/4 px-5 md:w-1/3 pb-16">
        <GoogleButton>Register With Google</GoogleButton>
      </div>
      <div className="w-full h-px mx-4 md:mx-32 bg-slate-200" />
      <span className="text-sm font-semibold text-center text-stone-500">
        &copy; {year} All Right Reserved
      </span>
    </div>
  );
};

export default page;
