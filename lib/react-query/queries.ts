"use client";

import { useQuery } from "@tanstack/react-query";
import {
  get4MostRecentBlogs,
  getBlog,
  getBlogCategories,
  getComments,
  getFromYesterdaysPredictions,
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
import { getAnalyticsDoc } from "../appwrite/analytic";

export function useCurrentUser() {
  return useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
}

export function useUsers(filters = {}, page = 1, pageSize = 15) {
  return useQuery({
    queryKey: ["users", filters, page, pageSize],
    queryFn: () => getUsers(filters, page, pageSize),
    staleTime: 1000 * 60 * 5,
  });
}

export function useSubscriptions(page = 1, pageSize = 15) {
  return useQuery({
    queryKey: ["subscriptions"],
    queryFn: () => getSubscriptions(page, pageSize),
    staleTime: 1000 * 60 * 10,
  });
}

export function usePredictions(filters = {}, page = 1, pageSize = 15) {
  return useQuery({
    queryKey: ["predictions", filters, page, pageSize],
    queryFn: () => getPredictions(filters, page, pageSize),
    staleTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
}

export function usePredictionFromYesterday() {
  return useQuery({
    queryKey: ["predictions-from-yesterday"],
    queryFn: () => getFromYesterdaysPredictions(),
    staleTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
}

export function useBlogs(filters = {}, page = 1, pageSize = 15) {
  return useQuery({
    queryKey: ["blog"],
    queryFn: () => getBlog(filters, page, pageSize),
    staleTime: 1000 * 60 * 10,
  });
}

export function use4MostRecentBlogs() {
  return useQuery({
    queryKey: ["4-most-recent-blogs"],
    queryFn: get4MostRecentBlogs,
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

export function useComments(page = 1, pageSize = 15) {
  return useQuery({
    queryKey: ["comments", page, pageSize],
    queryFn: () => getComments(page, pageSize),
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

export const useAnalyticsDoc = () =>
  useQuery({
    queryKey: ["analyticsDoc"],
    queryFn: async () => getAnalyticsDoc(),
  });
