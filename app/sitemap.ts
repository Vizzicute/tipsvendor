import { getBlog, getBlogCategories, getSeoPages } from "@/lib/appwrite/fetch";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const blogs = await getBlog();
  const blogCategories = await getBlogCategories();
  const seoPages = await getSeoPages();

  const filteredPages = seoPages?.filter(
    (page) =>
      page.url !== "" ||
      page.url !== "privacy" ||
      page.url !== "info" ||
      page.url !== "about"
  );
  const homepage = seoPages?.find((page) => page.url === "");

  return [
    {
      url: `${process.env.NEXT_PUBLIC_APP_URL}`,
      priority: 1,
      lastModified: new Date(homepage?.$updatedAt || ""),
    },
    ...(filteredPages?.map((page) => ({
      url: `${process.env.NEXT_PUBLIC_APP_URL}/${page.url}`,
      priority: 0.6,
      lastModified: new Date(page.$updatedAt),
    })) || []),
    ...(blogs?.map((blog) => ({
      url: `${process.env.NEXT_PUBLIC_APP_URL}/blog/${blog.slug}`,
      priority: 0.5,
      lastModified: new Date(blog.$updatedAt),
    })) || []),
    ...(blogCategories?.map((category) => ({
      url: `${process.env.NEXT_PUBLIC_APP_URL}/blog/category/${category.slug}`,
      priority: 0.5,
      lastModified: new Date(category.$updatedAt),
    })) || []),
  ];
}
