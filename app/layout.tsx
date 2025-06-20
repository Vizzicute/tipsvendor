import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";
import { QueryProvider } from "@/lib/react-query/QueryProvider";
import AuthProvider from "@/context/AuthContext";
import { Analytics } from "@/components/google/Analytics";
import { Analytics as VercelAnalytics } from "@vercel/analytics/next";
import AdScript from "@/components/google/AdScript";
import GtmScript from "@/components/google/GtmScript";
import AnalyticScript from "@/components/google/AnalyticScript";
import { AdSenseManager } from "@/components/google/Adsense";
import { GTMManager } from "@/components/google/TagManager";
import AdPopupModal from "@/components/AdPopupModal";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Tipsvendor - Top Football Tips and Prediction Website",
    template: "%s - Tipsvendor",
  },
  description:
    "Discover expert predictions and tips across sports, finance, and lifestyle with Tipsvendor. Stay informed with accurate, real-time forecasts and make smarter decisions. Join Tipsvendor for the best in",
  twitter: {
    card: "summary_large_image",
  },
  alternates: {
    canonical: process.env.NEXT_PUBLIC_URL,
  },
  authors: {
    name: "Tipsvendor",
    url: process.env.NEXT_PUBLIC_URL,
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Tipsvendor - Top Football Tips and Prediction Website",
    description:
      "Discover expert predictions and tips across sports, finance, and lifestyle with Tipsvendor. Stay informed with accurate, real-time forecasts and make smarter decisions. Join Tipsvendor for the best in",
    images: [
      {
        url: "/logo.jpg",
      },
    ],
    siteName: "Tipsvendor",
  },
  icons: [
    {
      rel: "icon",
      url: "/logo.jpg",
      sizes: "800x600",
      type: "image/jpeg",
    },
  ],
  publisher: "Tipsvendor",
  category: "Sports",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <QueryProvider>
          <AuthProvider>
            {children}
            <Analytics />
            <AdSenseManager />
            <AdPopupModal />
            <GTMManager />
            <VercelAnalytics />
            <AdScript />
            <GtmScript />
            <AnalyticScript />
            <Toaster />
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
