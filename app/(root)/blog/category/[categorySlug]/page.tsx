"use client";

import { useQuery } from "@tanstack/react-query";
import { getBlog, getBlogCategories } from "@/lib/appwrite/fetch";
import { Models } from "appwrite";
import BlogCard from "@/components/BlogCard";
import BlogHeadingTextWrapper from "@/components/BlogHeadingTextWrapper";
import { useParams } from "next/navigation";
import React from "react";

const BlogCategoryPage = () => {
  const params = useParams();
  const categorySlug = params?.categorySlug as string;

  const { data: blogCategories, isLoading: isCategoriesLoading } = useQuery({
    queryKey: ["blogCategories"],
    queryFn: getBlogCategories,
  });

  const { data: blogs, isLoading: isBlogsLoading } = useQuery({
    queryKey: ["blogs"],
    queryFn: getBlog,
  });

  // Find the category object by slug (assuming slug is the category name in lowercase)
  const category =
    blogCategories?.find(
      (cat: Models.Document) =>
        cat.name.toLowerCase().replace(/\s+/g, "-") === categorySlug
    ) || null;

  // Filter blogs by category name
  const blogsInCategory = blogs?.filter(
    (blog: Models.Document) => blog.category?.toLowerCase() === category?.name?.toLowerCase()
  );

  return (
    <div className="w-full flex flex-col gap-4 items-center justify-center px-2 mb-4 max-w-5xl">
      <BlogHeadingTextWrapper
        text={category ? category.name : "Category"}
        bgColor="bg-primary"
        textColor="text-secondary"
      />
      <div className="w-full flex flex-col gap-4 mt-4">
        {isBlogsLoading || isCategoriesLoading ? (
          <div className="text-center py-10">Loading...</div>
        ) : blogsInCategory && blogsInCategory.length > 0 ? (
          blogsInCategory.map((blog: Models.Document) => (
            <BlogCard key={blog.$id} blog={blog} textSize={100} />
          ))
        ) : (
          <div className="text-center py-10 text-gray-500">
            No blogs found in this category.
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogCategoryPage;
