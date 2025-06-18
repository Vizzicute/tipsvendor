"use client";

import { getGoogleTagSettings } from "@/lib/appwrite/appConfig";
import { useQuery } from "@tanstack/react-query";
import Script from "next/script";
import React from "react";

const AnalyticScript = () => {
  const { data: googleTags } = useQuery({
    queryKey: ["google-tags"],
    queryFn: getGoogleTagSettings,
  });

  const GA_MEASUREMENT_ID: string = googleTags?.gaMeasurementId || "";

  if (!GA_MEASUREMENT_ID) return null;

  return (
    <Script
      id="gtag-script"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}', {
            page_path: window.location.pathname,
          });
        `,
      }}
    />
  );
};

export default AnalyticScript;
