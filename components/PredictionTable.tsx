"use client";

import React, { useState } from "react";
import { Button } from "./ui/button";
import { Models } from "appwrite";
import { Loader2 } from "lucide-react";

interface PredictionTableProps {
  title: string;
  tableStat: Models.Document[] | undefined;
  category: string;
  adlink?: string;
  adimgurl?: string;
  loading: boolean;
}

const PredictionTable = ({
  title,
  tableStat,
  category,
  adimgurl,
  adlink,
  loading,
}: PredictionTableProps) => {
  const formattedTime = (date: string | Date): string => {
    const d = new Date(date);
    return d.toTimeString().split(":").slice(0, 2).join(":");
  };

  const getDateOnly = (input: string | Date) => {
    const date = new Date(input);
    return date.toISOString().split("T")[0]; // Already gives the YYYY-MM-DD format
  };

  const today = getDateOnly(new Date());
  const yesterday = getDateOnly(new Date(Date.now() - 86400000));
  const tomorrow = getDateOnly(new Date(Date.now() + 86400000));

  const [day, setDay] = useState(today);

  const filteredData = tableStat
    ?.filter((data) => getDateOnly(data.datetime) === day)
    .sort(
      (a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime()
    );

  return (
    <div className="py-5 w-full h-fit gap-4 flex flex-wrap justify-center items-center">
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

      <h2 className="capitalize w-full text-center font-semibold text-xl text-primary">
        {day === today ? "Today" : day === yesterday ? "Yesterday" : "Tomorrow"}
        's {title}
      </h2>

      <div className="w-full flex items-center justify-center py-2 px-1">
        {loading ? (
          <Loader2 className="size-10 animate-spin text-gray-600" />
        ) : filteredData?.length === 0 ? (
          <h2 className="capitalize font-semibold text-xl text-gray-600">
            {day === yesterday
              ? "No prediction was added!"
              : "No prediction yet!"}
          </h2>
        ) : (
          <table className="border-collapse w-full text-center text-[10px] overflow-x-scroll no-scrollbar">
            <thead>
              <tr className="bg-primary text-secondary">
                <th className="py-2">Time</th>
                <th>League</th>
                <th>Matches</th>
                <th>Tips</th>
                <th>Scores</th>
                {(category === "free" || category === "isBanker") && (
                  <th>Odds</th>
                )}
                {adlink && adimgurl && <th>Bet</th>}
              </tr>
            </thead>
            <tbody>
              {filteredData?.map((data) => (
                <tr
                  key={data.$id}
                  className="text-[12px] odd:bg-white even:bg-gray-100 border-b"
                >
                  <td className="py-2">{formattedTime(data.datetime)}</td>
                  <td className="uppercase">{data.league}</td>
                  <td>
                    {data.hometeam} <strong className="text-primary">VS</strong>{" "}
                    {data.awayteam}
                  </td>
                  <td>
                    {
                    category === "draw" && data.tip === "X"
                      ? "X"
                      : category === "free"
                      ? data.tip
                      : category === "chance"
                      ? data.chance
                      : category === "htft"
                      ? data.htft
                      : category === "either"
                      ? data.either
                      : category === "over"
                      ? data.over
                      : category === "isBanker"
                      ? data.tip
                      : category === "isBtts" && data.isBtts
                      ? "BTTS"
                      : data.tip
                    }
                  </td>
                  <td
                    className={
                      data.status === "win" &&
                      (category === "free" || category === "isBanker")
                        ? "text-green-600"
                        : data.status === "loss" &&
                          (category === "free" || category === "isBanker")
                        ? "text-red-600"
                        : "text-gray-600"
                    }
                  >
                    {data.homescore}:{data.awayscore}
                  </td>
                  {(category === "free" || category === "isBanker") && (
                    <td>{data.odd}</td>
                  )}
                  <td>
                    {adlink && adimgurl && (
                      <a
                        href={adlink}
                        target="_blank"
                        className="flex items-center justify-center"
                      >
                        <img
                          className="rounded-sm w-[40px] p-1 bg-gray-200"
                          src={adimgurl}
                          alt="Ad"
                        />
                      </a>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default PredictionTable;
