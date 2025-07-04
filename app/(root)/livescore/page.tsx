"use client";

import CategorySection from "@/components/CategorySection";
import Hero from "@/components/Hero";
import { Button } from "@/components/ui/button";
import { singleSeoPageByUrl } from "@/lib/react-query/queries";
import React, { useState } from "react";

const Page = () => {
  const pageTitle = "free-predictions";
  const { data: seopage, isPending: isSeoLoading } = singleSeoPageByUrl(pageTitle as string);

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
        <script id="skin">
          var tr_leagueHeader_bg="#3b2b1b";
          var tr_leagueHeader_color="#d1b47a";
          var tr_leagueHeader_fontSize="1.2em";
          var tr_leagueHeader_fontWeight="bold";
          var tr_leagueHeader_padding="5px 10px";
          var tr_leagueHeader_borderBottom="1px solid #d1b47a";
          var tr_leagueHeader_borderTop="1px solid #d1b47a";
          var tr_leagueHeader_borderLeft="1px solid #d1b47a";
          var tr_leagueHeader_borderRight="1px solid #d1b47a";
        </script>
        <script
          // @ts-expect-error: livescore.bz expects non-standard attributes
          api="livescore"
          src="https://www.livescore.bz/api.livescore.0.1.js"
          type="text/javascript"
        ></script>

        <a
          id="livescore"
          data-1={
            day === today
              ? "today"
              : day === yesterday
              ? "yesterday"
              : "tomorrow"
          }
          href="https://www.livescore.bz"
          lang="en"
          // @ts-expect-error: livescore.bz expects non-standard attributes
          sport="football(soccer)"
        >
          <h4>Loading...</h4>
        </a>
      </section>
    </main>
  );
};

export default Page;
