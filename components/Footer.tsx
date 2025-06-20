"use client";

import React from "react";
import Logo from "./Logo";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getSingleSeoPageByUrl } from "@/lib/appwrite/fetch";
import { getSocialSettings } from "@/lib/appwrite/appConfig";

const Footer = () => {
  const pathname = usePathname();
  const { data: pageContent, isLoading } = useQuery({
    queryKey: ["seo"],
    queryFn: async () => getSingleSeoPageByUrl(pathname),
  });

  const { data: settings, isLoading: isSettingsLoading } = useQuery({
    queryKey: ["settings"],
    queryFn: getSocialSettings,
  });

  const advertEmail = settings?.advertEmail || "";
  const infoEmail = settings?.infoEmail || "";

  const date = new Date();
  const year = date.getFullYear();

  return (
    <div className="w-full flex flex-wrap items-center justify-around bg-primary py-10 px-2 md:px-10">
      <div className="w-full justify-center md:w-[30%] flex flex-wrap p-2 gap-4">
        <Logo />
        <p className="font-light text-[13.5px] w-full text-wrap text-gray-400">
          {isLoading
            ? "Loading..."
            : pageContent?.description ||
              "Tipsvendor is an Exclusive online platform that provides free football prediction tips from all the leagues across the globe for football overs, fans and punters."}
        </p>
      </div>
      <div className="w-full md:w-[30%] flex flex-nowrap p-2 gap-2">
        <div className="w-1/2 text-start flex flex-col">
          <p className="text-lg text-white capitalize">Useful Links</p>
          <Link
            href={"/dashboard"}
            className="text-md text-secondary capitalize"
          >
            VIP Packages
          </Link>
          <Link
            href={"/livescore"}
            className="text-md text-secondary capitalize"
          >
            live soccer scores
          </Link>
          <Link href={"/blog"} className="text-md text-secondary capitalize">
            football news
          </Link>
        </div>
        <div className="w-1/2 text-start flex flex-col">
          <p className="text-lg text-white capitalize">Navigations</p>
          <Link href={"about"} className="text-md text-secondary capitalize">
            About Us
          </Link>
          <Link href={"privacy"} className="text-md text-secondary capitalize">
            Privacy and Policy
          </Link>
          <Link href={"/info"} className="text-md text-secondary capitalize">
            Contact Us
          </Link>
        </div>
      </div>
      <div className="w-full md:w-[30%] text-start flex flex-col p-2">
        <p className="w-full text-lg text-white capitalize">Contact Us</p>
        <Link
          href={`${process.env.NEXT_PUBLIC_WHATSAPP_LINK}`}
          target="_blank"
          className="text-md text-secondary capitalize"
        >
          <span className="text-md capitalize text-[#128c7e]">
            WhatsApp Only:{" "}
          </span>{" "}
          +2349016760159
        </Link>
        <Link
          href={`mailto:${infoEmail}`}
          target="_blank"
          className="text-md text-secondary capitalize"
        >
          <span className="text-md capitalize text-white">Email Us: </span>{" "}
          {infoEmail}
        </Link>
        <Link
          href={`mailto:${advertEmail}`}
          target="_blank"
          className="text-md text-secondary capitalize"
        >
          <span className="text-md capitalize text-slate-400">
            Advert Only:{" "}
          </span>{" "}
          {advertEmail}
        </Link>
      </div>
      <div className="w-full h-px bg-gray-600 my-10" />
      <span className="text-sm font-semibold text-center text-gray-500">
        &copy; {year} All Right Reserved
      </span>
    </div>
  );
};

export default Footer;
