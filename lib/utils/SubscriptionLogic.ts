"use client"

import { Models } from "appwrite";

export async function checkAndUpdateSubscription(
  subscription: Models.Document,
  editSubscription: (args: any) => Promise<any>
) {
  const isValid = subscription.isValid;
  const isFreeze = subscription.isFreeze;
  const freezeStart = subscription.freezeStart;
  const freezeEnd = subscription.freezeEnd;
  const createdAt = subscription.$createdAt;
  const updatedAt = subscription.updatedAt;
  const currentDate = new Date();
  const subscriptionStartDate = new Date(updatedAt || createdAt);

  // Calculate freeze duration in ms (if freezeEnd exists)
  const freezeDuration =
    freezeStart && freezeEnd
      ? new Date(freezeEnd).getTime() - new Date(freezeStart).getTime()
      : 0;

  // Duration in ms
  const subscriptionDuration = subscription.duration
    ? parseInt(subscription.duration) * 24 * 60 * 60 * 1000
    : 0;

  // Expiry date = start + duration + freeze
  const expiryDate =
    subscriptionStartDate.getTime() + subscriptionDuration + freezeDuration;

  // If already invalid or frozen, skip
  if (isValid === false || isFreeze === true) return;

  // If expired, update isValid to false
  if (currentDate.getTime() > expiryDate) {
    await editSubscription({
      subscription: {
        isValid: false,
      },
      subscriptionId: subscription.$id,
    });
  }
}