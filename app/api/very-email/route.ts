import { NextResponse } from "next/server";
import { Client, Users } from "node-appwrite";
import { databases } from "@/lib/appwrite/config"; // adjust import as needed
import { appwriteConfig } from "@/lib/appwrite/config"; // adjust import as needed
import { getSingleUserByUserId } from "@/lib/appwrite/fetch";
import { Models } from "appwrite";


export async function POST(request: Request) {
  try {
    const { userId } = await request.json();
    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }
    const user = await getSingleUserByUserId(userId);
    const accountId = user?.accountId;

    // Appwrite admin SDK
    const client = new Client()
      .setEndpoint(appwriteConfig.endpoint)
      .setProject(appwriteConfig.projectId)
      .setKey(process.env.NEXT_PUBLIC_APPWRITE_API_KEY || "");
    const users = new Users(client);

    // 1. Verify Appwrite account
    await users.updateEmailVerification(accountId, true);

    // 2. Update user document in your DB (if you have a users collection)
    await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      userId,
      { isVerified: true }
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Verification error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to verify user" },
      { status: 500 }
    );
  }
}