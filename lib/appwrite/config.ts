import { Client, Account, Databases, Storage, Avatars } from 'appwrite'

export const appwriteConfig = {
    projectId1: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID_1 || "",
    projectId2: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID_2 || "",
    projectId3: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID_3 || "",
    endpoint1: process.env.NEXT_PUBLIC_APPWRITE_URL_2 || "",
    endpoint2: process.env.NEXT_PUBLIC_APPWRITE_URL_2 || "",
    databaseId1: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID_1 || "",
    databaseId2: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID_2 || "",
    databaseId3: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID_3 || "",
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

export const client1 = new Client();
export const client2 = new Client();
export const client3 = new Client();

client1.setProject(`${appwriteConfig.projectId1}`);
client1.setEndpoint(`${appwriteConfig.endpoint1}`);
client2.setProject(`${appwriteConfig.projectId2}`);
client2.setEndpoint(`${appwriteConfig.endpoint2}`);
client3.setProject(`${appwriteConfig.projectId3}`);
client3.setEndpoint(`${appwriteConfig.endpoint2}`);

export const account = new Account(client1);
export const databases1 = new Databases(client1);
export const databases2 = new Databases(client2);
export const databases3 = new Databases(client3);
export const storage = new Storage(client1);
export const avatars = new Avatars(client1);