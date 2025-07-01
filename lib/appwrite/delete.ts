import { appwriteConfig, databases1 } from "./config";

export async function deletePrediction(
  gameId: string
) {
  try {
    const newPrediction = await databases1.deleteDocument(
      `${appwriteConfig.databaseId1}`,
      `${appwriteConfig.predictionCollectionId}`,
      `${gameId}`
    );

    return newPrediction;
  } catch (error) {
    console.log(error);
  }
}

export async function deleteUser(
  accountId: string
) {
  try {
    const newUser = await databases1.deleteDocument(
      `${appwriteConfig.databaseId1}`,
      `${appwriteConfig.userCollectionId}`,
      `${accountId}`
    );

    return newUser;
  } catch (error) {
    console.log(error);
  }
}

export async function deleteBlog(
  blogId: string
) {
  try {
    const newBlog = await databases1.deleteDocument(
      `${appwriteConfig.databaseId1}`,
      `${appwriteConfig.blogCollectionId}`,
      `${blogId}`
    );

    return newBlog;
  } catch (error) {
    console.log(error);
  }
}

export async function deleteBlogCategory(
  blogCategoryId: string
) {
  try {
    const newBlog = await databases1.deleteDocument(
      `${appwriteConfig.databaseId1}`,
      `${appwriteConfig.blogCategoriesCollectionId}`,
      `${blogCategoryId}`
    );

    return newBlog;
  } catch (error) {
    console.log(error);
  }
}

export async function deleteSubscription(
  subscriptionId: string
) {
  try {
    const newSubscription = await databases1.deleteDocument(
      appwriteConfig.databaseId1,
      appwriteConfig.subscriptionId,
      subscriptionId
    );

    return newSubscription;
  } catch (error) { 
    console.log(error);
  }
}

export async function deleteComment(
  commentId: string
) {
  try {
    const newComment = await databases1.deleteDocument(
      `${appwriteConfig.databaseId1}`,
      `${appwriteConfig.commentCollectionId}`,
      `${commentId}`
    );

    return newComment;
  } catch (error) {
    console.log(error);
  }
}


