import type { NextApiRequest, NextApiResponse } from "next";
import { getWalletSettings } from "@/lib/appwrite/appConfig";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { reference } = req.query;
  const wallet = await getWalletSettings();

  if (!wallet?.paystack && !wallet?.SecretKey) {
    return res.status(400).json({ success: false, data: { message: "Paystack is not set" } });
  }

  try {
    const paystackRes = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${wallet?.SecretKey}`,
        },
      }
    );
    const data = await paystackRes.json();
    return res.status(200).json({ success: true, data: data.data });
  } catch (error) {
    return res.status(400).json({ success: false });
  }
}