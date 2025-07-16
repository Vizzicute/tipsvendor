"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export function AdSenseManager() {
  const pathname = usePathname();

  useEffect(() => {
    if (
      pathname.startsWith("/admin") ||
      pathname.startsWith("/login") ||
      pathname.startsWith("/admin-auth") ||
      pathname.startsWith("/register") ||
      pathname.startsWith("/new-staff") ||
      pathname.startsWith("/reset-password") ||
      pathname.startsWith("/verification")
    )
      return;
    try {
      if (typeof window !== "undefined" && (window as any).adsbygoogle) {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (e) {
      console.error("AdSense error:", e);
    }
  }, [pathname]);

  return null;
}
