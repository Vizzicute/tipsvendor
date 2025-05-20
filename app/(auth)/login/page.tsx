import React from "react";
import LoginForm from "./LoginForm";
import Link from "next/link";
import GoogleButton from "../GoogleButton";
import Logo from "@/components/Logo";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login"
}

const date = new Date();
const year = date.getFullYear();

const page = () => {
  return (
    <div className="flex flex-wrap justify-center items-center mt-8 space-y-4">
      <Link
        href={"/"}
        className="w-full flex items-center justify-center"
      >
        <Logo width={100} />
      </Link>
      <h2 className="font-lilita-one w-full text-center text-lg text-stone-500">
        Login
      </h2>
      <div className="w-3/4 px-5 md:w-1/3">
        <LoginForm />
        <span className="w-full ps-4 text-start font-inter text-sm">
          First time? &nbsp;
          <Link href={"/register"} className="text-blue-600 font-semibold">
            Register
          </Link>
        </span>
        <br />
        <Link
          href={"/forgot"}
          className="w-full ps-4 text-start font-inter text-sm text-red-600 font-semibold"
        >
          Forgot Your Password?
        </Link>
      </div>
      <div className="w-full my-4 text-center text-gray-500">or</div>
      <div className="w-3/4 px-5 md:w-1/3 pb-16">
        <GoogleButton>Login With Google</GoogleButton>
      </div>
      <div className="w-full h-px mx-4 md:mx-32 bg-slate-200" />
      <span className="text-sm font-semibold text-center text-stone-500">
        &copy; {year} All Right Reserved
      </span>
    </div>
  );
};

export default page;
