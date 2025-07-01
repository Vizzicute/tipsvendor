import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import AuthWrapper from "@/context/AuthWrapper";
import { getCached } from "@/lib/appwrite/cache";
import { Metadata } from "next";
import React from "react";

export async function generateMetadata(): Promise<Metadata> {
  try {
    const currentUser = await getCached("seoPage-1", async () => {
      const user = localStorage.getItem('authUser');
      if(!user) return null;
      const parsedUser = JSON.parse(user);
      return parsedUser;
    });

    return {
      title: `${currentUser?.name || "User"} Dashboard`,
      description: "Dashboard for managing user's account",
    };
  } catch (error) {
    console.error("Error fetching metadata:", error);
    return {
      title: "Dashboard",
      description: "Dashboard for managing user's account",
    };
  }
}

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full h-screen flex bg-gray-200">
      <div className="w-full bg-slate-100 flex flex-col">
        <Navbar />

        <div className="h-full w-full overflow-y-scroll no-scrollbar">
          <AuthWrapper>{children}</AuthWrapper>
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default Layout;
