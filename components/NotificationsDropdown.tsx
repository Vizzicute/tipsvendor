"use client";

import React from "react";
import { Bell } from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "@/lib/appwrite/notifications";
import { useUserContext } from "@/context/AuthContext";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { userNotifications } from "@/lib/react-query/queries";

interface NotificationsDropdownProps {
  variant?:
    | "default"
    | "outline"
    | "ghost"
    | "link"
    | "destructive"
    | "secondary"
    | null
    | undefined;
    className?: string;
}

export default function NotificationsDropdown({
  variant,
  className,
}: NotificationsDropdownProps) {
  const { user } = useUserContext();
  const queryClient = useQueryClient();

  const { data: notifications, isLoading } = userNotifications(user.id);

  const markAsReadMutation = useMutation({
    mutationFn: markNotificationAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications", user.id] });
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: () => markAllNotificationsAsRead(user.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications", user.id] });
    },
  });

  const unreadCount = notifications?.filter((n) => !n.read).length || 0;

  const handleNotificationClick = (notificationId: string) => {
    markAsReadMutation.mutate(notificationId);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "new_comment":
        return "💬";
      case "new_subscription":
        return "💳";
      case "new_user":
        return "👤";
      case "subscription_expiring":
        return "⚠️";
      case "payment_received":
        return "💰";
      case "prediction_result":
        return "🎯";
      case "staff_assignment":
        return "👨‍💼";
      default:
        return "📢";
    }
  };

  const getNotificationLink = (type: string) => {
    switch (type) {
      case "new_comment":
        return "/admin/blog?tab=comments";
      case "new_subscription":
        return "/admin/users?tab=subscriptions";
      case "new_user":
        return "/admin/users";
      case "subscription_expiring":
        return "/admin/users?tab=subscriptions";
      case "payment_received":
        return "/admin/payments";
      case "prediction_result":
        return "/admin/predictions";
      case "staff_assignment":
        return "/admin/staff";
      default:
        return "#";
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size="icon" className={cn("relative", className)}>
          <Bell className="size-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-3 h-3 bg-red-500 rounded-full text-white text-[8px] text-center">
              {unreadCount.toString()}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notifications</span>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => markAllAsReadMutation.mutate()}
              className="text-xs"
            >
              Mark all as read
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {isLoading ? (
          <div className="p-4 text-center text-sm text-muted-foreground">
            Loading notifications...
          </div>
        ) : notifications?.length === 0 ? (
          <div className="p-4 text-center text-sm text-muted-foreground">
            No notifications
          </div>
        ) : (
          <div className="max-h-[300px] overflow-y-auto">
            {notifications?.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className={cn(
                  "flex flex-col items-start p-4 cursor-pointer",
                  !notification.read && "bg-muted"
                )}
                onClick={() => handleNotificationClick(notification.id)}
              >
                <div className="flex items-start gap-2">
                  <span className="text-lg">
                    {getNotificationIcon(notification.type)}
                  </span>
                  <div className="flex-1">
                    <p className="font-medium">{notification.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {notification.message}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {format(
                        new Date(notification.$createdAt),
                        "MMM d, h:mm a"
                      )}{" "}
                      {user.role !== "user" && (
                        <Link
                          href={`${getNotificationLink(notification.type)}`}
                          className="text-blue-400 hover:underline"
                        >
                          View {notification.title}
                        </Link>
                      )}
                    </p>
                  </div>
                </div>
              </DropdownMenuItem>
            ))}
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
