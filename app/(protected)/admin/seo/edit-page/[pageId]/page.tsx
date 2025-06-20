"use client";

import { getSingleSeoPage } from "@/lib/appwrite/fetch";
import { useParams } from "next/navigation";
import EditPageForm from "../EditPageForm";
import { useQuery } from "@tanstack/react-query";

export default function Page() {
  const { pageId } = useParams();


  const { data: seoPage, isLoading, isError } = useQuery({
    queryKey: ["seo"],
    queryFn: async () => getSingleSeoPage(pageId as string),
    enabled: !!pageId,
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError || !seoPage) return <div>SEO Page not found</div>;
  return (
    <div className="space-y-2">
      <div className="w-full flex items-center justify-start">
        <h1 className="text-2xl font-bold tracking-tight">Edit Page Content</h1>
      </div>

      <EditPageForm page={seoPage} />
    </div>
  );
}
