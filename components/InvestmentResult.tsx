"use client";

import { CircleCheck, CircleMinus, CircleX } from "lucide-react";
import { format, subDays, isSameDay } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { getPredictions } from "@/lib/appwrite/fetch";

const InvestmentResult = () => {
  const { data: predictions, isLoading } = useQuery({
    queryKey: ["predictions"],
    queryFn: getPredictions,
  });

  const last7Days = Array.from({ length: 7 }, (_, i) =>
    subDays(new Date(), 7 - i)
  );

  const getDayResult = (date: Date) => {
    if (!predictions) return null;
    
    const dayPreds = predictions?.filter(
      (p: any) =>
        p.subscriptionType === "investment" &&
        isSameDay(new Date(p.datetime), date)
    );
    if (dayPreds.length === 0) return "none";
    if (dayPreds.some((p: any) => p.status === "loss")) return "loss";
    if (dayPreds.every((p: any) => p.status === "win")) return "win";
    return "other";
  };

  return (
    <div className="relative w-full h-fit">
      <div className="absolute inset-0 bg-[url(/bg-image-2.jpg)] bg-center opacity-70" />
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/70 to-secondary" />
      <div className="relative z-10 text-white p-2 w-full flex flex-wrap gap-4">
        <h2 className="w-full uppercase font-bold text-xl md:text-2xl text-center">
          Investment Plan Results Last 7 days
        </h2>
        <table className="border-collapse w-full text-center text-[10px]">
          <thead>
            <tr className="bg-white text-primary">
              <th className="py-2">Date</th>
              {last7Days.map((date, idx) => (
                <th key={idx}>{format(date, "EEE dd/MM")}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="text-[12px] bg-white border-b">
              <td className="py-2 text-black">Result</td>
              {last7Days.map((date, idx) => {
                const result = getDayResult(date);
                if (isLoading) {
                  return <td key={idx}>...</td>;
                }
                if (result === "loss") {
                  return (
                    <td key={idx}>
                      <CircleX className="bg-red-600 rounded-full justify-self-center" />
                    </td>
                  );
                }
                if (result === "win") {
                  return (
                    <td key={idx}>
                      <CircleCheck className="bg-green-600 rounded-full justify-self-center" />
                    </td>
                  );
                }
                if (result === "other") {
                  return (
                    <td key={idx}>
                      <CircleMinus className="bg-gray-500 rounded-full justify-self-center" />
                    </td>
                  );
                }
                
                return (
                  <td key={idx}>
                    <CircleMinus className="bg-gray-500 rounded-full justify-self-center" />
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InvestmentResult;
