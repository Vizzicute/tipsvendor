"use client";

import { useGoogleTags } from "@/lib/react-query/queries";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export function Analytics() {
  const { data: googleTags } = useGoogleTags();

  const GA_MEASUREMENT_ID: string = googleTags?.gaMeasurementId || "";
  const pathname = usePathname();

  useEffect(() => {
    if (!window.gtag) return;

    if (pathname.startsWith("/admin")) return;

    window.gtag("config", GA_MEASUREMENT_ID, {
      page_path: pathname,
    });
  }, [pathname]);

  return null;
}
