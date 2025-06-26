// components/TelegramModal.jsx
"use client";

import { useSocials } from "@/lib/react-query/queries";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const AdPopupModal = () => {
  const pathname = usePathname();
  const [show, setShow] = useState(false);
  const [link, setLink] = useState("https://t.me/tipsvendor");

  // Move useQuery outside useEffect for correct React Query usage
  const { data: socials, isLoading } = useSocials();

  useEffect(() => {
    if (!isLoading && socials && socials.telegram) {
      setLink(socials.telegram);
    }
  }, [isLoading, socials]);

  useEffect(() => {
    if (
      pathname.startsWith("/admin") ||
      pathname.startsWith("/dashboard") ||
      pathname.startsWith("/login") ||
      pathname.startsWith("/admin-auth") ||
      pathname.startsWith("/register") ||
      pathname.startsWith("new-staff") ||
      pathname.startsWith("reset-password")
    )
      return;
    const timer = setTimeout(() => setShow(true), 5000);
    return () => clearTimeout(timer);
  }, [pathname]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
      <div className="relative bg-white rounded-md text-center">
        <button
          className="absolute top-0 right-2 text-3xl text-[#3b2b1b] cursor-pointer"
          onClick={() => setShow(false)}
        >
          &times;
        </button>
        <a href={link} target="_blank" rel="noopener noreferrer">
          <img src="/telegram.png" alt="Pop up Advert" className="mx-auto" />
        </a>
      </div>
    </div>
  );
};

export default AdPopupModal;
