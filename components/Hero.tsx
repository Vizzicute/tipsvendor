"use client";

import Link from "next/link";
import React from "react";
import GradientButton from "./GradientButton";
import { INITIAL_USER, useUserContext } from "@/context/AuthContext";
import { useSignOutAccount } from "@/lib/react-query/queriesAndMutations";
import { redirect, usePathname } from "next/navigation";
import { Button } from "./ui/button";
import { Send } from "lucide-react";
import { Skeleton } from "./ui/skeleton";
import { useCurrentUser, useSocials } from "@/lib/react-query/queries";
import { useQueryClient } from "@tanstack/react-query";

const Hero = ({
  h1tag,
  description,
  isSeoLoading,
}: {
  h1tag: string;
  description: string;
  isSeoLoading: boolean;
}) => {
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const { data: settings, isLoading: isSettingsLoading } = useSocials();
  const { mutateAsync: signOutAccount, isPending } = useSignOutAccount();
  const { setUser, isAuthenticated, setIsAuthenticated, isLoading } =
    useUserContext();

  const { data: user } = useCurrentUser();

  const handleSignout = async () => {
    signOutAccount();
    setIsAuthenticated(false);
    setUser(INITIAL_USER);
    queryClient.invalidateQueries({queryKey: ["currentUser"]});
    redirect("/login");
  };
  return (
    <div className="relative w-full h-fit">
      <div className="absolute inset-0 bg-[url(/bg-image-2.jpg)] bg-center" />
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/60 to-primary" />
      <div className="relative z-10 text-white p-6 w-full flex flex-wrap md:flex-nowrap gap-4">
        <div className="w-full md:w-[65%] flex flex-wrap items-center gap-4">
          <h1 className="font-bold capitalize text-white text-2xl md:text-3xl md:text-left text-center">
            {isSeoLoading ? <Skeleton className="w-full h-full" /> : h1tag}
          </h1>
          <h4 className="font-normal text-center md:text-left text-sm text-white">
            {isSeoLoading ? (
              <Skeleton className="w-full h-full" />
            ) : (
              description
            )}
          </h4>
        </div>
        <div className="w-full md:w-[35%] flex flex-wrap items-center justify-center gap-2">
          <div className="w-full flex flex-nowrap justify-center items-center gap-2">
            <Link
              href={`${user ? "/dashboard" : "/register"}`}
              className="w-1/2"
            >
              <GradientButton className="w-full">
                {user ? "Dashboard" : "Register"}
              </GradientButton>
            </Link>
            {user ? (
              <GradientButton
                loading={isPending || isLoading}
                onClick={handleSignout}
                className="w-1/2"
              >
                Logout
              </GradientButton>
            ) : (
              <Link href="/login" className="w-1/2">
                <GradientButton className="w-full">Login</GradientButton>
              </Link>
            )}
          </div>
          <Link
            href="/dashboard"
            className="w-full flex justify-center items-center"
          >
            <GradientButton className="w-full">Vip Packages</GradientButton>
          </Link>
          {pathname !== "/livescore" && (
            <Link
              href="/livescore"
              className="w-full flex justify-center items-center"
            >
              <GradientButton className="w-full">Livescore</GradientButton>
            </Link>
          )}
          <Link
            href={settings?.telegram || "#"}
            target="_blank"
            className="w-full justify-center items-center"
          >
            <Button className="bg-[#0088cc] rounded-full font-semibold text-sm w-full">
              <Send size={24} />
              Join Us
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Hero;
