"use client";

import CategorySection from "@/components/CategorySection";
import Hero from "@/components/Hero";
import { Button } from "@/components/ui/button";
import { getSingleSeoPageByUrl } from "@/lib/appwrite/fetch";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import React, { useState } from "react";

const Page = () => {
  const pageTitle = "free-predictions";
  const { data: seopage, isPending: isSeoLoading } = useQuery({
    queryKey: ["seo-page", pageTitle],
    queryFn: () => getSingleSeoPageByUrl(pageTitle),
  });

  const getDateOnly = (input: string | Date) => {
    const date = new Date(input);
    return date.toISOString().split("T")[0]; // Already gives the YYYY-MM-DD format
  };

  const today = getDateOnly(new Date());
  const yesterday = getDateOnly(new Date(Date.now() - 86400000));
  const tomorrow = getDateOnly(new Date(Date.now() + 86400000));

  const [day, setDay] = useState(today);
  return (
    <main>
      <section>
        <Hero
          h1tag={seopage?.h1tag}
          description={seopage?.description}
          isSeoLoading={isSeoLoading}
        />
      </section>
      <section>
        <CategorySection />
      </section>
      <section className="py-5 w-full h-fit gap-4 flex flex-wrap justify-center items-center">
        <div className="px-5 w-full flex items-center justify-center gap-5">
          {[
            { label: "Yesterday", date: yesterday },
            { label: "Today", date: today },
            { label: "Tomorrow", date: tomorrow },
          ].map(({ label, date }) => (
            <Button
              key={date}
              onClick={() => setDay(date)}
              className={`p-2 md:w-[20%] w-[30%] text-sm ${
                day === date
                  ? "bg-transparent border border-primary text-primary"
                  : "bg-primary text-white"
              }`}
            >
              {label}
            </Button>
          ))}
        </div>
        <script
          data-api="livescore"
          src="https://www.livescore.bz/api.livescore.0.1.js"
          type="text/javascript"
        ></script>
        <Link
          id="livescore"
          data-1={day === today ? "today" : day === yesterday ? "yesterday" : "tomorrow"}
          href="https://www.livescore.bz"
          lang="en"
          data-sport="football(soccer)"
        >
          <h4>Loading...</h4>
        </Link>
      </section>
    </main>
  );
};

export default Page;
