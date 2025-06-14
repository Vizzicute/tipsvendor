import { truncate } from "../utils";
import { getAdmin } from "./fetch";
import { createNotification } from "./notifications";

const admin = await getAdmin();

// Trigger notification for new user registration
export async function notifyNewUser(user: string, userName: string) {
  // Notify admin
  await createNotification({
    user: admin.$id, // Admin user ID
    type: "new_user",
    title: "New User Registration",
    message: `${userName} has registered on the platform`,
    read: false,
    data: JSON.stringify({ user })
  });
}

// Trigger notification for new subscription
export async function notifyNewSubscription(user: string, subscriptionType: string, duration: number) {
  // Notify admin
  await createNotification({
    user: admin.$id,
    type: "new_subscription",
    title: "New Subscription",
    message: `New ${subscriptionType} subscription for ${duration} days`,
    read: false,
    data: JSON.stringify({ user, subscriptionType, duration })
  });

  // Notify user
  await createNotification({
    user: user,
    type: "new_subscription",
    title: "Subscription Activated",
    message: `Your ${subscriptionType} subscription has been activated for ${duration} days`,
    read: false,
    data: JSON.stringify({ subscriptionType, duration })
  });
}

// Trigger notification for subscription expiration
export async function notifySubscriptionExpiring(user: string, subscriptionType: string, daysLeft: number) {
  await createNotification({
    user: user,
    type: "subscription_expiring",
    title: "Subscription Expiring Soon",
    message: `Your ${subscriptionType} subscription will expire in ${daysLeft} days`,
    read: false,
    data: JSON.stringify({ subscriptionType, daysLeft })
  });
}

// Trigger notification for new comment
export async function notifyNewComment(postAuthor: string, commenter: string, postTitle: string) {
  await createNotification({
    user: postAuthor,
    type: "new_comment",
    title: "New Comment",
    message: `${commenter} commented on your post: "${truncate(postTitle, 20)}"`,
    read: false,
    data: JSON.stringify({ commenter, postTitle })
  });
}

// Trigger notification for payment received
export async function notifyPaymentReceived(user: string, amount: number, paymentMethod: string) {
  // Notify admin
  await createNotification({
    user: admin.$id,
    type: "payment_received",
    title: "Payment Received",
    message: `Payment of ${amount} received via ${paymentMethod}`,
    read: false,
    data: JSON.stringify({ user, amount, paymentMethod })
  });

  // Notify user
  await createNotification({
    user: user,
    type: "payment_received",
    title: "Payment Successful",
    message: `Your payment of ${amount} via ${paymentMethod} was successful`,
    read: false,
    data: JSON.stringify({ amount, paymentMethod })
  });
}

// Trigger notification for staff assignment
export async function notifyStaffAssignment(user: string, role: string) {
  await createNotification({
    user: user,
    type: "staff_assignment",
    title: "Staff Role Assigned",
    message: `You have been assigned the role of ${role}`,
    read: false,
    data: JSON.stringify({ role })
  });
}

// Trigger notification for prediction result
export async function notifyPredictionResult(user: string, predictionId: string, result: string, accuracy: number) {
  await createNotification({
    user: user,
    type: "prediction_result",
    title: "Prediction Result Available",
    message: `Your prediction result is ${result} with ${accuracy}% accuracy`,
    read: false,
    data: JSON.stringify({ predictionId, result, accuracy })
  });
} 