import { getWalletSettings } from "@/lib/appwrite/appConfig";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ reference: string }> }
) {
  const wallet = await getWalletSettings();
  const reference = (await context.params).reference;

  if (!reference) {
    return NextResponse.json({ success: false, error: "Missing reference" }, { status: 400 });
  }

  try {
    const res = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${wallet?.paystack?.secretKey}`,
        },
      }
    );
    const data = await res.json();
    return NextResponse.json({ success: true, data: data.data });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Verification failed" }, { status: 400 });
  }
}