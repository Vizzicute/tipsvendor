"use client";

import { getSingleSeoPage } from "@/lib/appwrite/fetch";
import { notFound, useParams } from "next/navigation";
import EditPageForm from "../EditPageForm";
import { useQuery } from "@tanstack/react-query";

export default function Page() {
  const { pageId } = useParams();

  if (typeof pageId !== "string") {
    notFound();
  }

  const { data: seoPage, isLoading } = useQuery({
    queryKey: ["seo"],
    queryFn: async () => getSingleSeoPage(pageId),
  });

  if (!seoPage) notFound();
  return (
    <div className="space-y-2">
      <div className="w-full flex items-center justify-start">
        <h1 className="text-2xl font-bold tracking-tight">Edit Page Content</h1>
      </div>

      <EditPageForm page={seoPage} />
    </div>
  );
}
