import { account } from "@/lib/appwrite/config";
import { getUsers } from "@/lib/appwrite/fetch";
import { Client, Users } from "node-appwrite";

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || "")
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || "")
  .setKey(process.env.NEXT_PUBLIC_APPWRITE_API_KEY || "");

  const user = new Users(client);

export async function verifyUsers() {
    const users = await getUsers();
    const currentAccount = await account.get();
    const verifiedUsers = users.filter(user => user.isVerified === true);

    const verifiedUser = verifiedUsers.find(user => user.$id === currentAccount.$id);
    if (!verifiedUser) {
        throw new Error("User is not verified");
    }

    const verifyAccount = await user.updateEmailVerification(verifiedUser.accountId, true);
    if (!verifyAccount) {
        throw new Error("Verification failed");
    }
    return verifyAccount;
}