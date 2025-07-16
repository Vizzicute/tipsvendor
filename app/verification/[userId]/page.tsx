"use client";

import Logo from "@/components/Logo";
import { useUserContext } from "@/context/AuthContext";
import { verifyUser } from "@/lib/react-query/queries";
import { useParams } from "next/navigation";

export default function VerificationPage() {
  const { userId } = useParams() as { userId: string };

  if (!userId) {
    console.log("Missing userId in URL parameters");
    return (
      <div className="flex flex-col items-center justify-center h-screen w-full gap-4">
        <Logo width={100} />
        <h1 className="text-2xl font-semibold text-amber-600">
          User ID is missing in the URL
        </h1>
      </div>
    );
  }

  const { data, isPending, isSuccess, isError } = verifyUser(userId);
  const { setUser } = useUserContext();

  if (isSuccess && data) {
    const updatedUser = JSON.parse(localStorage.getItem("authUser") || "{}");
    if (updatedUser) {
      setUser(updatedUser);
    }
    setTimeout(() => {
      window.location.assign("/dashboard");
    }, 2000);
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen w-full gap-4">
      <Logo width={100} />
      {isPending ? (
        <h1 className="text-2xl font-semibold animate-pulse">
          Verifying User...
        </h1>
      ) : isSuccess ? (
        <>
          <h1 className="text-2xl font-semibold text-green-500">
            Verification Successful
          </h1>
          <div className="text-sm text-gray-500">
            <p className="text-center">
              You will be redirected to your dashboard shortly.
            </p>
          </div>
        </>
      ) : isError ? (
        <h1 className="text-2xl font-semibold text-red-500">
          Verification Failed
        </h1>
      ) : null}
    </div>
  );
}
