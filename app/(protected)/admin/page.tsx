"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
} from "chart.js";
import { useQuery } from "@tanstack/react-query";
import { getUsers, getSubscriptions, getBlog } from "@/lib/appwrite/fetch";
import { Activity, CreditCard, Newspaper, Users } from "lucide-react";
import Link from "next/link";
import { useUserContext } from "@/context/AuthContext";

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale);

const AdminDashboard = () => {
  const { user } = useUserContext();

  const {
    data: users,
    isPending: isLoading,
    error,
  } = useQuery({
    queryKey: ["documents"],
    queryFn: getUsers,
  });

  const {
    data: subscriptions,
    isPending: isSubscriptionsLoading,
    error: subscriptionsError,
  } = useQuery({
    queryKey: ["subscriptions"],
    queryFn: getSubscriptions,
  });

  const {
    data: blogs
  } = useQuery({
    queryKey: ["blogs"],
    queryFn: getBlog,
  });

  // Calculate statistics
  const totalUsers = users?.filter((user) => user.role === "user").length || 0;
  const totalStaff = users?.filter((user) => user.role !== "user").length || 0;
  const totalSubscriptions = subscriptions?.length || 0;

  const chartData = {
    labels: ["Users", "Staff", "Subscriptions"],
    datasets: [
      {
        data: [totalUsers, totalStaff, totalSubscriptions],
        backgroundColor: [
          "rgba(54, 162, 235, 0.8)",
          "rgba(255, 99, 132, 0.8)",
          "rgba(75, 192, 192, 0.8)",
        ],
        borderColor: [
          "rgba(54, 162, 235, 1)",
          "rgba(255, 99, 132, 1)",
          "rgba(75, 192, 192, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom" as const,
      },
      title: {
        display: true,
        text: "System Statistics",
      },
    },
  };

  if (isLoading || isSubscriptionsLoading) {
    return <div>Loading...</div>;
  }

  if (error || subscriptionsError) {
    return <div>Error loading data</div>;
  }

  const stats = [
    {
      title: "Total Subscriptions",
      value: subscriptions?.length || 0,
      icon: CreditCard,
      href: "/admin/users?tab=subscriptions",
      color: "text-blue-500",
      bgColor: "bg-blue-100",
    },
    {
      title: "Total Users",
      value: users?.filter(user => user.role === "user").length || 0,
      icon: Users,
      href: "/admin/users",
      color: "text-green-500",
      bgColor: "bg-green-100",
    },
    {
      title: "Total Blog Posts",
      value: blogs?.length || 0,
      icon: Newspaper,
      href: "/admin/blog",
      color: "text-purple-500",
      bgColor: "bg-purple-100",
    },
    {
      title: "Total Staff",
      value: users?.filter(user => user.role !== "user").length || 0,
      icon: Activity,
      href: "/admin/staffs",
      color: "text-orange-500",
      bgColor: "bg-orange-100",
    },
  ];

  const recentSubscriptions = subscriptions?.slice(0, 5);
  const recentUsers = users?.sort((a, b) => new Date(b.$createdAt).getTime() - new Date(a.$createdAt).getTime()).slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <div className="text-sm text-muted-foreground">
          Welcome back, {user?.name}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {stats.map((stat) => (
          <Link key={stat.title} href={stat.href}>
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <Card className="w-1/2">
        <CardHeader>
          <CardTitle>Statistics Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            <Doughnut data={chartData} options={chartOptions} />
          </div>
        </CardContent>
      </Card>

      

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Subscriptions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentSubscriptions?.map((subscription) => (
                <div
                  key={subscription.$id}
                  className="flex items-center justify-between border-b pb-2"
                >
                  <div>
                    <p className="font-medium capitalize">{subscription.subscriptionType}</p>
                    <p className="text-sm text-muted-foreground">{subscription.duration} Days Subscriptions</p>
                  </div>
                  <div className="text-sm font-medium capitalize">{subscription.status}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentUsers?.map((user) => (
                <div
                  key={user.$id}
                  className="flex items-center justify-between border-b pb-2"
                >
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                  <div className="text-sm font-medium capitalize">{user.role}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
