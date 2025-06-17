"use client";

import { getGoogleTagSettings } from "@/lib/appwrite/appConfig";
import { useQuery } from "@tanstack/react-query";
import Script from "next/script";
import React from "react";

const AdScript = () => {
  const { data: googleTags } = useQuery({
    queryKey: ["google-tags"],
    queryFn: getGoogleTagSettings,
  });

  const adClient: string = googleTags?.adsenseId;
  
  if (!adClient) return null;

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
