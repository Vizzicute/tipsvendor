"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { routeAccess } from "@/lib/routes";
import { getCurrentUser } from "@/lib/appwrite/api";

export default function AuthWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const protectRoute = async () => {
      const user = await getCurrentUser();

      if(!user && pathname === "/dashboard") {
        router.replace("login");
        return;
      }

      if (!user && pathname !== "/admin-auth") {
        router.replace("/admin-auth");
        return;
      }

      try {
        const role = user?.role || "user";
        const allowedRoles = routeAccess[pathname];

        if (allowedRoles && !allowedRoles.includes(role)) {
          role === "user"
            ? router.replace("/dashboard")
            : router.replace("/admin");
          return;
        }

        setAuthorized(true); // ✅ user is allowed
      } catch (err) {
        console.error(err);
        if (pathname !== "/admin-auth") {
          router.replace("/admin-auth");
          return;
        }
      } finally {
        setChecking(false); // ✅ we're done checking
      }
    };

    protectRoute();
  }, [pathname]);

  if (checking || !authorized) {
    // ✅ Block UI while checking OR redirecting
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg animate-pulse">Checking access...</p>
      </div>
    );
  }

  return <>{children}</>;
}
