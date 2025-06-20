"use client";

import React, { useState } from "react";
import { Button } from "./ui/button";
import { Loader2, Menu, User, User2 } from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { INITIAL_USER, useUserContext } from "@/context/AuthContext";
import { useSignOutAccount } from "@/lib/react-query/queriesAndMutations";
import { redirect } from "next/navigation";
import Sidebar from "./Sidebar";
import NotificationsDropdown from "./NotificationsDropdown";

const DashboardLayout = ({children}: {children: React.ReactNode;}) => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const togglesidebar = () => setSidebarOpen(!sidebarOpen);
    const { mutateAsync: signOutAccount, isPending } = useSignOutAccount();
    const { user, setUser, setIsAuthenticated, isLoading } = useUserContext();

    const handleSignout = async () => {
        signOutAccount();
        setIsAuthenticated(false);
        setUser(INITIAL_USER);
        redirect("/admin-auth");
    };

    const roleColors: Record<string, string> = {
        admin: "bg-green-500",
        football_manager: "bg-blue-500",
        basketball_manager: "bg-slate-500",
        football_staff: "bg-yellow-500",
        basketball_staff: "bg-red-500",
    };

    const roleBadgeColor = user
        ? roleColors[user.role] || "bg-stone-500"
        : "bg-gray-500";

    return (
        <>
            <Sidebar open={sidebarOpen} />
            <div
                className={`flex-1 transition-all duration-300 ${
                    sidebarOpen ? "ml-56" : "ml-20"
                }`}
            >
                <header className="bg-white shadow-sm z-10">
                    <div className="flex items-center justify-between px-4 py-3 border-b">
                        <div className="flex items-center">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={togglesidebar}
                                className="mr-2"
                            >
                                <Menu className="h-5 w-5" />
                            </Button>
                            <h1 className="text-2xl font-bold text-primary">
                                Tips<span className="text-secondary">vendor</span>
                            </h1>
                        </div>

                        <div className="flex items-center gap-2">
                            <NotificationsDropdown variant={"ghost"} />

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        className="relative flex items-center space-x-2"
                                    >
                                        <Avatar className="h-8 w-8">
                                            {user.imageUrl ? <AvatarImage src={user?.imageUrl} /> : <User2/>}
                                            <AvatarFallback><User2/></AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col items-start">
                                            <span className="text-sm font-medium">{user?.name}</span>
                                            <div className="flex items-center">
                                                <span
                                                    className={`w-2 h-2 ${roleBadgeColor} rounded-full mr-1`}
                                                ></span>
                                                <span className="text-xs text-gray-500 capitalize">
                                                    {user?.role}
                                                </span>
                                            </div>
                                        </div>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem>
                                        <Link href={"/admin/profile"} className="flex flex-nowrap items-center">
                                            <User className="mr-2 h-4 w-4" />
                                            <span>Profile</span>
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={handleSignout}>
                                        {isLoading && <Loader2 className="animate-spin"/>}
                                        Logout
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </header>

                <main className="p-6">
                    {children}
                </main>
            </div>
        </>
    );
};

export default DashboardLayout;
