"use client";

import React from "react";
import { Button } from "./ui/button";
import { Landmark, Send } from "lucide-react";
import Link from "next/link";
import WhatsappIcon from "./WhatsappIcon";
import { getSocialSettings } from "@/lib/appwrite/appConfig";
import { useQuery } from "@tanstack/react-query";

const WBTLinks = () => {
  const { data: settings, isLoading: isSettingsLoading } = useQuery({
    queryKey: ["settings"],
    queryFn: getSocialSettings,
  });
  return (
    <div className="w-full p-2 gap-2 flex flex-wrap items-center justify-around">
      <Link
        href={settings?.whatsapp || "#"}
        target="_blank"
        className="w-[45%] md:w-[30%]"
      >
        <Button className="w-full bg-[#128c7e] text-gray-50">
          <WhatsappIcon /> Message Us
        </Button>
      </Link>
      <Link href={"/banker"} className="w-[45%] md:w-[30%]">
        <Button
          variant={"outline"}
          className="w-full border-2 border-black font-semibold"
        >
          <Landmark width={24} /> Banker Bet
        </Button>
      </Link>
      <Link
        href={settings?.telegram || "#"}
        target="_blank"
        className="w-[96%] md:w-[30%]"
      >
        <Button className="w-full bg-[#0088cc] text-gray-50">
          <Send /> Join Our Telegram Channel
        </Button>
      </Link>
    </div>
  );
};

export default WBTLinks;
