import { useQuery } from "@tanstack/react-query";
import { getBlog } from "@/lib/appwrite/fetch";
import { Models } from "node-appwrite";
export interface Blog {
  $id: string;
  title: string;
  content: string;
  status: "drafted" | "scheduled" | "published";
  $createdAt: string;
  $updatedAt: string;
}

export function useBlogs() {
  return useQuery<Models.Document[]>({
    queryKey: ["documents"],
    queryFn: async () => {
      const response = await getBlog();
      return response;
    },
  });
} 