import Link from "next/link";
import React from "react";
import { getSocialSettings } from "@/lib/appwrite/appConfig";
import { useQuery } from "@tanstack/react-query";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Mail,
  Send,
} from "lucide-react";

const SocialMediaLinks = () => {
  const { data: socialSettings } = useQuery({
    queryKey: ["socialSettings"],
    queryFn: getSocialSettings,
  });

  const socialMediaLinks = {
    facebook: socialSettings?.facebook || "",
    twitter: socialSettings?.twitter || "",
    instagram: socialSettings?.instagram || "",
    linkedin: socialSettings?.linkedin || "",
    youtube: socialSettings?.youtube || "",
    supportEmail: socialSettings?.supportEmail || "",
    infoEmail: socialSettings?.infoEmail || "",
    advertEmail: socialSettings?.advertEmail || "",
  };

  return (
    <div className="w-full flex flex-col gap-2 px-2">
      <Link
        href={process.env.NEXT_PUBLIC_TELEGRAM_LINK || ""}
        target="_blank"
        className="flex items-center gap-2 flex-nowrap"
      >
        <span className="p-2 rounded-sm  bg-[#229ed9] text-white">
          <Send className="w-4 h-4" />{" "}
        </span>
        <span className="text-sm">187 followers</span>
        <span className="font-semibold">Telegram</span>
      </Link>
      <Link
        href={socialMediaLinks.facebook}
        target="_blank"
        className="flex items-center gap-2 flex-nowrap"
      >
        <span className="p-2 rounded-sm  bg-[#1877f2] text-white">
          <Facebook className="w-4 h-4" />{" "}
        </span>
        <span className="text-sm">20k followers</span>
        <span className="font-semibold">FaceBook</span>
      </Link>
      <Link
        href={socialMediaLinks.twitter}
        target="_blank"
        className="flex items-center gap-2 flex-nowrap"
      >
        <span className="p-2 rounded-sm  bg-[#1da1f2] text-white">
          <Twitter className="w-4 h-4" />{" "}
        </span>
        <span className="text-sm">20k followers</span>
        <span className="font-semibold">Twitter</span>
      </Link>
      <Link
        href={socialMediaLinks.instagram}
        target="_blank"
        className="flex items-center gap-2 flex-nowrap"
      >
        <span className="p-2 rounded-sm  bg-[#c32aa3] text-white">
          <Instagram className="w-4 h-4" />{" "}
        </span>
        <span className="text-sm">20k followers</span>
        <span className="font-semibold">Instagram</span>
      </Link>
      <Link
        href={socialMediaLinks.linkedin}
        target="_blank"
        className="flex items-center gap-2 flex-nowrap"
      >
        <span className="p-2 rounded-sm  bg-[#0077b5] text-white">
          <Linkedin className="w-4 h-4" />{" "}
        </span>
        <span className="text-sm">20k followers</span>
        <span className="font-semibold">LinkedIn</span>
      </Link>
      <Link
        href={socialMediaLinks.youtube}
        target="_blank"
        className="flex items-center gap-2 flex-nowrap"
      >
        <span className="p-2 rounded-sm  bg-[#ff0000] text-white">
          <Youtube className="w-4 h-4" />{" "}
        </span>
        <span className="text-sm">20k followers</span>
        <span className="font-semibold">YouTube</span>
      </Link>
    </div>
  );
};

export default SocialMediaLinks;
