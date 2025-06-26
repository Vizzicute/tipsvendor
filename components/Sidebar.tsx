"use client";

import { cn } from "@/lib/utils";
import {
  Home,
  Settings,
  User,
  Activity,
  Gamepad,
  Newspaper,
  Users,
  ChartNoAxesCombined,
  Wallet,
  Mail,
} from "lucide-react";
import { UserRole } from "@/types";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Logo from "./Logo";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import MiniLogo from "./MiniLogo";
import { useCurrentUser } from "@/lib/react-query/queries";

interface SidebarProps {
  open: boolean;
}

interface SidebarItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  roles: UserRole[];
}

const Sidebar = ({ open }: SidebarProps) => {
  const { data: user } = useCurrentUser();
  const pathname = usePathname();

  const sidebarItems: SidebarItem[] = [
    {
      name: "Dashboard",
      href: "/admin",
      icon: Home,
      roles: ["admin"],
    },
    {
      name: "Predictions",
      href: "/admin/predictions",
      icon: Gamepad,
      roles: [
        "admin",
        "football_manager",
        "basketball_manager",
        "football_staff",
        "basketball_staff",
      ],
    },
    {
      name: "Blog",
      href: "/admin/blog",
      icon: Newspaper,
      roles: ["admin", "blog_manager", "blog_staff"],
    },
    {
      name: "SEO",
      href: "/admin/seo",
      icon: Activity,
      roles: ["admin", "seo_manager"],
    },
    {
      name: "Users",
      href: "/admin/users",
      icon: User,
      roles: ["admin"],
    },
    {
      name: "Staffs",
      href: "/admin/staffs",
      icon: Users,
      roles: ["admin"],
    },
    {
      name: "Wallet",
      href: "/admin/wallet",
      icon: Wallet,
      roles: ["admin"],
    },
    {
      name: "Analytics",
      href: "/admin/analytics",
      icon: ChartNoAxesCombined,
      roles: ["admin"],
    },
    {
      name: "Mail",
      href: "/admin/mail",
      icon: Mail,
      roles: ["admin"],
    },
    {
      name: "Settings",
      href: "/admin/settings",
      icon: Settings,
      roles: ["admin"],
    },
  ];

  const filteredItems = user?.role
    ? sidebarItems.filter((item) => item.roles.includes(user.role as UserRole))
    : [];

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-screen bg-primary text-white transition-all duration-300",
        open ? "w-56" : "w-20"
      )}
    >
      <div className="flex items-center justify-center h-16 border-b border-gray-600">
        {open ? <Logo /> : <MiniLogo />}
      </div>

      <nav className="mt-6">
        <ul className="space-y-2 px-4">
          {filteredItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <li key={item.name}>
                {open ? (
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center px-4 py-2 rounded-md transition-colors",
                      isActive
                        ? "bg-secondary text-white"
                        : "text-white/80 hover:bg-secondary/50 hover:text-white"
                    )}
                  >
                    <item.icon className="h-5 w-5 mr-3" />
                    <span>{item.name}</span>
                  </Link>
                ) : (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        href={item.href}
                        className={cn(
                          "flex items-center px-4 py-3 rounded-md transition-colors",
                          isActive
                            ? "bg-secondary text-white"
                            : "text-white/80 hover:bg-secondary/50 hover:text-white"
                        )}
                      >
                        <item.icon className="h-5 w-5 mx-auto" />
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent className="bg-secondary/90 text-primary">
                      {item.name}
                    </TooltipContent>
                  </Tooltip>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
