"use client";

import { useQuery } from "@tanstack/react-query";
import {
  getBlog,
  getBlogCategories,
  getComments,
  getPredictions,
  getSeoPages,
  getSingleBlog,
  getSingleBlogBySlug,
  getSingleSeoPage,
  getSingleSeoPageByUrl,
  getSubscriptions,
  getUsers,
} from "../appwrite/fetch";
import { getCurrentUser } from "../appwrite/api";
import {
  getGoogleTagSettings,
  getSocialSettings,
  getWalletSettings,
} from "../appwrite/appConfig";
import { verifyAccount } from "../utils/verification";
import { getUserNotifications } from "../appwrite/notifications";

export function useCurrentUser() {
  return useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
    staleTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: false,
  });
}

export function useUsers() {
  return useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
    staleTime: 1000 * 60 * 5,
  });
}

export function useSubscriptions() {
  return useQuery({
    queryKey: ["subscriptions"],
    queryFn: getSubscriptions,
    staleTime: 1000 * 60 * 10,
  });
}

export function usePredictions() {
  return useQuery({
    queryKey: ["predictions"],
    queryFn: getPredictions,
    staleTime: 1000 * 60 * 10,
  });
}

export function useBlogs() {
  return useQuery({
    queryKey: ["blog"],
    queryFn: getBlog,
    staleTime: 1000 * 60 * 10,
  });
}

export function useBlogCategories() {
  return useQuery({
    queryKey: ["blogCategories"],
    queryFn: getBlogCategories,
    staleTime: 1000 * 60 * 10,
  });
}

export function useComments() {
  return useQuery({
    queryKey: ["comments"],
    queryFn: getComments,
    staleTime: 1000 * 60 * 10,
  });
}

export function useSeoPages() {
  return useQuery({
    queryKey: ["seo-pages"],
    queryFn: getSeoPages,
    staleTime: 1000 * 60 * 10,
  });
}

export function useSettings() {
  return useQuery({
    queryKey: ["wallet-settings"],
    queryFn: getWalletSettings,
    staleTime: 1000 * 60 * 10,
  });
}

export function useGoogleTags() {
  return useQuery({
    queryKey: ["google-settings"],
    queryFn: getGoogleTagSettings,
    staleTime: 1000 * 60 * 10,
  });
}

export function useSocials() {
  return useQuery({
    queryKey: ["socials-settings"],
    queryFn: getSocialSettings,
    staleTime: 1000 * 60 * 10,
  });
}

export const singleBlog = (blogId: string) =>
  useQuery({
    queryKey: ["blog", blogId],
    queryFn: async () => getSingleBlog(blogId),
    enabled: !!blogId,
    staleTime: 1000 * 60 * 5,
  });

export const singleBlogBySlug = (slug: string) =>
  useQuery({
    queryKey: ["blog", slug],
    queryFn: async () => getSingleBlogBySlug(slug),
    enabled: !!slug,
    staleTime: 1000 * 60 * 5,
  });

export const singleSeoPage = (pageId: string) =>
  useQuery({
    queryKey: ["seo", pageId],
    queryFn: async () => getSingleSeoPage(pageId),
    enabled: !!pageId,
    staleTime: 1000 * 60 * 5,
  });

export const singleSeoPageByUrl = (url: string) =>
  useQuery({
    queryKey: ["seo", url],
    queryFn: async () => getSingleSeoPageByUrl(url),
    staleTime: 1000 * 60 * 30,
  });

export const verifyUser = (userId: string) =>
  useQuery({
    queryKey: ["verifyUser", userId],
    queryFn: async () => verifyAccount(userId),
    enabled: !!userId,
  });

export const userNotifications = (userId: string) =>
  useQuery({
    queryKey: ["notifications", userId],
    queryFn: async () => getUserNotifications(userId),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
  });
