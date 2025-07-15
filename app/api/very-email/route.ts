import { NextResponse } from "next/server";
import { Client, Users } from "node-appwrite";
import { databases1 } from "@/lib/appwrite/config"; // adjust import as needed
import { appwriteConfig } from "@/lib/appwrite/config"; // adjust import as needed
import { getSingleUserByUserId } from "@/lib/appwrite/fetch";
import { getCurrentUser } from "@/lib/appwrite/api";


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
        .setEndpoint(appwriteConfig.endpoint1)
      .setProject(appwriteConfig.projectId1)
      .setKey(process.env.NEXT_PUBLIC_APPWRITE_API_KEY || "");
    const users = new Users(client);

    // 1. Verify Appwrite account
    await users.updateEmailVerification(accountId, true);

    // 2. Update user document in your DB (if you have a users collection)
    await databases1.updateDocument(
      appwriteConfig.databaseId1,
      appwriteConfig.userCollectionId,
      userId,
      { isVerified: true }
    );

    // After successful verification (e.g., in your frontend)
    // Call your verification API first...
    await fetch("/api/very-email", { method: "POST", body: JSON.stringify({ userId }) });

    // Then update localStorage with the latest user info
    const updatedUser = await getCurrentUser();
    if (updatedUser) {
      localStorage.setItem("authUser", JSON.stringify(updatedUser));
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Verification error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to verify user" },
      { status: 500 }
    );
  }
}