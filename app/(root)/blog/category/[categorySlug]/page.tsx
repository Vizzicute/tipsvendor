"use client";

import { Models } from "appwrite";
import BlogCard from "@/components/BlogCard";
import { useParams } from "next/navigation";
import React, { useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";
import { useBlogCategories } from "@/lib/react-query/queries";

const BLOGS_PER_PAGE = 12;

const BlogCategoryPage = () => {
  const params = useParams();
  const categorySlug = params?.categorySlug as string;

  const { data: blogCategories, isLoading: isCategoriesLoading } = useBlogCategories();

  // Find the category object by slug
  const category =
    blogCategories?.find((cat: Models.Document) => cat.slug === categorySlug) ||
    null;

  // Pagination state
  const [page, setPage] = useState(1);

  // Get all blogs for this category, sorted by comment count
  const allBlogs =
    category?.blog && Array.isArray(category.blog)
      ? [...category.blog].sort(
          (a: Models.Document, b: Models.Document) =>
            (b.comment?.length || 0) - (a.comment?.length || 0)
        )
      : [];

  // Calculate pagination
  const totalPages = Math.ceil(allBlogs.length / BLOGS_PER_PAGE);
  const paginatedBlogs = allBlogs.slice(
    (page - 1) * BLOGS_PER_PAGE,
    page * BLOGS_PER_PAGE
  );

  return (
    <div className="w-full flex flex-col space-y-4 items-center justify-center p-2 mb-4 max-w-7xl">
      <h2 className="font-semibold text-2xl text-center text-stone-700 capitalize pt-5">
        Category: {category?.name}
      </h2>
      <div className="space-y-2 grid max-sm:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 lg:grid-cols-4">
        {isCategoriesLoading ? (
          <div className="text-center py-10">Loading...</div>
        ) : paginatedBlogs.length > 0 ? (
          paginatedBlogs.map((blog: Models.Document) => (
            <BlogCard key={blog.$id} blog={blog} textSize={100} />
          ))
        ) : (
          <div className="text-center py-10 text-gray-500">
            No blogs found in this category.
          </div>
        )}
      </div>
      {/* Pagination controls */}
      {totalPages > 1 && (
        <Pagination className="mt-6">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                aria-disabled={page === 1}
                className={page === 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, i) => (
              <PaginationItem key={i + 1}>
                <PaginationLink
                  isActive={page === i + 1}
                  onClick={() => setPage(i + 1)}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                aria-disabled={page === totalPages}
                className={
                  page === totalPages ? "pointer-events-none opacity-50" : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

export default BlogCategoryPage;
