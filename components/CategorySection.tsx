"use client";

import Link from "next/link";
import React from "react";
import ThreeGradientButton from "./ThreeGradientButton";
import { usePathname } from "next/navigation";

const CategorySection = () => {
  const pathname = usePathname();
  const categories = [
    {
      text: "Free Tips",
      link: "/",
    },
    {
      text: "Overs/Unders",
      link: "/overs",
    },
    {
      text: "Draw",
      link: "/draw",
    },
    {
      text: "Double Chance",
      link: "/chance",
    },
    {
      text: "Either Half",
      link: "/either",
    },
    {
      text: "HT/FT",
      link: "/htft",
    },
    {
      text: "BTTS/GG",
      link: "/btts",
    },
  ];
  return (
    <div className="w-full p-5 flex flex-nowrap flex-row overflow-x-scroll no-scrollbar md:items-center md:justify-center items-start gap-2">
      {categories.map((data) => (
        <Link href={data.link} key={data.text}>
          <ThreeGradientButton
            className={`${
              pathname === data.link &&
              "bg-gradient-to-tl from-primary via-secondary to-primary text-white"
            }`}
          >
            {data.text}
          </ThreeGradientButton>
        </Link>
      ))}
    </div>
  );
};

export default CategorySection;
