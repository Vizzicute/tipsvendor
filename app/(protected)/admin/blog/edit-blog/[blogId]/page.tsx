"use client";

import React from "react";
import { getSingleBlog } from "@/lib/appwrite/fetch";
import { notFound } from "next/navigation";
import EditBlogForm from "../EditBlogForm";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

export default function Page() {
  const { blogId } = useParams();

  const { data: blog, isLoading } = useQuery({
    queryKey: ["blog"],
    queryFn: async () => getSingleBlog(blogId as string),
  });

  if (!blog) notFound();
  return (
    <div className="space-y-2">
      <div className="w-full flex items-center justify-start">
        <h1 className="text-2xl font-bold tracking-tight">Edit Blog Post</h1>
      </div>

      <EditBlogForm blog={blog} />
    </div>
  );
}
