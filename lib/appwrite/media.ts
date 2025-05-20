import { ID } from "appwrite";
import { appwriteConfig, storage } from "./config";

export async function uploadFile(file: File) {
  const uploadedFile = await storage.createFile(
    `${`${appwriteConfig.storageId}`}`,
    ID.unique(),
    file
  );

  return uploadedFile.$id; // return file ID
}

type editFileType = {
  newfile: File;
  oldFileId: string;
};

export async function deleteFile(fileId: string) {
  try {
    const deleteFile = await storage.deleteFile(
      appwriteConfig.storageId,
      fileId
    );
  } catch (error) {
    console.error(error);
  }
}

export async function fileUrl(fileId: string) {
  const file = storage.getFileView(appwriteConfig.storageId, fileId);

  return file;
}

type editAvatarType = {
  newAvatar: File;
  oldAvatarId?: string;
};

export async function editAvatar({ newAvatar, oldAvatarId }: editAvatarType) {
  try {
    // Delete old avatar if it exists
    if (oldAvatarId) {
      await deleteFile(oldAvatarId);
    }

    // Upload new avatar
    const newAvatarId = await uploadFile(newAvatar);
    
    // Get the URL for the new avatar
    const avatarUrl = await fileUrl(newAvatarId);

    return {
      avatarId: newAvatarId,
      avatarUrl: avatarUrl
    };
  } catch (error) {
    console.error("Error updating avatar:", error);
    throw error;
  }
}
