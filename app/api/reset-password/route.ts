import { NextResponse } from "next/server";
import { Client, Users } from "node-appwrite";

export async function POST(request: Request) {
  try {
    const { userId, password } = await request.json();

    if (!userId || !password) {
      return NextResponse.json(
        { error: "Missing userId or password" },
        { status: 400 }
      );
    }

    const client = new Client()
      .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_URL || "")
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || "")
      .setKey(process.env.NEXT_PUBLIC_APPWRITE_API_KEY || "");

    const users = new Users(client);

    // Update the user's password
    const user = await users.updatePassword(userId, password);

    return NextResponse.json({ success: true, user });
  } catch (error: any) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to reset password" },
      { status: 500 }
    );
  }
}