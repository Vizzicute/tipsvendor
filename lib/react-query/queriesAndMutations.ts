import { INewUser } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createUserAccount,
  getCurrentUser,
  googleAuth,
  signInAccount,
  signOutAccount,
  signOutAllAccount,
} from "../appwrite/api";
import {
  addBlog,
  addBlogCategory,
  addBlogCategoryType,
  addBlogType,
  addPrediction,
  addPredictionType,
  addSubscription,
  addSubscriptionType,
  addUser,
  addUserType,
  createComment,
} from "../appwrite/create";
import {
  addResult,
  addResultType,
  editBlog,
  editBlogCategory,
  editBlogCategoryType,
  editBlogType,
  editPrediction,
  editPredictionType,
  editSeoPage,
  editSeoPageType,
  editStaff,
  editStaffType,
  editSubscription,
  editSubscriptionType,
  editUser,
  editUserType,
  updateBlogStatus,
} from "../appwrite/update";
import { deleteBlog, deleteBlogCategory, deleteComment, deletePrediction, deleteSubscription, deleteUser } from "../appwrite/delete";

export const useCreateUserAccount = () => {
  return useMutation({
    mutationFn: (user: INewUser) => createUserAccount(user),
  });
};

export const useAddPrediction = () => {
  return useMutation({
    mutationFn: (prediction: addPredictionType) => addPrediction(prediction),
  });
};

export const useAddBlog = () => {
  return useMutation({
    mutationFn: ({ blog, fileId }: { blog: addBlogType; fileId: string }) =>
      addBlog(blog, fileId),
  });
};

export const useAddBlogCategory = () => {
  return useMutation({
    mutationFn: (category: addBlogCategoryType) => addBlogCategory(category),
  });
};

export const useAddUser = () => {
  return useMutation({
    mutationFn: (user: addUserType) => addUser(user),
  });
};

export const useAddSubscription = () => {
  return useMutation({
    mutationFn: (subscription: addSubscriptionType) => addSubscription(subscription),
  });
};

export const useEditPrediction = () => {
  return useMutation({
    mutationFn: ({
      prediction,
      gameId,
    }: {
      prediction: editPredictionType;
      gameId: string;
    }) => editPrediction(prediction, gameId),
  });
};

export const useAddComment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createComment,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["blog", data.blogId],
      });
    },
  });
};

export const useEditUser = () => {
  return useMutation({
    mutationFn: ({ user, userId }: { user: editUserType; userId: string }) => editUser(user, userId),
  });
};

export const useEditStaff = () => {
  return useMutation({
    mutationFn: ({
      staff,
      accountId,
    }: {
      staff: editStaffType;
      accountId: string;
    }) => editStaff(staff, accountId),
  });
};

export const useEditBlog = () => {
  return useMutation({
    mutationFn: ({
      blog,
      blogId,
      fileId,
    }: {
      blog: editBlogType;
      blogId: string;
      fileId: string;
    }) => editBlog(blog, blogId, fileId),
  });
};

export const useEditBlogCategory = () => {
  return useMutation({
    mutationFn: ({
      category,
      blogCategoryId
    }: {
      category: editBlogCategoryType;
      blogCategoryId: string;
    }) => editBlogCategory(category, blogCategoryId),
  });
};

export const useEditPage = () => {
  return useMutation({
    mutationFn: ({
      page,
      pageId
    }: {
      page: editSeoPageType;
      pageId: string;
    }) => editSeoPage(page, pageId),
  });
};

export const useEditSubscription = () => {
  return useMutation({
    mutationFn: ({ subscription, subscriptionId }: { subscription: editSubscriptionType; subscriptionId: string }) => editSubscription(subscription, subscriptionId),
  });
};

export const useUpdateBlogStatus = () => {
  return useMutation({
    mutationFn: ({
      status,
      blogId,
      publishedAt
    }: {
      status: string;
      blogId: string;
      publishedAt: Date;
    }) => updateBlogStatus(status, blogId, publishedAt),
  });
};

export const useAddResult = () => {
  return useMutation({
    mutationFn: ({
      prediction,
      gameId,
    }: {
      prediction: addResultType;
      gameId: string;
    }) => addResult(prediction, gameId),
  });
};

export const useDeletePrediction = () => {
  return useMutation({
    mutationFn: (gameId: string) => deletePrediction(gameId),
  });
};

export const useDeleteSubscription = () => {
  return useMutation({
    mutationFn: (subscriptionId: string) => deleteSubscription(subscriptionId),
  });
};

export const useDeleteBlog = () => {
  return useMutation({
    mutationFn: (blogId: string) => deleteBlog(blogId),
  });
};

export const useDeleteBlogCategory = () => {
  return useMutation({
    mutationFn: (blogCategoryId: string) => deleteBlogCategory(blogCategoryId),
  });
};

export const useDeleteUser = () => {
  return useMutation({
    mutationFn: (accountId: string) => deleteUser(accountId),
  });
};

export const useDeleteComment = () => {
  return useMutation({
    mutationFn: (commentId: string) => deleteComment(commentId),
  });
};

export const useSignInAccount = () => {
  return useMutation({
    mutationFn: (user: { email: string; password: string }) =>
      signInAccount(user),
  });
};

export const useSignOutAccount = () => {
  return useMutation({
    mutationFn: signOutAccount,
  });
};

export const useSignOutAllAccount = () => {
  return useMutation({
    mutationFn: signOutAllAccount,
  });
};

export const useSession = () => {
  return useMutation({
    mutationFn: getCurrentUser,
  });
};

export const useGoogleAuth = () => {
  return useMutation({
    mutationFn: googleAuth,
  });
};
