"use client";

import { useQuery } from "@tanstack/react-query";
import { getBlog, getBlogCategories } from "@/lib/appwrite/fetch";
import React from "react";
import BlogMiniNav from "@/components/BlogMiniNav";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import BlogHero from "@/components/BlogHero";
import BlogsByCategory from "@/components/BlogsByCategory";
import { Models } from "appwrite";
import BlogCard from "@/components/BlogCard";
import BlogHeadingTextWrapper from "@/components/BlogHeadingTextWrapper";
import SocialMediaLinks from "@/components/SocialMediaLinks";

const page = () => {
  const { data: blogCategories, isLoading } = useQuery({
    queryKey: ["blogCategories"],
    queryFn: getBlogCategories,
  });

  const { data: blog, isLoading: isBlogLoading } = useQuery({
    queryKey: ["blog"],
    queryFn: getBlog,
  });

  const popularBlogs = blog?.sort((a, b) => b.comments.length - a.comments.length).slice(0, 7);

  return (
    <div className="w-full flex flex-col gap-4 items-center justify-center px-2 mb-4 max-w-7xl">
      <div className="w-full flex items-center justify-around gap-4">
        <BlogMiniNav blogCategories={blogCategories} loading={isLoading} />
        
      </div>
      <BlogHero blog={blog} loading={isLoading} className="h-100" />
      <div className="w-full flex md:flex-row flex-col gap-6 mt-4">
        <div className="md:w-2/3 w-full flex flex-col gap-4">
          {blogCategories?.map((category: Models.Document) => (
            <BlogsByCategory
              key={category.$id}
              blogCategories={blogCategories}
              loading={isLoading}
              blogCategoryName={category.name}
            />
          ))}
        </div>
        <div className="md:w-1/3 w-full flex flex-col gap-4">
          <div className="w-full flex flex-col gap-4">
            <BlogHeadingTextWrapper
              text="Social Media"
              bgColor="bg-primary"
              textColor="text-secondary"
            />
            <div className="w-full flex flex-col gap-4">
              <SocialMediaLinks />
            </div>
          </div>
          <div className="w-full flex flex-col gap-4">
            <BlogHeadingTextWrapper
              text="Popular Blogs"
              bgColor="bg-primary"
              textColor="text-secondary"
            />
            <div className="w-full hidden md:flex flex-col gap-4">
              {popularBlogs?.map((blog: Models.Document) => (
                <BlogCard key={blog.$id} blog={blog} textSize={23} />
              ))}
            </div>
            <div className="w-full flex md:hidden flex-col gap-4">
              {popularBlogs?.map((blog: Models.Document) => (
                <BlogCard key={blog.$id} blog={blog} textSize={100} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
