"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { routeAccess } from "@/lib/routes";
import { useUserContext } from "./AuthContext";

export default function AuthWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);
  const { user, isAuthenticated, isLoading } = useUserContext();

  useEffect(() => {
    if (isLoading) return; // Wait until user is loaded

    const protectRoute = async () => {
      if (!isAuthenticated && !isLoading && pathname.startsWith("/dashboard")) {
        router.replace("/login");
        return;
      }

      if (!isAuthenticated && !isLoading && pathname.startsWith("/admin")) {
        router.replace("/admin-auth");
        return;
      }

      try {
        const role = user.role || "user";
        const allowedRoles = routeAccess[pathname];

        if (allowedRoles && !allowedRoles.includes(role)) {
          switch (role) {
            case "user":
              router.replace("/dashboard");
              break;
            case "blog_manager":
            case "blog_staff":
              router.replace("/admin/blog");
              break;
            case "seo_manager":
            case "seo_staff":
              router.replace("/admin/seo");
              break;
            case "football_manager":
            case "football_staff":
            case "basketball_manager":
            case "basketball_staff":
              router.replace("/admin/predictions");
              break;
            case "admin":
            default:
              router.replace("/admin");
              break;
          }
          return;
        }

        setAuthorized(true);
      } catch (err) {
        console.error(err);
        if (pathname !== "/admin-auth") {
          router.replace("/admin-auth");
          return;
        }
      } finally {
        setChecking(false);
      }
    };

    if(!isLoading) protectRoute();
  }, [pathname, isAuthenticated, user, isLoading]); // <-- add user and isLoading


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
