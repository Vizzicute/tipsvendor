import { INewUser } from "@/types";
import { account, appwriteConfig, avatars, databases1 } from "./config";
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

    localStorage.setItem("authUser", JSON.stringify(newUser));

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
    const newAccount = await account.create(accountId, email, password, name);

    if (!newAccount) throw new Error("Failed to create account");

    await getCurrentUser();

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
    const newUser = await databases1.createDocument(
      appwriteConfig.databaseId1,
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
    // First, check if user is already signed in
    const existingUser = await checkIfUserIsSignedIn();
    
    if (existingUser) {
      return existingUser;
    }

    // If not signed in, create a new session with the provided credentials
    const session = await account.createEmailPasswordSession(
      user.email,
      user.password
    );

    // If successful, get the current user and store in localStorage
    const currentUser = await getCurrentUser();

    return currentUser;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getCurrentUser() {
  try {
    const currentAccount = await account.get();

    if (!currentAccount) throw Error;

    const currentUser = await databases1.listDocuments(
      appwriteConfig.databaseId1,
      appwriteConfig.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );

    if (!currentUser) throw Error;

    if (currentUser.documents[0]) {
      localStorage.setItem(
        "authUser",
        JSON.stringify(currentUser.documents[0])
      );
    }

    return currentUser.documents[0];
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function checkIfUserIsSignedIn() {
  try {
    const currentAccount = await account.get();
    
    if (!currentAccount) {
      return null;
    }

    // Check if user data exists in localStorage
    const storedUser = localStorage.getItem("authUser");
    
    if (storedUser) {
      return JSON.parse(storedUser);
    }

    // If no localStorage data but session exists, fetch from database
    const currentUser = await databases1.listDocuments(
      appwriteConfig.databaseId1,
      appwriteConfig.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );

    if (currentUser.documents[0]) {
      localStorage.setItem(
        "authUser",
        JSON.stringify(currentUser.documents[0])
      );
      return currentUser.documents[0];
    }

    return null;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function signOutAccount() {
  try {
    const session = await account.deleteSession("current");
    localStorage.removeItem("authUser");
    return session;
  } catch (error) {
    console.log(error);
  }
}

export async function signOutAllAccount() {
  try {
    const session = await account.deleteSessions();

    localStorage.removeItem("authUser");

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
      process.env.NEXT_PUBLIC_APP_URL
    );

    return googleSession;
  } catch (error) {
    console.log(error);
  }
}
