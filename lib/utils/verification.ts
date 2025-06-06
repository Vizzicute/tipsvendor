export async function verifyAccount(userId: string) {
  try {
    const response = await fetch("/api/very-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId }),
    });

    if (!response.ok) {
      throw new Error("Failed to verify user");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Verification error:", error);
    throw error;
  }
}