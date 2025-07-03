import { Databases } from "appwrite";

type IncrementCountParams = {
  databases: Databases;
  dbId: string;
  countsCollectionId: string;
  countsDocId: string;
  fieldName: string; // e.g. "predictionWinCounts"
  date?: string;     // optional: defaults to today
};

type AdjustCountParams = IncrementCountParams & {
  amount: number;
};

type SumCountsInRangeParams = {
  jsonString: string;
  fromDate: string; // "YYYY-MM-DD"
  toDate: string;   // "YYYY-MM-DD"
};

/**
 * Increment count for a given field & date
 */
export async function incrementDailyCount({
  databases,
  dbId,
  countsCollectionId,
  countsDocId,
  fieldName,
  date,
}: IncrementCountParams) {
  const today = date || new Date().toISOString().substring(0, 10);

  // Get current doc
  const countsDoc = await databases.getDocument(
    dbId,
    countsCollectionId,
    countsDocId
  );

  // Parse JSON field
  let countsMap = {};
  try {
    countsMap = JSON.parse(countsDoc[fieldName] || "{}");
  } catch {
    countsMap = {};
  }

  // Increment
  (countsMap as Record<string, number>)[today] = ((countsMap as Record<string, number>)[today] || 0) + 1;

  // Save back
  await databases.updateDocument(dbId, countsCollectionId, countsDocId, {
    [fieldName]: JSON.stringify(countsMap),
  });

  return countsMap;
}

/**
 * Adjust count by a given amount (+/-) for a field & date
 */
export async function adjustDailyCount({
  databases,
  dbId,
  countsCollectionId,
  countsDocId,
  fieldName,
  date,
  amount,
}: AdjustCountParams) {
  const targetDate = date || new Date().toISOString().substring(0, 10);

  const countsDoc = await databases.getDocument(
    dbId,
    countsCollectionId,
    countsDocId
  );

  let countsMap = {};
  try {
    countsMap = JSON.parse(countsDoc[fieldName] || "{}");
  } catch {
    countsMap = {};
  }

  (countsMap as Record<string, number>)[targetDate] = ((countsMap as Record<string, number>)[targetDate] || 0) + amount;

  await databases.updateDocument(dbId, countsCollectionId, countsDocId, {
    [fieldName]: JSON.stringify(countsMap),
  });

  return countsMap;
}

/**
 * Sum counts for a JSON string field over a date range
 */
export function sumCountsInRange({
  jsonString,
  fromDate,
  toDate,
}: SumCountsInRangeParams) {
  let countsMap = {};
  try {
    countsMap = JSON.parse(jsonString || "{}");
  } catch {
    countsMap = {};
  }

  let total = 0;

  Object.entries(countsMap).forEach(([date, value]) => {
    if (date >= fromDate && date <= toDate) {
      total += value as number;
    }
  });

  return total;
}
