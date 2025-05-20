import { Client, Account, Databases, Storage, Avatars } from 'appwrite'

export const appwriteConfig = {
    projectId: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || "",
    endpoint: process.env.NEXT_PUBLIC_APPWRITE_URL || "",
    databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "",
    storageId: process.env.NEXT_PUBLIC_APPWRITE_STORAGE_ID || "",
    userCollectionId: process.env.NEXT_PUBLIC_APPWRITE_USER_COLLECTION_ID || "",
    predictionCollectionId: process.env.NEXT_PUBLIC_APPWRITE_PREDICTION_COLLECTION_ID || "",
    blogCollectionId: process.env.NEXT_PUBLIC_APPWRITE_BLOG_COLLECTION_ID || "",
    blogCategoriesCollectionId: process.env.NEXT_PUBLIC_APPWRITE_BLOG_CATEGORIES_COLLECTION_ID || "",
    seoCollectionId: process.env.NEXT_PUBLIC_APPWRITE_SEO_COLLECTION_ID || "",
    subscriptionId: process.env.NEXT_PUBLIC_APPWRITE_SUBSCRIPTION_COLLECTION_ID || "",
    settingsId: process.env.NEXT_PUBLIC_APPWRITE_SETTINGS_COLLECTION_ID || "",
    notificationId: process.env.NEXT_PUBLIC_APPWRITE_NOTIFICATION_COLLECTION_ID || "",
    commentCollectionId: process.env.NEXT_PUBLIC_APPWRITE_COMMENT_COLLECTION_ID || "",
}

export const client = new Client();

client.setProject(`${appwriteConfig.projectId}`);
client.setEndpoint(`${appwriteConfig.endpoint}`);

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export const avatars = new Avatars(client);