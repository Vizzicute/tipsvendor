import { getEmailSettings } from "@/lib/appwrite/appConfig";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

function generatePredictionTable(predictions: any[], subscriptionType: string) {
  const subscriptionTypeText =
    subscriptionType === "investment"
      ? "Investment Plan"
      : subscriptionType === "vip"
      ? "Vip Tips"
      : subscriptionType === "mega"
      ? "Mega Odds"
      : subscriptionType === "investment&vip"
      ? "Investment Plan And Vip Tips"
      : subscriptionType === "investment&mega"
      ? "Investment Plan And Mega Odds"
      : subscriptionType === "vip&mega"
      ? "Vip Tips And Mega Odds"
      : "Investment Plan, Vip Tips And Mega Odds";

  return `
    <div style="margin-bottom: 30px;">
      <h3 style="color: #3b2b1b; text-align: center; margin-bottom: 15px;">${subscriptionTypeText}</h3>
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <thead>
          <tr>
            <th style="padding: 12px; font-size: 10px; border: 1px solid #ddd; background-color: #3b2b1b; color: #d1b47a">Time</th>
            <th style="padding: 12px; font-size: 10px; border: 1px solid #ddd; background-color: #3b2b1b; color: #d1b47a">League</th>
            <th style="padding: 12px; font-size: 10px; border: 1px solid #ddd; background-color: #3b2b1b; color: #d1b47a">Matches</th>
            <th style="padding: 12px; font-size: 10px; border: 1px solid #ddd; background-color: #3b2b1b; color: #d1b47a">Tips</th>
            <th style="padding: 12px; font-size: 10px; border: 1px solid #ddd; background-color: #3b2b1b; color: #d1b47a">Odds</th>
          </tr>
        </thead>
        <tbody>
          ${predictions
            .map(
              (prediction) => `
            <tr style="background-color: ${
              prediction.$id % 2 === 0 ? "#f8f9fa" : "white"
            };">
              <td style="padding: 12px; font-size: 10px; border: 1px solid #ddd;">${new Date(
                prediction.datetime
              ).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}</td>
              <td style="padding: 12px; font-size: 10px; border: 1px solid #ddd;">${
                prediction.league
              }</td>
              <td style="padding: 12px; font-size: 10px; border: 1px solid #ddd;">${
                prediction.hometeam
              } VS ${prediction.awayteam}</td>
              <td style="padding: 12px; font-size: 10px; border: 1px solid #ddd;">${
                prediction.tip
              }</td>
              <td style="padding: 12px; font-size: 10px; border: 1px solid #ddd;">${
                prediction.odd
              }</td>
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>
    </div>
  `;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { to, subject, html, predictions, subscriptionType } = body;

    if (!to || !subject || (!html && !predictions)) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const emailSettings = await getEmailSettings();
    const transporter = nodemailer.createTransport({
      host: emailSettings.smtpHost,
      port: Number(emailSettings.smtpPort),
      secure: emailSettings.smtpSecure,
      auth: {
        user: emailSettings.smtpUser,
        pass: emailSettings.smtpPass,
      },
    });

    let mailHtml = html;

    if (predictions && Array.isArray(predictions) && subscriptionType) {
      const today = new Date().toISOString().split("T")[0];
      const todayPredictions = predictions.filter((pred: any) => {
        const predDate = new Date(pred.datetime).toISOString().split("T")[0];
        return predDate === today;
      });

      const subscriptionTypes = subscriptionType === "all"
        ? ["investment", "vip", "mega"]
        : subscriptionType.split("&");
      const tablesHtml = subscriptionTypes
        .map((type: string) => {
          const typePredictions = todayPredictions.filter(
            (pred: any) => pred.subscriptionType === type
          );
          return generatePredictionTable(typePredictions, type);
        })
        .join("");

      mailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto;">
          <h2 style="color: #3b2b1b; text-align: center; margin-bottom: 20px;">Today's Predictions</h2>
          ${tablesHtml}
          <p style="text-align: center; color: #718096; font-size: 14px; margin-top: 20px;">
            Thank you for subscribing to our predictions!
          </p>
        </div>
      `;
    }

    const mailOptions = {
      from: emailSettings.smtpFrom,
      to,
      subject,
      html: mailHtml,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error sending email:", error, error?.response);
    return NextResponse.json(
      { error: error?.message || "Failed to send email" },
      { status: 500 }
    );
  }
}
