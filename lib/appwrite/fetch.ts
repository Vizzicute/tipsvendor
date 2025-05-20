import { Query } from "appwrite";
import { appwriteConfig, databases } from "./config";

export async function getPredictions() {
  const predictions = await databases.listDocuments(
    `${appwriteConfig.databaseId}`,
    `${appwriteConfig.predictionCollectionId}`
  );

  if (!predictions) throw Error;

  return predictions.documents;
}

export async function getUsers() {
  const users = await databases.listDocuments(
    `${appwriteConfig.databaseId}`,
    `${appwriteConfig.userCollectionId}`
  );

  if (!users) throw Error;

  return users.documents;
}

export async function getBlog() {
  const blogs = await databases.listDocuments(
    `${appwriteConfig.databaseId}`,
    `${appwriteConfig.blogCollectionId}`
  );

  if (!blogs) throw Error;

  return blogs.documents;
}

export async function getSingleBlog(blogId: string) {
  try {
    const blog = await databases.getDocument(
      appwriteConfig.databaseId,
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
  const blog = await databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.blogCollectionId,
    [Query.equal("slug", slug)]
  );

  if (!blog) throw Error;

  return blog.documents[0];
}

export async function getBlogCategories() {
  const blogs = await databases.listDocuments(
    `${appwriteConfig.databaseId}`,
    `${appwriteConfig.blogCategoriesCollectionId}`
  );

  if (!blogs) throw Error;

  return blogs.documents;
}

export async function getSeoPages() {
  const seo = await databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.seoCollectionId
  );

  if(!seo) throw Error;

  return seo.documents;
}

export async function getSingleSeoPage(pageId: string) {
  const seoPage = await databases.listDocuments(
    `${appwriteConfig.databaseId}`,
    `${appwriteConfig.seoCollectionId}`,
    [Query.equal("$id", pageId)]
  );

  if (!seoPage) throw Error;

  return seoPage.documents[0];
}

export async function getSingleSeoPageByUrl(pageUrl: string) {
  const seoPage = await databases.listDocuments(
    `${appwriteConfig.databaseId}`,
    `${appwriteConfig.seoCollectionId}`,
    [Query.equal("url", pageUrl)]
  );

  if (!seoPage || !seoPage.documents || seoPage.documents.length === 0) {
    return {
      title: "Tipsvendor - Top Football Tips and Prediction Website",
      description: "Get the best football tips and predictions",
      keywords: ["football tips", "predictions", "sports betting"],
      h1tag: "Football Tips and Predictions",
      content: "",
      url: pageUrl
    };
  }

  return seoPage.documents[0];
}

export async function getSubscriptions() {
  const subscriptions = await databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.subscriptionId
  );

  if (!subscriptions) throw Error;

  return subscriptions.documents;
}

export async function getComments() {
  const comments = await databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.commentCollectionId
  );

  if (!comments) throw Error;

  return comments.documents;
}

export async function getSingleComment(commentId: string) {
  const comment = await databases.getDocument(
    appwriteConfig.databaseId,
    appwriteConfig.commentCollectionId,
    commentId
  );

  if (!comment) throw Error;

  return comment;
}
