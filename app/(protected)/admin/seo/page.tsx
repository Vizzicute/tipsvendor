"use client";

import { Card, CardContent } from "@/components/ui/card";




import { getSeoPages } from "@/lib/appwrite/fetch";
import { useQuery } from "@tanstack/react-query";
import React from "react";




import Link from "next/link";
import { FilePlus2 } from "lucide-react";

const page = () => {
  const {
    data: seopages,
  } = useQuery({
    queryKey: ["documents"],
    queryFn: getSeoPages,
  });


  const sortedseopages = seopages ? seopages : [];


  return (
    <div className="space-y-6">
      <div className="flex justify-start items-center">
        <h1 className="text-2xl font-bold tracking-tight">Seo Pages</h1>
      </div>

      <Card>
        <CardContent className="pt-6">
          {sortedseopages === undefined ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-500">
                Loading seopages...
              </h3>
            </div>
          ) : sortedseopages?.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-500">
                No Pages found
              </h3>
            </div>
          ) : (
            <div className="w-full gap-4 p-1 flex flex-wrap items-center justify-around">
              {sortedseopages?.map((data) => (
                <div
                  key={data.$id}
                  className="relative w-[45%] h-56 rounded-xl overflow-hidden shadow-lg"
                >
                  <iframe
                    src={`${process.env.NEXT_PUBLIC_APP_URL}/${data.url}`}
                    className="absolute top-0 left-1/2 w-full h-[2000px] pointer-events-none scale-100 transform -translate-x-1/2 -translate-y-[500px] origin-center"
                  ></iframe>
                  <div className="absolute inset-0 bg-primary/60 flex flex-col items-center justify-center gap-2 text-white text-center px-4">
                    <span className="font-semibold text-xl capitalize flex flex-wrap">
                      {data.title}
                    </span>
                    <Link
                      href={`${process.env.NEXT_PUBLIC_APP_URL}/${data.url}`}
                      className="text-md underline italic"
                      target="_blank"
                    >
                      {`${process.env.NEXT_PUBLIC_APP_URL}/${data.url}`}
                    </Link>
                    <Link
                      href={`/admin/seo/edit-page/${data.$id}`}
                      className="underline text-cyan-500 capitalize flex flex-nowrap text-sm"
                    >
                      <FilePlus2 />
                      edit this page
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default page;
