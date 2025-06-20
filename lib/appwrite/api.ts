import { INewUser } from "@/types";
import { account, appwriteConfig, avatars, databases } from "./config";
import { ID, Models, OAuthProvider, Query } from "appwrite";

export async function createUserAccount(user: INewUser) {
  try {
    const newAccount = await account.create(
      ID.unique(),
      user.email,
      user.password,
      user.name
    );

    if (!newAccount) throw new Error("Failed to create account");

    const avatarUrl = avatars.getInitials(user.name).toString();

    const newUser = await saveUserToDB({
      accountId: newAccount.$id,
      email: newAccount.email,
      name: newAccount.name,
      imageUrl: avatarUrl,
      imageId: null, // Initialize with null since we're using initials avatar
    });

    return newUser;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function createStaffAccount(
  accountId: string,
  name: string,
  email: string,
  password: string
): Promise<Models.User<Models.Preferences>> {
  try {
    const newAccount = await account.create(
      accountId,
      email,
      password,
      name
    );

    if (!newAccount) throw new Error("Failed to create account");

    return newAccount;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function saveUserToDB(user: {
  accountId: string;
  email: string;
  name: string;
  imageUrl: string;
  imageId?: string | null;
}) {
  try {
    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      {
        ...user,
        imageId: user.imageId || null,
      }
    );

    return newUser;
  } catch (error) {
    console.log(error);
  }
}

export async function signInAccount(user: { email: string; password: string }) {
  try {
    const session = await account.createEmailPasswordSession(
      user.email,
      user.password
    );

    return session;
  } catch (error) {
    console.log(error);
  }
}

export async function getCurrentUser() {
  try {
    const currentAccount = await account.get();

    if (!currentAccount) throw Error;

    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );

    if (!currentUser) throw Error;

    return currentUser.documents[0];
  } catch (error) {
    console.log(error);
  }
}

export async function signOutAccount() {
  try {
    const session = await account.deleteSession("current");

    return session;
  } catch (error) {
    console.log(error);
  }
}

export async function signOutAllAccount() {
  try {
    const session = await account.deleteSessions();

    return session;
  } catch (error) {
    console.log(error);
  }
}

export async function googleAuth() {
  try {
    const googleSession = await account.createOAuth2Session(
      OAuthProvider.Google,
      process.env.NEXT_PUBLIC_APP_URL,
      `${process.env.NEXT_PUBLIC_APP_URL}/login?error=true`
    );

    return googleSession;
  } catch (error) {
    console.log(error);
  }
}
