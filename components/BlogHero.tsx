import Link from "next/link";
import React from "react";
import { cn, truncate } from "@/lib/utils";
import { Models } from "node-appwrite";
import { format } from "date-fns";
import { useRouter } from "next/navigation";

interface BlogHeroProps {
  blog: Models.Document[] | undefined;
  className?: string;
  loading: boolean;
}

const BlogHero = ({ blog, className, loading }: BlogHeroProps) => {
  const router = useRouter();
  const publishedBlog = blog?.filter((blog) => blog.status === "published");

  const mostRecentBlog = publishedBlog?.sort(
    (a, b) =>
      new Date(b.$createdAt).getTime() - new Date(a.$createdAt).getTime()
  )[0];
  const secondMostRecentBlog = publishedBlog?.sort(
    (a, b) =>
      new Date(b.$createdAt).getTime() - new Date(a.$createdAt).getTime()
  )[1];
  const thirdMostRecentBlog = publishedBlog?.sort(
    (a, b) =>
      new Date(b.$createdAt).getTime() - new Date(a.$createdAt).getTime()
  )[2];
  const fourthMostRecentBlog = publishedBlog?.sort(
    (a, b) =>
      new Date(b.$createdAt).getTime() - new Date(a.$createdAt).getTime()
  )[3];

  const handleCategoryClick = (e: React.MouseEvent, slug: string) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/blog/${slug}`);
  };

  return (
    <div className={cn("w-full flex flex-col md:flex-row gap-1", className)}>
      <Link
        href={`/blog/${mostRecentBlog?.slug}`}
        className="relative w-full md:w-1/2 h-[400px] md:h-full overflow-hidden"
      >
        <div
          className="w-full h-full bg-cover bg-center transition-transform duration-500 hover:scale-110"
          style={{
            backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0) 55%, rgba(0,0,0,0.8)), url(${mostRecentBlog?.featuredImage})`,
          }}
        />
        <div className="absolute bottom-0 left-0 w-full h-fit max-h-full flex flex-col items-start justify-center px-4 py-2 gap-2">
          <div className="gap-1 flex flex-row w-fit">
            {mostRecentBlog?.blogCategories.map((category: Models.Document) => (
              <div
                key={category.$id}
                onClick={(e) => handleCategoryClick(e, category.slug)}
                className="text-white text-[12px] md:text-sm w-fit p-[2px] rounded-none bg-slate-500/40 cursor-pointer hover:bg-slate-500/60"
              >
                {category.name}
              </div>
            ))}
          </div>
          <h1 className="text-white text-md md:text-xl font-bold">
            {truncate(mostRecentBlog?.title, 80)}
          </h1>
          <p className="text-white text-[12px] md:text-sm">
            {process.env.NEXT_PUBLIC_APP_SHORT_TITLE} -{" "}
            {mostRecentBlog?.$createdAt
              ? format(new Date(mostRecentBlog.$createdAt), "MMM d, yyyy hh:mm a")
              : ""}
          </p>
        </div>
      </Link>
      <div className="md:w-1/2 w-full overflow-x-scroll md:overflow-x-hidden h-2/3 md:h-full flex md:justify-center md:flex-col gap-1">
        <Link
          href={`/blog/${secondMostRecentBlog?.slug}`}
          className="relative hidden md:block w-[65dvw] h-full md:w-full md:h-1/2 overflow-hidden"
        >
          <div
            className="w-full h-full bg-cover bg-center transition-transform duration-500 hover:scale-110"
            style={{
              backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0) 55%, rgba(0,0,0,0.8)), url(${secondMostRecentBlog?.featuredImage})`,
            }}
          />
          <div className="absolute bottom-0 left-0 w-full h-fit max-h-full flex flex-col items-start justify-center px-4 py-2 gap-2">
            <div className="gap-1 flex flex-row w-fit">
              {secondMostRecentBlog?.blogCategories.map(
                (category: Models.Document) => (
                  <div
                    key={category.$id}
                    onClick={(e) => handleCategoryClick(e, category.slug)}
                    className="text-white text-sm w-fit p-[2px] rounded-none bg-slate-500/40 cursor-pointer hover:bg-slate-500/60"
                  >
                    {category.name}
                  </div>
                )
              )}
            </div>
            <h1 className="text-white text-md font-semibold">
              {truncate(secondMostRecentBlog?.title, 70)}
            </h1>
          </div>
        </Link>
        <div className="md:w-full md:h-1/2 w-fit h-full flex flex-row gap-1">
          <Link
            href={`/blog/${secondMostRecentBlog?.slug}`}
            className="relative md:hidden w-[65dvw] h-full overflow-hidden"
          >
            <div
              className="w-full h-full bg-cover bg-center transition-transform duration-500 hover:scale-110"
              style={{
                backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0) 55%, rgba(0,0,0,0.8)), url(${secondMostRecentBlog?.featuredImage})`,
              }}
            />
            <div className="absolute bottom-0 left-0 w-full h-fit max-h-full flex flex-col items-start justify-center px-4 py-2 gap-2">
              <div className="gap-1 flex flex-row w-fit">
                {secondMostRecentBlog?.blogCategories.map(
                  (category: Models.Document) => (
                    <div
                      key={category.$id}
                      onClick={(e) => handleCategoryClick(e, category.slug)}
                      className="text-white text-[12px] w-fit p-[2px] rounded-none bg-slate-500/40 cursor-pointer hover:bg-slate-500/60"
                    >
                      {category.name}
                    </div>
                  )
                )}
              </div>
              <h1 className="text-white text-md font-semibold">
                {truncate(secondMostRecentBlog?.title, 70)}
              </h1>
            </div>
          </Link>
          <Link
            href={`/blog/${thirdMostRecentBlog?.slug}`}
            className="relative md:w-1/2 w-[65dvw] h-full overflow-hidden"
          >
            <div
              className="w-full h-full bg-cover bg-center transition-transform duration-500 hover:scale-110"
              style={{
                backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0) 55%, rgba(0,0,0,0.8)), url(${thirdMostRecentBlog?.featuredImage})`,
              }}
            />
            <div className="absolute bottom-0 left-0 w-full h-fit max-h-full flex flex-col items-start justify-center px-4 py-2 gap-2">
              <div className="gap-1 flex flex-row w-fit">
                {thirdMostRecentBlog?.blogCategories.map(
                  (category: Models.Document) => (
                    <div
                      key={category.$id}
                      onClick={(e) => handleCategoryClick(e, category.slug)}
                      className="text-white text-sm w-fit p-[2px] rounded-none bg-slate-500/40 cursor-pointer hover:bg-slate-500/60"
                    >
                      {category.name}
                    </div>
                  )
                )}
              </div>
              <h1 className="text-white text-sm font-semibold">
                {truncate(thirdMostRecentBlog?.title, 50)}
              </h1>
            </div>
          </Link>
          <Link
            href={`/blog/${fourthMostRecentBlog?.slug}`}
            className="relative md:w-1/2 w-[65dvw] h-full overflow-hidden"
          >
            <div
              className="w-full h-full bg-cover bg-center transition-transform duration-500 hover:scale-110"
              style={{
                backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0) 55%, rgba(0,0,0,0.8)), url(${fourthMostRecentBlog?.featuredImage})`,
              }}
            />
            <div className="absolute bottom-0 left-0 w-full h-fit max-h-full flex flex-col items-start justify-center px-4 py-2 gap-2">
              <div className="gap-1 flex flex-row w-fit">
                {fourthMostRecentBlog?.blogCategories.map(
                  (category: Models.Document) => (
                    <div
                      key={category.$id}
                      onClick={(e) => handleCategoryClick(e, category.slug)}
                      className="text-white text-sm w-fit p-[2px] rounded-none bg-slate-500/40 cursor-pointer hover:bg-slate-500/60"
                    >
                      {category.name}
                    </div>
                  )
                )}
              </div>
              <h1 className="text-white text-sm font-semibold">
                {truncate(fourthMostRecentBlog?.title, 50)}
              </h1>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BlogHero;
