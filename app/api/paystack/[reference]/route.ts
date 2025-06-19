import { getWalletSettings } from "@/lib/appwrite/appConfig";
import { NextResponse } from "next/server";

export async function GET(
  { params }: { params: { reference: string } }
) {
  const wallet = await getWalletSettings();
  if (!wallet?.paystack && !wallet?.SecretKey) {
    return NextResponse.json(
      { success: false, data: { message: "Paystack is not set" } },
      { status: 400 }
    );
  }

  const { reference } = params;

  try {
    const res = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${wallet?.SecretKey}`,
        },
      }
    );
    const data = await res.json();
    return NextResponse.json({ success: true, data: data.data }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 400 });
  }
}
