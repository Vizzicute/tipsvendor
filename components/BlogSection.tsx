import { ArrowRight } from "lucide-react";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";
import { truncate } from "@/lib/utils";
import { Models } from "node-appwrite";
import { formatDate } from "date-fns";
import { Skeleton } from "./ui/skeleton";

interface blogDataProp {
  blog: Models.Document[] | undefined;
  isLoading: boolean;
}

const BlogSection = ({ blog, isLoading }: blogDataProp) => {
  return (
    <div className="w-full p-2 gap-2 mt-4 flex flex-wrap">
      <div className="w-full bg-primary text-secondary text-center rounded-t-full uppercase p-2 font-exo shadow-lg">
        sport news
      </div>
      <div className="flex flex-wrap w-full gap-2 p-2">
        {blog?.map((data: Models.Document) => (
          <Link
            key={data.$id}
            href={`/blog/${data.slug}`}
            className="w-full md:w-[45%] flex items-center p-2 rounded-sm shadow-lg"
          >
            {isLoading ? (
              <Skeleton className="rounded-sm shadow-sm object-fill size-[95px] justify-self-start" />
            ) : (
              <img
                src={data.featuredImage}
                width={90}
                height={90}
                className="rounded-sm shadow-sm object-contain size-[95px] justify-self-start"
              />
            )}
            <div className="flex flex-wrap w-auto p-2 gap-2">
              <p className="font-semibold text-[13.5px] text-start w-full">
                {isLoading ? (
                  <Skeleton className="rounded-sm shadow-sm object-fill size-[95px] justify-self-start" />
                ) : (
                  truncate(data.title, 50)
                )}
              </p>
              <Button
                variant={"outline"}
                className="hidden md:flex border-1 border-black text-black"
              >
                Read More
              </Button>
              <p className="text-[11px] font-light md:hidden">
                {isLoading ? (
                  <Skeleton className="rounded-sm shadow-sm object-fill size-[95px] justify-self-start" />
                ) : (
                  formatDate(data.publishedAt, "MMM dd, yyyy")
                )}
              </p>
            </div>
          </Link>
        ))}
      </div>
      <Link
        href={"/blog"}
        className="flex flex-nowrap items-center justify-center w-full bg-primary text-secondary text-center rounded-b-full uppercase p-2 font-exo"
      >
        more news <ArrowRight />
      </Link>
    </div>
  );
};

export default BlogSection;
