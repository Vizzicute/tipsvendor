import { Query } from "appwrite";
import { appwriteConfig, databases1, databases2 } from "./config";

export async function getPredictions() {
  const predictions = await databases1.listDocuments(
    `${appwriteConfig.databaseId1}`,
    `${appwriteConfig.predictionCollectionId}`,
    [Query.limit(1000), Query.orderDesc("$createdAt")]
  );

  if (!predictions) throw Error;

  return predictions.documents;
}

export async function getFromYesterdaysPredictions() {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  const predictions = await databases1.listDocuments(
    `${appwriteConfig.databaseId1}`,
    `${appwriteConfig.predictionCollectionId}`,
    [
      Query.limit(100),
      Query.greaterThanEqual("$createdAt", yesterday.toISOString()),
    ]
  );

  if (!predictions) throw Error;

  return predictions.documents;
}

export async function getUsers() {
  const users = await databases1.listDocuments(
    `${appwriteConfig.databaseId1}`,
    `${appwriteConfig.userCollectionId}`,
    [Query.limit(500), Query.orderDesc("$createdAt")]
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


export async function getBlog() {
  const blogs = await databases1.listDocuments(
    `${appwriteConfig.databaseId1}`,
    `${appwriteConfig.blogCollectionId}`,
    [Query.limit(500), Query.orderDesc("$createdAt")]
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

export async function getSubscriptions() {
  const subscriptions = await databases1.listDocuments(
    appwriteConfig.databaseId1,
    appwriteConfig.subscriptionId,
    [Query.limit(500), Query.orderDesc("$createdAt")],
  );

  if (!subscriptions) throw Error;

  return subscriptions.documents;
}

export async function getComments() {
  const comments = await databases1.listDocuments(
    appwriteConfig.databaseId1,
    appwriteConfig.commentCollectionId
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
