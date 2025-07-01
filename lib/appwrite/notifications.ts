import { appwriteConfig, databases1 } from "./config";
import { ID, Query } from "appwrite";

export interface Notification {
  id: string;
  user: string;
  type: 'new_comment' | 'new_subscription' | 'new_user' | 'subscription_expiring' | 'payment_received' | 'prediction_result' | 'staff_assignment';
  title: string;
  message: string;
  read: boolean;
  data?: string;
  $createdAt?: string;
}

// Create a new notification
export async function createNotification(notification: Omit<Notification, 'id'>) {
  try {
    const response = await databases1.createDocument(
      appwriteConfig.databaseId1,
      appwriteConfig.notificationId,
      ID.unique(),
      notification,
    );
    return response;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
}

// Get notifications for a user
export async function getUserNotifications(user: string) {
  try {
    const response = await databases1.listDocuments(
      appwriteConfig.databaseId1,
      appwriteConfig.notificationId,
      [
        Query.equal('user', user),
        Query.orderDesc('$createdAt'),
        Query.limit(50),
      ]
    );
    const documents = response.documents.map(doc => ({
      id: doc.$id,
      user: doc.user,
      type: doc.type,
      title: doc.title,
      message: doc.message,
      read: doc.read,
      data: doc.data,
      $createdAt: doc.$createdAt
    }));
    return documents;
  } catch (error) {
    console.error('Error fetching notifications:', error);
    throw error;
  }
}

// Mark notification as read
export async function markNotificationAsRead(notificationId: string) {
  try {
    const response = await databases1.updateDocument(
      appwriteConfig.databaseId1,
      appwriteConfig.notificationId,
      notificationId,
      {
        read: true,
      }
    );
    return response;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
}

// Mark all notifications as read
export async function markAllNotificationsAsRead(user: string) {
  try {
    const notifications = await getUserNotifications(user);
    const unreadNotifications = notifications.filter(n => !n.read);
    
    const updatePromises = unreadNotifications.map(notification =>
      markNotificationAsRead(notification.id)
    );
    
    await Promise.all(updatePromises);
    return true;
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    throw error;
  }
}

// Get unread notifications count
export async function getUnreadNotificationsCount(user: string) {
  try {
    const response = await databases1.listDocuments(
      appwriteConfig.databaseId1,
      appwriteConfig.notificationId,
      [
        Query.equal('user', user),
        Query.equal('read', false),
      ]
    );
    return response.total;
  } catch (error) {
    console.error('Error getting unread notifications count:', error);
    throw error;
  }
} 