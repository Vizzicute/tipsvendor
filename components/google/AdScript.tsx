"use client";

import { getGoogleTagSettings } from "@/lib/appwrite/appConfig";
import { useQuery } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import Script from "next/script";
import React from "react";

const AdScript = () => {
  const pathname = usePathname();
  const { data: googleTags } = useQuery({
    queryKey: ["google-tags"],
    queryFn: getGoogleTagSettings,
  });

  const adClient: string = googleTags?.adsenseId;

  if (!adClient) return null;

  if (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/admin-auth") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/new-staff") ||
    pathname.startsWith("/reset-password")
  )
    return;

  return (
    <Script
      strategy="afterInteractive"
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adClient}`}
      crossOrigin="anonymous"
    />
  );
};

export default AdScript;
