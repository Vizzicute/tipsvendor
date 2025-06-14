import { cn } from "@/lib/utils";
import BlogHeadingTextWrapper from "./BlogHeadingTextWrapper";
import { Models } from "appwrite";
import { truncate } from "@/lib/utils";
import { format } from "date-fns";
import BlogCard from "./BlogCard";
import Link from "next/link";

interface BlogsByCategoryProps {
  blogCategories: Models.Document[];
  loading: boolean;
  className?: string;
  blogCategoryName: string;
}

const BlogsByCategory = ({
  blogCategories,
  loading,
  className,
  blogCategoryName,
}: BlogsByCategoryProps) => {
  const blogCategory = blogCategories.find(
    (category) => category.name === blogCategoryName
  );

  const publishedBlog = blogCategory?.blog?.filter(
    (blog: Models.Document) => blog.status === "published"
  );

  const mostRecentBlog = publishedBlog?.sort(
    (a: Models.Document, b: Models.Document) =>
      new Date(b.$createdAt).getTime() - new Date(a.$createdAt).getTime()
  )[0];
  const secondMostRecentBlog = publishedBlog?.sort(
    (a: Models.Document, b: Models.Document) =>
      new Date(b.$createdAt).getTime() - new Date(a.$createdAt).getTime()
  )[1];
  const thirdMostRecentBlog = publishedBlog?.sort(
    (a: Models.Document, b: Models.Document) =>
      new Date(b.$createdAt).getTime() - new Date(a.$createdAt).getTime()
  )[2];
  const fourthMostRecentBlog = publishedBlog?.sort(
    (a: Models.Document, b: Models.Document) =>
      new Date(b.$createdAt).getTime() - new Date(a.$createdAt).getTime()
  )[3];
  const fifthMostRecentBlog = publishedBlog?.sort(
    (a: Models.Document, b: Models.Document) =>
      new Date(b.$createdAt).getTime() - new Date(a.$createdAt).getTime()
  )[4];

  const contentText = mostRecentBlog?.content.replace(/<[^>]*>?/g, "");

  return (
    <div className={cn("w-full flex flex-col gap-4", className)}>
      <Link className="hover:underline" href={process.env.NEXT_PUBLIC_APP_URL + "/blog/category/" + blogCategoryName}><BlogHeadingTextWrapper
        text={blogCategory?.name}
        bgColor="bg-primary"
        textColor="text-secondary"
      /></Link>
      <div className="w-full flex flex-row gap-4">
        <div className="w-1/2 flex flex-col gap-4">
          <img
            src={mostRecentBlog?.featuredImage}
            alt={mostRecentBlog?.title}
            className="w-full h-1/2 object-cover"
          />
          <div className="w-full flex flex-col gap-4">
            <h1 className="text-xl font-semibold">{truncate(mostRecentBlog?.title, 40)}</h1>
            <span className="text-[10px] text-gray-500">
              {process.env.NEXT_PUBLIC_APP_SHORT_TITLE} ••{" "}
              {mostRecentBlog?.$createdAt
                ? format(new Date(mostRecentBlog.$createdAt), "MMMM d, yyyy")
                : format(new Date(), "MMMM d, yyyy")}
            </span>
            <p className="text-[12px] text-gray-500">
              {truncate(contentText, 100)}
            </p>
          </div>
        </div>
        <div className="w-1/2 flex flex-col gap-4">
          {[
            secondMostRecentBlog,
            thirdMostRecentBlog,
            fourthMostRecentBlog,
            fifthMostRecentBlog,
          ]
            .filter((blog): blog is Models.Document => blog !== undefined)
            .map((blog) => (
              <BlogCard key={blog.$id} blog={blog} textSize={23} />
            ))}
        </div>
      </div>
    </div>
  );
};

export default BlogsByCategory;
