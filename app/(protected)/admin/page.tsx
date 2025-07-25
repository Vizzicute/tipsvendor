"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Doughnut, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
} from "chart.js";
import { Activity, CreditCard, Newspaper, Users } from "lucide-react";
import Link from "next/link";
import { useUserContext } from "@/context/AuthContext";
import { useBlogs, useSubscriptions, useUsers } from "@/lib/react-query/queries";

// Register ChartJS components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement
);

const AdminDashboard = () => {
  const { user } = useUserContext();

  const {
    data: users,
    isPending: isLoading,
    error,
  } = useUsers();

  const {
    data: subscriptions,
    isPending: isSubscriptionsLoading,
    error: subscriptionsError,
  } = useSubscriptions();

  const { data: blogs } = useBlogs();

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
          "rgba(231, 219, 199, 0.85)",
          "rgba(210, 180, 122, 0.85)",
          "rgba(166, 124, 82, 0.85)",
        ],
        borderColor: [
          "rgba(231, 219, 199, 1)",
          "rgba(210, 180, 122, 1)",
          "rgba(166, 124, 82, 1)",
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
      color: "text-slate-500",
      bgColor: "bg-slate-100",
    },
    {
      title: "Total Users",
      value: users?.filter((user) => user.role === "user").length || 0,
      icon: Users,
      href: "/admin/users",
      color: "text-cyan-500",
      bgColor: "bg-cyan-100",
    },
    {
      title: "Total Blog Posts",
      value: blogs?.length || 0,
      icon: Newspaper,
      href: "/admin/blog",
      color: "text-amber-500",
      bgColor: "bg-amber-100",
    },
    {
      title: "Total Staff",
      value: users?.filter((user) => user.role !== "user").length || 0,
      icon: Activity,
      href: "/admin/staffs",
      color: "text-stone-500",
      bgColor: "bg-stone-100",
    },
  ];

  const recentSubscriptions = subscriptions
    ?.sort((a, b) => {
      return (
        new Date(b.$createdAt).getTime() - new Date(a.$createdAt).getTime()
      );
    })
    .slice(0, 5);
  const recentUsers = users
    ?.sort(
      (a, b) =>
        new Date(b.$createdAt).getTime() - new Date(a.$createdAt).getTime()
    )
    .slice(0, 5);

  // Helper to get month labels from last year to now
  function getMonthLabels() {
    const labels = [];
    const now = new Date();
    const start = new Date(now.getFullYear() - 1, now.getMonth() + 1, 1); // next month last year
    for (let i = 0; i < 12; i++) {
      const date = new Date(start.getFullYear(), start.getMonth() + i, 1);
      labels.push(
        date.toLocaleString("default", { month: "short", year: "2-digit" })
      );
    }
    return labels;
  }

  const monthLabels = getMonthLabels();

  // Helper to count users/subscriptions per month
  interface HasCreatedAt {
    $createdAt: string;
    [key: string]: any;
  }

  function countPerMonth<T extends HasCreatedAt>(
    items: T[],
    dateField: keyof T = "$createdAt"
  ): number[] {
    const counts: number[] = Array(12).fill(0);
    const now = new Date();
    const start = new Date(now.getFullYear() - 1, now.getMonth() + 1, 1);
    items?.forEach((item) => {
      const date = new Date(item[dateField] as string);
      // Only count if in range
      if (date >= start && date <= now) {
        const monthDiff =
          (date.getFullYear() - start.getFullYear()) * 12 +
          (date.getMonth() - start.getMonth());
        if (monthDiff >= 0 && monthDiff < 12) {
          counts[monthDiff]++;
        }
      }
    });
    return counts;
  }

  const normalUsers = users?.filter((user) => user.role === "user");

  const usersPerMonth = countPerMonth(normalUsers || []);
  const subscriptionsPerMonth = countPerMonth(subscriptions || []);

  // Multi-axis line chart data
  const lineChartData = {
    labels: monthLabels,
    datasets: [
      {
        label: "Users Registered",
        data: usersPerMonth,
        yAxisID: "y-users",
        borderColor: "#64748b",
        backgroundColor: "rgba(100, 116, 139, 0.15)",
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: "#64748b",
      },
      {
        label: "Subscriptions",
        data: subscriptionsPerMonth,
        yAxisID: "y-subs",
        borderColor: "#78716c",
        backgroundColor: "rgba(120, 113, 108, 0.15)",
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: "#78716c",
      },
    ],
  };

  const lineChartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" as const },
      title: {
        display: true,
        text: "Monthly Users & Subscriptions (Past 12 Months)",
      },
    },
    scales: {
      "y-users": {
        type: "linear" as const,
        display: true,
        position: "left" as const,
        title: { display: true, text: "Users" },
        beginAtZero: true,
        grid: { drawOnChartArea: false },
      },
      "y-subs": {
        type: "linear" as const,
        display: true,
        position: "right" as const,
        title: { display: true, text: "Subscriptions" },
        beginAtZero: true,
        grid: { drawOnChartArea: false },
      },
    },
  };

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

      <Card className="w-full">
        <CardHeader>
          <CardTitle>Statistics Overview</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-row items-center justify-between space-x-4">
          <div className="h-[250px] w-fit flex items-center justify-center">
            <Doughnut
              data={chartData}
              options={chartOptions}
              className="w-full"
            />
          </div>
          <div className="h-[350px] flex flex-1 items-center justify-center p-1">
            <Line
              data={lineChartData}
              options={lineChartOptions}
              className="w-full"
            />
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
                    <p className="font-medium capitalize">
                      {subscription.subscriptionType}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {subscription.duration} Days Subscriptions
                    </p>
                  </div>
                  <div className="text-sm font-medium capitalize">
                    {subscription.status}
                  </div>
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
                    <p className="text-sm text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                  <div className="text-sm font-medium capitalize">
                    {user.role}
                  </div>
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
