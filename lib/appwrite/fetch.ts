import { Query } from "appwrite";
import { appwriteConfig, databases1, databases2 } from "./config";

export async function getPredictions(filters = {}, page = 1, pageSize = 15) {
  type PredictionFilters = {
    tip?: string;
    isBtts?: boolean;
    chance?: string;
    status?: string;
    subscriptionType?: string;
    startDate?: string;
    endDate?: string;
    // ...add more as needed
  };

  const queries = [
    Query.limit(pageSize),
    Query.offset((page - 1) * pageSize),
    Query.orderDesc("datetime")
  ];

  const { tip, isBtts, chance, status, subscriptionType, startDate, endDate } = filters as PredictionFilters;

  if (tip) queries.push(Query.equal("tip", tip));
  if (isBtts !== undefined) queries.push(Query.equal("isBtts", isBtts));
  if (chance) queries.push(Query.equal("chance", chance));
  if (status) queries.push(Query.equal("status", status));
  if (subscriptionType) queries.push(Query.equal("subscriptionType", subscriptionType));
  if (startDate) queries.push(Query.greaterThanEqual("datetime", startDate));
  if (endDate) queries.push(Query.lessThanEqual("datetime", endDate));
  // ...add more as needed

  const predictions = await databases1.listDocuments(
    `${appwriteConfig.databaseId1}`,
    `${appwriteConfig.predictionCollectionId}`,
    queries
  );

  if (!predictions) throw Error;

  return predictions.documents;
}

export async function getInvestmentPredictions() {
  const last7Days = new Date();
  last7Days.setDate(last7Days.getDate() - 7);
  
  const predictions = await databases1.listDocuments(
    `${appwriteConfig.databaseId1}`,
    `${appwriteConfig.predictionCollectionId}`,
    [Query.equal("subscriptionType", "investment"), Query.greaterThanEqual("datetime", last7Days.toISOString())]
  );

  if (!predictions) throw Error;

  return predictions.documents;
}

export async function getFromYesterdaysPredictions(filters = {}) {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  type PredictionFilters = {
    tip?: string;
    isBtts?: boolean;
    chance?: string;
    isBanker?: boolean;
    either?: string;
    htft?: string;
    overs?: string;
    // ...add more as needed
  };

  const queries = [Query.limit(100), Query.greaterThanEqual("datetime", yesterday.toISOString())];

  const { tip, isBtts, chance, isBanker, either, htft, overs } = filters as PredictionFilters;

  if (tip) queries.push(Query.equal("tip", tip));
  if (isBtts !== undefined) queries.push(Query.equal("isBtts", isBtts));
  if (chance) queries.push(Query.equal("chance", chance));
  if (isBanker !== undefined) queries.push(Query.equal("isBanker", isBanker));
  if (either) queries.push(Query.equal("either", either));
  if (htft) queries.push(Query.equal("htft", htft));
  if (overs) queries.push(Query.equal("overs", overs));
  // ...add more as needed

  const predictions = await databases1.listDocuments(
    `${appwriteConfig.databaseId1}`,
    `${appwriteConfig.predictionCollectionId}`,
    queries
  );

  if (!predictions) throw Error;

  return predictions.documents;
}

export async function getUsers(filters = {}, page = 1, pageSize = 15) {
  type UserFilters = {
    name?: string;
    email?: string;
    role?: string;
  };

  const queries = [
    Query.limit(pageSize),
    Query.offset((page - 1) * pageSize),
    Query.orderDesc("$createdAt")
  ];

  const { name, email, role } = filters as UserFilters;

  if (name) queries.push(Query.contains("name", name));
  if (email) queries.push(Query.equal("email", email));
  if (role) queries.push(Query.equal("role", role));

  const users = await databases1.listDocuments(
    `${appwriteConfig.databaseId1}`,
    `${appwriteConfig.userCollectionId}`,
    queries
  );
  if (!users) throw Error;
  return users.documents;
}

export async function getSingleUserByEmail(email: string) {
  const user = await databases1.listDocuments(
    `${appwriteConfig.databaseId1}`,
    `${appwriteConfig.userCollectionId}`,
    [Query.equal("email", email)]
  );

  if (!user) throw Error;

  return user.documents[0];
}

export async function getSingleUserByUserId(userId: string) {
  const user = await databases1.listDocuments(
    `${appwriteConfig.databaseId1}`,
    `${appwriteConfig.userCollectionId}`,
    [Query.equal("$id", userId)]
  );

  if (!user) throw Error;

  return user.documents[0];
}

export async function getAdmin() {
  const admin = await databases1.listDocuments(
    `${appwriteConfig.databaseId1}`,
    `${appwriteConfig.userCollectionId}`,
    [Query.equal("role", "admin")]
  );

  if (!admin) throw Error;

  return admin.documents[0];
}


type BlogFilters = {
  title?: string;
  category?: string;
  publishedAt?: string;
};

export async function getBlog(filters = {}, page = 1, pageSize = 15) {
  const queries = [
    Query.limit(pageSize),
    Query.offset((page - 1) * pageSize),
    Query.orderDesc("publishedAt")
  ];

  const { title, category, publishedAt } = filters as BlogFilters;

  if (title) queries.push(Query.contains("title", title));
  if (category) queries.push(Query.equal("category", category));
  if (publishedAt) queries.push(Query.equal("publishedAt", publishedAt));

  const blogs = await databases1.listDocuments(
    `${appwriteConfig.databaseId1}`,
    `${appwriteConfig.blogCollectionId}`,
    queries
  );

  if (!blogs) throw Error;

  return blogs.documents;
}

export async function get4MostRecentBlogs() {
  const blogs = await databases1.listDocuments(
    `${appwriteConfig.databaseId1}`,
    `${appwriteConfig.blogCollectionId}`,
    [Query.limit(4), Query.orderDesc("publishedAt")]
  );

  if (!blogs) throw Error;

  return blogs.documents;
}

export async function getSingleBlog(blogId: string) {
  try {
    const blog = await databases1.getDocument(
      appwriteConfig.databaseId1,
      appwriteConfig.blogCollectionId,
      blogId
    );

    if (!blog) throw new Error("Blog not found");

    return blog;
  } catch (error) {
    console.error("Error fetching blog:", error);
    throw error;
  }
}

export async function getSingleBlogBySlug(slug: string) {
  const blog = await databases1.listDocuments(
    appwriteConfig.databaseId1,
    appwriteConfig.blogCollectionId,
    [Query.equal("slug", slug)]
  );

  if (!blog) throw Error;

  return blog.documents[0];
}

export async function getBlogCategories() {
  const blogs = await databases1.listDocuments(
    `${appwriteConfig.databaseId1}`,
    `${appwriteConfig.blogCategoriesCollectionId}`
  );

  if (!blogs) throw Error;

  return blogs.documents;
}

export async function getSeoPages() {
  const seo = await databases2.listDocuments(
    appwriteConfig.databaseId2,
    appwriteConfig.seoCollectionId
  );

  if (!seo) throw Error;

  return seo.documents;
}

export async function getSingleSeoPage(pageId: string) {
  const seoPage = await databases2.listDocuments(
    `${appwriteConfig.databaseId2}`,
    `${appwriteConfig.seoCollectionId}`,
    [Query.equal("$id", pageId)]
  );

  if (!seoPage) throw Error;

  return seoPage.documents[0];
}

export async function getSingleSeoPageByUrl(pageUrl: string) {
  const seoPage = await databases2.listDocuments(
    `${appwriteConfig.databaseId2}`,
    `${appwriteConfig.seoCollectionId}`,
    [Query.equal("url", pageUrl)]
  );

  if (!seoPage) {
    return {
      title: "Tipsvendor - Top Football Tips and Prediction Website",
      description: "Get the best football tips and predictions",
      keywords: ["football tips", "predictions", "sports betting"],
      h1tag: "Football Tips and Predictions",
      content: "",
      url: pageUrl,
    };
  }

  return seoPage.documents[0];
}

export async function getSubscriptions(page = 1, pageSize = 15) {
  const queries = [
    Query.limit(pageSize),
    Query.offset((page - 1) * pageSize),
    Query.orderDesc("isValid"),
    Query.orderDesc("updatedAt"),
  ];
  

  const subscriptions = await databases1.listDocuments(
    appwriteConfig.databaseId1,
    appwriteConfig.subscriptionId,
    queries
  );

  if (!subscriptions) throw Error;

  return subscriptions.documents;
}

export async function getComments(page = 1, pageSize = 15) {
  const comments = await databases1.listDocuments(
    appwriteConfig.databaseId1,
    appwriteConfig.commentCollectionId,
    [Query.limit(pageSize), Query.offset((page - 1) * pageSize), Query.orderDesc("$createdAt")]
  );

  if (!comments) throw Error;

  return comments.documents;
}

export async function getSingleComment(commentId: string) {
  const comment = await databases1.getDocument(
    appwriteConfig.databaseId1,
    appwriteConfig.commentCollectionId,
    commentId
  );

  if (!comment) throw Error;

  return comment;
}

export async function getCollectionCounts(collection: string) {
  const collectionCounts = await databases1.listDocuments(
    appwriteConfig.databaseId1,
    appwriteConfig.collectionCountsId,
    [Query.limit(1), Query.equal("collection", collection)]
  );

  if (!collectionCounts) throw Error;

  return collectionCounts.documents[0];
}