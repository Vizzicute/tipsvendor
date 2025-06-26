"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import BlogTabs from "@/components/BlogTabs";
import { useBlogs } from "@/hooks/useBlogs";
import { useSearchParams } from "next/navigation";
import AddBlogCategory from "@/components/AddBlogCategory";
import { useBlogCategories, useComments } from "@/lib/react-query/queries";

export default function BlogPage() {
  const searchParams = useSearchParams();
  const status = searchParams.get("status") || "all";
  const [currentTab, setCurrentTab] = useState("content");
  const { data: blogs, isLoading } = useBlogs();

  const { data: comments, isLoading: commentsLoading } = useComments();

  const { data: categories, isLoading: categoriesLoading } = useBlogCategories();

  const filteredBlogs = blogs ? blogs.filter((blog) => {
    if (status === "all") return true;
    return blog.status === status;
  }) : [];

  const getAddButtonContent = () => {
    switch (currentTab) {
      case "content":
        return (
          <Link href="/admin/blog/add-blog">
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Blog Post
            </Button>
          </Link>
        );
      case "categories":
        return (
          <AddBlogCategory />
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Blog Management</h1>
        {getAddButtonContent()}
      </div>

      <Card>
        <CardContent>
          <BlogTabs
            blog={filteredBlogs || []} 
            comments={comments || []}
            categories={categories || []}
            loading={isLoading || commentsLoading || categoriesLoading} 
            onTabChange={setCurrentTab}
          />
        </CardContent>
      </Card>
    </div>
  );
}
