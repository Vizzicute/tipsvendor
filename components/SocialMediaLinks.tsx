import Link from "next/link";
import React from "react";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Send,
} from "lucide-react";
import { useSocials } from "@/lib/react-query/queries";

const SocialMediaLinks = () => {
  const { data: socialSettings } = useSocials();

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
        <span className="text-sm">join us on</span>
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
        <span className="text-sm">like our page on</span>
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
        <span className="text-sm">follow us on</span>
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
        <span className="text-sm">connect with us on</span>
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
        <span className="text-sm">connect with us on</span>
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
        <span className="text-sm">subscribe to our channel on</span>
        <span className="font-semibold">YouTube</span>
      </Link>
    </div>
  );
};

export default SocialMediaLinks;
