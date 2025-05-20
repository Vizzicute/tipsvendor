import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import React from "react";

const ProtectedLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full h-screen flex bg-gray-200">
      <div className="w-full bg-slate-100 flex flex-col">
        <Navbar />

        <div className="h-full w-full overflow-y-scroll no-scrollbar">
          {children}
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default ProtectedLayout;
