"use client";

import React from "react";
import { getSingleBlog } from "@/lib/appwrite/fetch";
import EditBlogForm from "../EditBlogForm";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

export default function Page() {
  const { blogId } = useParams();

  const { data: blog, isLoading, isError } = useQuery({
    queryKey: ["blog", blogId],
    queryFn: async () => getSingleBlog(blogId as string),
    enabled: !!blogId,
  });

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
