"use client";

import { useParams } from "next/navigation";
import EditPageForm from "../EditPageForm";
import { singleSeoPage } from "@/lib/react-query/queries";

export default function Page() {
  const { pageId } = useParams();


  const { data: seoPage, isLoading, isError } = singleSeoPage(pageId as string);

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
