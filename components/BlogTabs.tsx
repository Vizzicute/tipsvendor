"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BlogContent from "./BlogContent";
import BlogComments from "./BlogComments";
import BlogCategories from "./BlogCategories";
import { Models } from "node-appwrite";

interface BlogTabsProps {
  blog: Models.Document[] | undefined;
  comments: Models.Document[] | undefined;
  categories: Models.Document[] | undefined;
  loading: boolean;
  onTabChange?: (value: string) => void;
}

const BlogTabs = ({ blog, comments, categories, loading, onTabChange }: BlogTabsProps) => {
  return (
    <Tabs defaultValue="content" className="w-full" onValueChange={onTabChange}>
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="content">Blog Content</TabsTrigger>
        <TabsTrigger value="comments">Comments</TabsTrigger>
        <TabsTrigger value="categories">Categories</TabsTrigger>
      </TabsList>
      <TabsContent value="content">
        <BlogContent blog={blog || []} isLoading={loading} />
      </TabsContent>
      <TabsContent value="comments">
        <BlogComments comments={comments || []} isLoading={loading} />
      </TabsContent>
      <TabsContent value="categories">
        <BlogCategories categories={categories || []} isLoading={loading} />
      </TabsContent>
    </Tabs>
  );
};

export default BlogTabs; 