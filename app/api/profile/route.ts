import { NextResponse } from "next/server";
import { databases, storage, account, appwriteConfig } from "@/lib/appwrite/config";
import { ID } from "appwrite";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const address = formData.get("address") as string;
    const avatar = formData.get("avatar") as File;

    // Get current user
    const currentUser = await account.get();
    const userId = currentUser.$id;

    let avatarUrl = null;

    if (avatar) {
      try {
        // Delete old avatar if exists
        const user = await databases.getDocument(
          appwriteConfig.databaseId,
          "users",
          userId
        );

        if (user.avatar) {
          const oldFileId = user.avatar.split('/').pop();
          if (oldFileId) {
            try {
              await storage.deleteFile(
                appwriteConfig.storageId,
                oldFileId
              );
            } catch (error) {
              console.error("Error deleting old avatar:", error);
            }
          }
        }

        // Upload new avatar
        const file = await storage.createFile(
          appwriteConfig.storageId,
          ID.unique(),
          avatar
        );

        // Get the file URL
        avatarUrl = storage.getFileView(
          appwriteConfig.storageId,
          file.$id
        );
      } catch (error) {
        console.error("Error handling avatar upload:", error);
        return NextResponse.json(
          { error: "Failed to upload avatar" },
          { status: 500 }
        );
      }
    }

    // Update user profile in Appwrite
    const updatedUser = await databases.updateDocument(
      appwriteConfig.databaseId,
      "users",
      userId,
      {
        name,
        email,
        phone,
        address,
        ...(avatarUrl && { avatar: avatarUrl }),
      }
    );

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const currentUser = await account.get();
    const userId = currentUser.$id;

    const user = await databases.getDocument(
      appwriteConfig.databaseId,
      "users",
      userId
    );

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
} 