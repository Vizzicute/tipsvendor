"use client";

import Link from "next/link";
import React from "react";
import Logo from "./Logo";
import { AlignJustify } from "lucide-react";
import { NavbarLinks, SubnavLinks } from "@/data";
import { usePathname } from "next/navigation";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";

const Navbar = () => {
  const pathname = usePathname();
  return (
    <>
      <div className="py-5 px-10 flex justify-between bg-primary">
        <Link href={"/"} className="">
          <Logo width={70} />
        </Link>
        <div className="text-secondary">
          <div className="flex md:hidden">
            <Sheet>
              <SheetTrigger>
                <AlignJustify className="hover:border-none" />
              </SheetTrigger>
              <SheetContent side="top" className="w-full items-left p-5 bg-primary text-secondary font-osward uppercase">
                <SheetHeader>
                  <SheetTitle>
                    <Logo />
                  </SheetTitle>
                </SheetHeader>
                <div className="grid gap-2 py-7 ">
                  {NavbarLinks.map((data) => (
                    <Link
                      key={data.text}
                      href={data.link}
                      className={`${pathname === data.link && "text-stone-300"}`}
                    >
                      {data.text}
                    </Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
          <nav className="hidden md:flex items-center gap-4 text-lg font-oswald uppercase">
            {NavbarLinks.map((data) => (
              <Link
                key={data.text}
                href={data.link}
                className={`${pathname === data.link && "underline"}`}
              >
                {data.text}
              </Link>
            ))}
          </nav>
        </div>
      </div>
      <div className="hidden w-full py-2 px-4 md:flex items-center justify-around font-oswald text-[12px] lg:text-sm text-secondary uppercase bg-primary opacity-70">
        {SubnavLinks.map((data) => (
          <Link
            key={data.text}
            href={data.link}
            className={`${pathname === data.link && "underline"}`}
          >
            {data.text}
          </Link>
        ))}
      </div>
    </>
  );
};

export default Navbar;
