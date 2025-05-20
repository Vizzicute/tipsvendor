import DashboardLayout from "@/components/DashboardLayout";
import AuthWrapper from "@/context/AuthWrapper";
import React from "react";
import { Metadata } from 'next'
import { CircleAlert } from "lucide-react";

export const metadata: Metadata = {
  title: "Admin"
}

const ProtectedLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthWrapper>
      <div className="w-full h-screen flex">
        <div className="w-full md:flex hidden flex-col">
          <DashboardLayout>
            <div className="h-full w-full overflow-y-scroll no-scrollbar">
              {children}
            </div>
          </DashboardLayout>
        </div>
        <div className="text-lg flex flex-col gap-4 md:hidden size-full justify-center items-center">
          <CircleAlert size={100} className="text-amber-500"/>
          <span>Desktop Mode Recommended!</span>
        </div>
      </div>
    </AuthWrapper>
  );
};

export default ProtectedLayout;
