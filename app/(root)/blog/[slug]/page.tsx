"use client";

import { useParams } from "next/navigation";
import { format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useAddComment } from "@/lib/react-query/queriesAndMutations";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Comment } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUserContext } from "@/context/AuthContext";
import Link from "next/link";
import BlogHeadingTextWrapper from "@/components/BlogHeadingTextWrapper";
import { useBlogs } from "@/hooks/useBlogs";
import BlogCard from "@/components/BlogCard";
import { notifyNewComment } from "@/lib/appwrite/notificationTriggers";
import { singleBlogBySlug } from "@/lib/react-query/queries";
import { updateCollectionCounts } from "@/lib/appwrite/update";
import { getCollectionCounts } from "@/lib/appwrite/fetch";
import { useQuery } from "@tanstack/react-query";

const BlogPost = () => {
  const { slug } = useParams();
  const [comment, setComment] = useState("");
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const { mutateAsync: addComment, isPending: isAddingComment } =
    useAddComment();
  const { user, isAuthenticated } = useUserContext();
  const {data: oldData} = useQuery({
    queryKey: ["collectionCounts"],
    queryFn: () => getCollectionCounts("comments"),
  });
  const { data: singleBlog, isLoading } = singleBlogBySlug(slug as string);

  const { data: blogs } = useBlogs();

  const handleAddComment = async () => {
    if (!comment.trim()) {
      toast.error("Please enter a comment");
      return;
    }

    if (!isAuthenticated && (!guestName.trim() || !guestEmail.trim())) {
      toast.error("Please provide your name and email");
      return;
    }

    try {
      await addComment({
        blogId: singleBlog?.$id || "",
        content: comment,
        ...(isAuthenticated
          ? {}
          : {
              guestUser: {
                name: guestName,
                email: guestEmail,
              },
            }),
      });
      await notifyNewComment(
        singleBlog?.user?.$id || "",
        isAuthenticated ? user?.name || "User" : guestName,
        singleBlog?.title || "Blog Post"
      );
      if (oldData) {
        await updateCollectionCounts({
          comments: oldData?.counts + 1
        }, oldData?.$id);
      }
      setComment("");
      setGuestName("");
      setGuestEmail("");
      toast.success("Comment added successfully and is pending approval");
    } catch (error) {
      console.error(error);
      toast.error("Failed to add comment");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!singleBlog) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold">Blog post not found</h1>
      </div>
    );
  }

  return (
    <div className="relative container mx-auto py-8 px-2 max-w-4xl">
      <div className="w-full md:w-[65%]">
        <div className="mb-8 px-3">
          <h1 className="text-3xl font-semibold mb-4">{singleBlog.title}</h1>
          <div className="flex items-center gap-4 text-gray-600 mb-6 text-sm">
            <span>
              {format(new Date(singleBlog.publishedAt), "MMMM d, yyyy")}
            </span>
            <span>••</span>
            {singleBlog.blogCategories?.map(
              (
                cat: { $id: string; name: string; slug: string },
                index: number
              ) => (
                <span key={cat.$id}>
                  {index > 0 && <span> • </span>}
                  <Link
                    href={`/blog/category/${cat.slug}`}
                    className="hover:text-blue-500"
                  >
                    {cat.name}
                  </Link>
                </span>
              )
            )}
          </div>
          {singleBlog.featuredImage && (
            <img
              src={singleBlog.featuredImage}
              alt={singleBlog.title}
              className="w-full h-[400px] object-cover rounded-none mb-8"
            />
          )}
        </div>

        <div
          className="prose prose-lg max-w-none mb-12 p-2"
          dangerouslySetInnerHTML={{ __html: singleBlog.content }}
        />

        <div className="border-t pt-8">
          <h2 className="text-2xl font-bold mb-6">Comments</h2>

          <div className="mb-8 space-y-4">
            {!isAuthenticated && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="guestName">Name</Label>
                  <Input
                    id="guestName"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder="Your name"
                    className="rounded-[px]"
                  />
                </div>
                <div>
                  <Label htmlFor="guestEmail">Email</Label>
                  <Input
                    id="guestEmail"
                    type="email"
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    placeholder="Your email"
                    className="rounded=[px]"
                  />
                </div>
              </div>
            )}
            <Textarea
              placeholder="Add a comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="mb-4 rounded-[px]"
            />
            <Button
              onClick={handleAddComment}
              disabled={isAddingComment}
              className="min-sm:px-2 max-sm:w-[80%] sm:w-auto rounded-[px]"
            >
              {isAddingComment ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding Comment...
                </>
              ) : (
                "Post Comment"
              )}
            </Button>
          </div>
        </div>
        <div className="md:hidden flex flex-col gap-4 justify-start">
          <BlogHeadingTextWrapper
            text="Recent Comments"
            bgColor="bg-primary"
            textColor="text-secondary"
          />
          <div className="flex flex-col gap-4">
            <div className="space-y-6">
              {(() => {
                const approvedComments =
                  singleBlog.comments?.filter(
                    (c: Comment) => c.status === "approved"
                  ) || [];
                const latestComments = approvedComments
                  .sort(
                    (a: Comment, b: Comment) =>
                      new Date(b.$createdAt).getTime() -
                      new Date(a.$createdAt).getTime()
                  )
                  .slice(0, 15);

                return latestComments.map((comment: Comment) => (
                  <div key={comment.$id} className="flex gap-4 items-start">
                    <Avatar>
                      <AvatarImage src={comment.user?.imageUrl} />
                      <AvatarFallback className="bg-stone-200">
                        {(
                          comment.user?.name ||
                          comment.guestName ||
                          "U"
                        ).charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold">
                          {comment.user?.name || comment.guestName}
                        </span>
                        <span className="text-sm text-gray-500">
                          {format(new Date(comment.$createdAt), "MMM d, yyyy")}
                        </span>
                      </div>
                      <p className="text-gray-700 max-w-[200px] flex flex-wrap">{comment.content}</p>
                    </div>
                  </div>
                ));
              })()}
              {(!singleBlog.comments ||
                singleBlog.comments.filter(
                  (c: Comment) => c.status === "approved"
                ).length === 0) && (
                <p className="text-gray-500 text-center py-4">
                  No comments yet. Be the first to comment!
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="hidden md:flex absolute top-0 right-0 min-h-full md:w-[30%] mt-8 items-start flex-col gap-8 overflow-y-auto">
        <div className="flex flex-col gap-4 justify-start">
          <BlogHeadingTextWrapper
            text="Related Blogs"
            bgColor="bg-primary"
            textColor="text-secondary"
          />
          <div className="flex flex-col gap-4">
            {blogs
              ?.sort((a, b) => {
                // First sort by matching category
                if (
                  b.blogCategories?.[0]?.name ===
                    singleBlog.blogCategories?.[0]?.name &&
                  b.blogCategories?.[0]?.name !==
                    singleBlog.blogCategories?.[0]?.name
                )
                  return -1;
                if (
                  a.blogCategories?.[0]?.name ===
                    singleBlog.blogCategories?.[0]?.name &&
                  a.blogCategories?.[0]?.name !==
                    singleBlog.blogCategories?.[0]?.name
                )
                  return 1;

                // Then sort by number of comments
                const aComments = a.comments?.filter((c: Comment) => c.status === "approved")?.length || 0;
                const bComments = b.comments?.filter((c: Comment) => c.status === "approved")?.length || 0;
                return bComments - aComments;
              })
              .filter((blog) => blog.$id !== singleBlog.$id)
              .map((blog) => (
                <BlogCard key={blog.$id} blog={blog} textSize={23} />
              ))}
          </div>
        </div>

        <div className="flex flex-col gap-4 justify-start">
          <BlogHeadingTextWrapper
            text="Recent Comments"
            bgColor="bg-primary"
            textColor="text-secondary"
          />
          <div className="flex flex-col gap-4">
            <div className="space-y-6">
              {(() => {
                const approvedComments =
                  singleBlog.comments?.filter(
                    (c: Comment) => c.status === "approved"
                  ) || [];
                const latestComments = approvedComments
                  .sort(
                    (a: Comment, b: Comment) =>
                      new Date(b.$createdAt).getTime() -
                      new Date(a.$createdAt).getTime()
                  )
                  .slice(0, 7);

                return latestComments.map((comment: Comment) => (
                  <div key={comment.$id} className="flex gap-4 items-start">
                    <Avatar>
                      <AvatarImage src={comment.user?.imageUrl} />
                      <AvatarFallback className="bg-stone-200">
                        {(
                          comment.user?.name ||
                          comment.guestName ||
                          "U"
                        ).charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold">
                          {comment.user?.name || comment.guestName}
                        </span>
                        <span className="text-sm text-gray-500">
                          {format(new Date(comment.$createdAt), "MMM d, yyyy")}
                        </span>
                      </div>
                      <p className="text-gray-700 max-w-[200px] flex flex-wrap">{comment.content}</p>
                    </div>
                  </div>
                ));
              })()}
              {(!singleBlog.comments ||
                singleBlog.comments.filter(
                  (c: Comment) => c.status === "approved"
                ).length === 0) && (
                <p className="text-gray-500 text-center py-4">
                  No comments yet. Be the first to comment!
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPost;
