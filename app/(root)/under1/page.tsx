import DynamicContent from "@/components/DynamicContent";
import { getCached } from "@/lib/appwrite/cache";
import { getSingleSeoPageByUrl } from "@/lib/appwrite/fetch";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  try {
    const seopage = await getCached("seoPage-1", () => getSingleSeoPageByUrl("under1"));
    
    return {
      title: seopage?.title || "Tipsvendor - Top Football Tips and Prediction Website",
      description: seopage?.description || "Get the best football tips and predictions",
      keywords: seopage?.keywords || ["football tips", "predictions", "sports betting"],
      openGraph: {
        title: seopage?.title || "Tipsvendor - Top Football Tips and Prediction Website",
        description: seopage?.description || "Get the best football tips and predictions",
        images: "/logo.jpg",
      },
      twitter: {
        description: seopage?.description || "Get the best football tips and predictions",
        images: "/logo.jpg",
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

export default async function Page() {
  return <DynamicContent name="over" title="Under 1.5 Predictions" totalGoals="UN1.5" />;
}
