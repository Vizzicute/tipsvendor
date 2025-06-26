"use client";

import { useGoogleTags } from "@/lib/react-query/queries";
import { useEffect } from "react";

export default function AdSlot() {
  const { data: googleTags } = useGoogleTags();

  const adClient: string = googleTags?.adsenseId;

  if (!adClient) return null;

  useEffect(() => {
    try {
      if (
        typeof window !== "undefined" &&
        (window.adsbygoogle = window.adsbygoogle || [])
      ) {
        window.adsbygoogle.push({});
      }
    } catch (e) {
      console.error("AdSense ad load failed:", e);
    }
  }, []);

  return (
    <ins
      className="adsbygoogle"
      style={{ display: "block" }}
      data-ad-client={adClient}
      data-ad-slot="1234567890"
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  );
}
