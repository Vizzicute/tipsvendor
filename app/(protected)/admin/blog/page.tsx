"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import BlogTabs from "@/components/BlogTabs";
import { useBlogs } from "@/lib/react-query/queries";
import AddBlogCategory from "@/components/AddBlogCategory";
import { useBlogCategories, useComments } from "@/lib/react-query/queries";
import { getCollectionCounts } from "@/lib/appwrite/fetch";

export default function BlogPage() {
  const PAGE_SIZE = 15;
  const [blogPage, setBlogPage] = useState(1);
  const [commentPage, setCommentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [status, setStatus] = useState("all");
  const [blogTotal, setBlogTotal] = useState(0);
  const [commentTotal, setCommentTotal] = useState(0);

  const filters: any = {};
  if (searchTerm) filters.title = searchTerm;
  if (status !== "all") filters.status = status;

  const { data: blogs, isLoading } = useBlogs(filters, blogPage, PAGE_SIZE);
  const { data: comments, isLoading: commentsLoading } = useComments(commentPage, PAGE_SIZE);
  const { data: categories, isLoading: categoriesLoading } = useBlogCategories();

  useEffect(() => {
    async function fetchCounts() {
      try {
        const blogCountDoc = await getCollectionCounts("blog");
        setBlogTotal(blogCountDoc.counts || 0);
        const commentCountDoc = await getCollectionCounts("comment");
        setCommentTotal(commentCountDoc.counts || 0);
      } catch (e) {
        setBlogTotal(0);
        setCommentTotal(0);
      }
    }
    fetchCounts();
  }, [filters]);

  const blogTotalPages = Math.ceil(blogTotal / PAGE_SIZE);
  const commentTotalPages = Math.ceil(commentTotal / PAGE_SIZE);

  const [currentTab, setCurrentTab] = useState("content");

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
        return <AddBlogCategory />;
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
      <div className="flex gap-4 mb-4">
        <input
          type="text"
          placeholder="Search blog title..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="border rounded px-2 py-1"
        />
        <select
          value={status}
          onChange={e => setStatus(e.target.value)}
          className="border rounded px-2 py-1"
        >
          <option value="all">All</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
      </div>
      <Card>
        <CardContent>
          <BlogTabs
            blog={blogs || []}
            comments={comments || []}
            categories={categories || []}
            loading={isLoading || commentsLoading || categoriesLoading}
            currentTab={currentTab}
            blogPage={blogPage}
            blogTotalPages={blogTotalPages}
            handleBlogPageChange={setBlogPage}
            commentPage={commentPage}
            commentTotalPages={commentTotalPages}
            handleCommentPageChange={setCommentPage}
            onTabChange={setCurrentTab}
          />
        </CardContent>
      </Card>
    </div>
  );
}
