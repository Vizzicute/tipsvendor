import { getCached } from "@/lib/appwrite/cache";
import { getSingleBlogBySlug } from "@/lib/appwrite/fetch";
import { Metadata } from "next";
import React from "react";

export async function generateMetadata(context: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const slug = (await context.params).slug;
  try {
    const seopage = await getCached("seoPage-1", () =>
      getSingleBlogBySlug(slug)
    );

    return {
      title:
        seopage?.title ||
        "Tipsvendor - Top Football Tips and Prediction Website",
      description:
        seopage?.title || "Get the best football tips and predictions",
      openGraph: {
        title:
          seopage?.title ||
          "Tipsvendor - Top Football Tips and Prediction Website",
        description:
          seopage?.title || "Get the best football tips and predictions",
        images: seopage.featuredImage,
      },
      twitter: {
        description:
          seopage?.title || "Get the best football tips and predictions",
        images: seopage.featuredImage,
      },
    };
  } catch (error) {
    console.error("Error fetching SEO page:", error);
    return {
      title: "Tipsvendor - Top Football Tips and Prediction Website",
      description: "Get the best football tips and predictions",
      keywords: ["football tips", "predictions", "sports betting"],
      openGraph: {
        title: "Tipsvendor - Top Football Tips and Prediction Website",
        description: "Get the best football tips and predictions",
        images: "/logo.jpg",
      },
    };
  }
}

const layout = ({ children }: { children: React.ReactNode }) => {
  return <div>{children}</div>;
};

export default layout;
