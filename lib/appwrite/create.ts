import { ID } from "appwrite";
import { appwriteConfig, avatars, databases1 } from "./config";

export type addPredictionType = {
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

export type addUserType = {
  name: string;
  email: string;
  country: string;
  role: string;
};

export type addBlogType = {
  title: string;
  content: string;
  slug: string;
  status: string;
  blogCategories: string[];
  publishedAt: string;
  featuredImage: string | File;
}

export type addBlogCategoryType = {
  name: string;
  slug: string;
}

export type addSubscriptionType = {
  subscriptionType: string;
  duration: string;
  user: string;
}

export type AddCommentType = {
  blogId: string;
  content: string;
  guestUser?: any;
};

export async function addPrediction(prediction: addPredictionType) {
  try {
    const user = localStorage.getItem('authUser');
    if(!user) throw Error;
    const parsedUser = JSON.parse(user);

    if (!user) throw Error;

    const newPrediction = await databases1.createDocument(
      appwriteConfig.databaseId1,
      appwriteConfig.predictionCollectionId,
      ID.unique(),
      {
        ...prediction,
        user: parsedUser.$id,
        gameId: ID.unique(),
        createdAt: new Date(),
      }
    );

    return newPrediction;
  } catch (error) {
    console.log(error);
  }
}

export async function addUser(user: addUserType) {
  const avatarUrl = avatars.getInitials(user.name).toString();
  try {
    const newUser = await databases1.createDocument(
      appwriteConfig.databaseId1,
      appwriteConfig.userCollectionId,
      ID.unique(),
      {
        ...user,
        accountId: ID.unique(),
        imageUrl: avatarUrl,
      },
    );

    return newUser;
  } catch (error) {
    console.log(error);
  }
}

export async function addBlog(blog: addBlogType, fileId: string) {
  try {
    const user = localStorage.getItem('authUser');
    if(!user) throw Error;
    const parsedUser = JSON.parse(user);


    const newBlog = await databases1.createDocument(
      appwriteConfig.databaseId1,
      `${appwriteConfig.blogCollectionId}`,
      ID.unique(),
      {
        ...blog,
        user: parsedUser.$id,
        featuredImageId: fileId,
        createdAt: new Date(),
      }
    );

    return newBlog;
  } catch (error) {
    console.log(error);
  }
}

export async function addBlogCategory(blogCategory: addBlogCategoryType) {
  try {
    const newBlogCategory = await databases1.createDocument(
      appwriteConfig.databaseId1,
      appwriteConfig.blogCategoriesCollectionId,
      ID.unique(),
      blogCategory,
    );

    return newBlogCategory;
  } catch (error) {
    console.log(error);
  }
}

export async function addSubscription(subscription: addSubscriptionType) {
  try {
    const newSubscription = await databases1.createDocument(
      appwriteConfig.databaseId1,
      appwriteConfig.subscriptionId,
      ID.unique(),
      subscription,
    );

    return newSubscription;
  } catch (error) {
    console.log(error);
  }
}

export const createComment = async ({ blogId, content, guestUser }: AddCommentType) => {
  try {
    let commentData: any = {
      content,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    try {
      // Try to get the current user
      const user = localStorage.getItem('authUser');
      if(!user) throw Error;
      const parsedUser = JSON.parse(user);
      if (parsedUser) {
        commentData.user = parsedUser.$id;
      } else if (guestUser) {
        // If no logged-in user, use guest user data
        commentData.guestName = guestUser.name;
        commentData.guestEmail = guestUser.email;
      } else {
        throw new Error("No user data provided");
      }
    } catch (error) {
      // If getCurrentUser fails and no guest user provided
      if (!guestUser) {
        throw new Error("No user data provided");
      }
      commentData.guestName = guestUser.name;
      commentData.guestEmail = guestUser.email;
    }

    // Add blog relationship
    commentData.blog = blogId;

    const comment = await databases1.createDocument(
      appwriteConfig.databaseId1,
      appwriteConfig.commentCollectionId,
      ID.unique(),
      commentData
    );

    return comment;
  } catch (error) {
    console.error("Error creating comment:", error);
    throw error;
  }
};


