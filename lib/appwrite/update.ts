import { account, appwriteConfig, databases } from "./config";

export type editPredictionType = {
  datetime: string;
  league: string;
  hometeam: string;
  awayteam: string;
  tip: string;
  odd: number;
  over?: string;
  chance?: string;
  htft?: string;
  either?: string;
  isBtts?: boolean;
  isBanker: boolean;
  subscriptionType: string;
  sportType: string;
};

export type addResultType = {
  homescore: string;
  awayscore: string;
  status: string;
};

export type editUserType = {
  name: string;
  email: string;
  country: string;
  role?: string;
  address?: string;
  phone?: string;
  imageId?: string;
  imageUrl?: string;
}

export type editStaffType = {
  name: string;
  email: string;
  country: string;
  role: string;
};

export type editBlogType = {
  title: string;
  content: string;
  slug: string;
  status: string;
  blogCategories: string[];
  publishedAt: string;
  featuredImage: string | File;
}

export type editSeoPageType ={
  title: string;
  description: string;
  keywords: string[];
  url: string;
  h1tag: string;
  content: string;
}

export type editSubscriptionType = {
  subscriptionType: string;
  duration: string;
  user: string;
}

export async function editPrediction(
  prediction: editPredictionType,
  gameId: string
) {
  try {
    const newPrediction = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.predictionCollectionId,
      gameId,
      {
        ...prediction,
        updatedAt: new Date(),
      }
    );

    return newPrediction;
  } catch (error) {
    console.log(error);
  }
}

export async function addResult(prediction: addResultType, gameId: string) {
  try {
    const newPrediction = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.predictionCollectionId,
      gameId,
      prediction
    );

    return newPrediction;
  } catch (error) {
    console.log(error);
  }
}

export async function editUser(user: editUserType, userId: string) {
  try {
    const newUser = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      userId,
      user
    );

    return newUser;
  } catch (error) {
    console.log(error);
  }
}

export async function editStaff(staff: editStaffType, accountId: string) {
  try {
    const newPrediction = await databases.updateDocument(
      `${appwriteConfig.databaseId}`,
      `${appwriteConfig.userCollectionId}`,
      `${accountId}`,
      staff
    );

    return newPrediction;
  } catch (error) {
    console.log(error);
  }
}

export async function editBlog(blog: editBlogType, blogId: string, fileId: string) {
  try {
    const updateData = {
      title: blog.title,
      content: blog.content,
      slug: blog.slug,
      status: blog.status,
      blogCategories: blog.blogCategories,
      publishedAt: blog.publishedAt,
      featuredImage: blog.featuredImage,
      featuredImageId: fileId,
      updatedAt: new Date(),
    };

    const newBlog = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.blogCollectionId,
      blogId,
      updateData
    );

    if (!newBlog) {
      throw new Error("Failed to update blog");
    }

    return newBlog;
  } catch (error) {
    console.error("Error updating blog:", error);
    throw error;
  }
}

export async function updateBlogStatus(status: string, blogId: string, publishedAt: Date) {
  try {
    const newBlog = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.blogCollectionId,
      blogId,
      {
        status: status,
        publishedAt: publishedAt,
      }
    );

    return newBlog;
  } catch (error) {
    console.log(error);
  }
}

export async function editSeoPage(blog: editSeoPageType, pageId: string) {
  try {
    const newBlog = await databases.updateDocument(
      `${`${appwriteConfig.databaseId}`}`,
      `${appwriteConfig.seoCollectionId}`,
      `${pageId}`,
      {
        ...blog,
        updatedAt: new Date(),
      }
    );

    return newBlog;
  } catch (error) {
    console.log(error);
  }
}

export async function editSubscription(subscription: editSubscriptionType, subscriptionId: string) {
  try {
    const newSubscription = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.subscriptionId,
      subscriptionId,
      {
        subscription,
        updatedAt: new Date(),
      }
    );

    return newSubscription;
  } catch (error) {
    console.log(error);
  }
}

export async function updateSubscriptionStatus(status: string, subscriptionId: string) {
  try {
    const newSubscription = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.subscriptionId,
      subscriptionId,
      {
        status: status,
      }
    );

    return newSubscription;
  } catch (error) {
    console.log(error);
  }
}

export async function updateCommentStatus(status: string, commentId: string) {
  try {
    const newComment = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.commentCollectionId,
      commentId,
      {
        status: status,
      }
    );

    return newComment;
  } catch (error) {
    console.log(error);
  }
}

export async function verifyUser(userId: string) {
  try {
    const user = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      userId,
      {
        isVerified: true,
      }
    );

    return user;
  } catch (error) {
    console.log(error);
  }
}

export async function resetUserPassword(password: string, oldPassword: string) {
  try {
    const user = await account.updatePassword(password, oldPassword);
    return user;
  } catch (error) {
    console.log(error);
  }
}