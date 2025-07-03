import { Client, Databases } from "appwrite";

export const getAnalyticsDoc = async () => {
  const client = new Client();
  client
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT as string)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID as string);

  const databases = new Databases(client);

  const analyticsDoc = await databases.getDocument(
    process.env.NEXT_PUBLIC_DB_ID as string,
    process.env.NEXT_PUBLIC_ANALYTICS_COLLECTION_ID as string,
    process.env.NEXT_PUBLIC_ANALYTICS_DOC_ID as string
  );
  return analyticsDoc;
};