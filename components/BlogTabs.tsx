"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BlogContent from "./BlogContent";
import BlogComments from "./BlogComments";
import BlogCategories from "./BlogCategories";
import { Models } from "node-appwrite";
import { useSearchParams, useRouter } from "next/navigation";

interface BlogTabsProps {
  blog: Models.Document[] | undefined;
  comments: Models.Document[] | undefined;
  categories: Models.Document[] | undefined;
  loading: boolean;
  onTabChange?: (value: string) => void;
  currentTab: string;
  blogPage: number;
  blogTotalPages: number;
  handleBlogPageChange: (page: number) => void;
  commentPage: number;
  commentTotalPages: number;
  handleCommentPageChange: (page: number) => void;
}

const BlogTabs = ({
  blog,
  comments,
  categories,
  loading,
  onTabChange,
  currentTab,
  blogPage,
  blogTotalPages,
  handleBlogPageChange,
  commentPage,
  commentTotalPages,
  handleCommentPageChange,
}: BlogTabsProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tab = currentTab;

  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("tab", value);
    router.replace(`?${params.toString()}`, { scroll: false });
    onTabChange?.(value);
  };

  return (
    <Tabs value={tab} className="w-full" onValueChange={handleTabChange}>
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="content">Blog Content</TabsTrigger>
        <TabsTrigger value="comments">Comments</TabsTrigger>
        <TabsTrigger value="categories">Categories</TabsTrigger>
      </TabsList>
      <TabsContent value="content">
        <BlogContent blog={blog || []} isLoading={loading} currentPage={blogPage} totalPages={blogTotalPages} handlePageChange={handleBlogPageChange} />
      </TabsContent>
      <TabsContent value="comments">
        <BlogComments comments={comments || []} isLoading={loading} currentPage={commentPage} totalPages={commentTotalPages} handlePageChange={handleCommentPageChange} />
      </TabsContent>
      <TabsContent value="categories">
        <BlogCategories categories={categories || []} isLoading={loading} />
      </TabsContent>
    </Tabs>
  );
};

export default BlogTabs;
