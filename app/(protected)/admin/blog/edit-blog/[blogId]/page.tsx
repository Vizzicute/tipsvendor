"use client";

import React from "react";
import EditBlogForm from "../EditBlogForm";
import { useParams } from "next/navigation";
import { singleBlog } from "@/lib/react-query/queries";

export default function Page() {
  const { blogId } = useParams();

  const { data: blog, isLoading, isError } = singleBlog(blogId as string);

  if (isLoading) return <div>Loading...</div>;
  if (isError || !blog) return <div>Blog not found</div>;

  return (
    <div className="space-y-2">
      <div className="w-full flex items-center justify-start">
        <h1 className="text-2xl font-bold tracking-tight">Edit Blog Post</h1>
      </div>
      <EditBlogForm blog={blog} />
    </div>
  );
}
