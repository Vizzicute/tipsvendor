"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, Users, TrendingUp, DollarSign } from "lucide-react";
import { format, subDays, startOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { useAnalyticsDoc } from "@/lib/react-query/queries";
import { sumCountsInRange } from "@/lib/utils/analyticsHelper";

function getDateRange(filter: string) {
  const now = new Date();
  switch (filter) {
    case "today":
      return { from: format(now, "yyyy-MM-dd"), to: format(now, "yyyy-MM-dd") };
    case "yesterday":
      const yest = subDays(now, 1);
      return { from: format(yest, "yyyy-MM-dd"), to: format(yest, "yyyy-MM-dd") };
    case "this-week":
      return {
        from: format(startOfWeek(now), "yyyy-MM-dd"),
        to: format(endOfWeek(now), "yyyy-MM-dd"),
      };
    case "last-week":
      const lastWeekStart = startOfWeek(subDays(now, 7));
      const lastWeekEnd = endOfWeek(subDays(now, 7));
      return {
        from: format(lastWeekStart, "yyyy-MM-dd"),
        to: format(lastWeekEnd, "yyyy-MM-dd"),
      };
    case "last-7-days":
      return {
        from: format(startOfDay(subDays(now, 7)), "yyyy-MM-dd"),
        to: format(now, "yyyy-MM-dd"),
      };
    case "this-month":
      return {
        from: format(startOfMonth(now), "yyyy-MM-dd"),
        to: format(endOfMonth(now), "yyyy-MM-dd"),
      };
    case "last-month":
      const lastMonth = subDays(startOfMonth(now), 1);
      return {
        from: format(startOfMonth(lastMonth), "yyyy-MM-dd"),
        to: format(endOfMonth(lastMonth), "yyyy-MM-dd"),
      };
    default:
      return { from: "1970-01-01", to: format(now, "yyyy-MM-dd") };
  }
}

function getTimeFilterLabel(filter: string) {
  switch (filter) {
    case "today": return "Today";
    case "yesterday": return "Yesterday";
    case "this-week": return "This Week";
    case "last-week": return "Last Week";
    case "last-7-days": return "Last 7 Days";
    case "this-month": return "This Month";
    case "last-month": return "Last Month";
    default: return "All Time";
  }
}

export default function AnalyticsPage() {
  const [predictionTimeFilter, setPredictionTimeFilter] = useState("all");
  const { data: analyticsDoc, isLoading } = useAnalyticsDoc();

  if (isLoading || !analyticsDoc) {
    return <div>Loading analytics...</div>;
  }

  // Date ranges
  const now = new Date();
  const thisMonth = {
    from: format(startOfMonth(now), "yyyy-MM-dd"),
    to: format(endOfMonth(now), "yyyy-MM-dd"),
  };

  // Subscription stats
  const totalSubscriptions = sumCountsInRange({
    jsonString: analyticsDoc.subscriptionCounts,
    fromDate: "1970-01-01",
    toDate: format(now, "yyyy-MM-dd"),
  });
  const thisMonthSubscriptions = sumCountsInRange({
    jsonString: analyticsDoc.subscriptionCounts,
    fromDate: thisMonth.from,
    toDate: thisMonth.to,
  });

  // User stats
  const totalUsers = sumCountsInRange({
    jsonString: analyticsDoc.userCounts,
    fromDate: "1970-01-01",
    toDate: format(now, "yyyy-MM-dd"),
  });
  const newUsersThisMonth = sumCountsInRange({
    jsonString: analyticsDoc.userCounts,
    fromDate: thisMonth.from,
    toDate: thisMonth.to,
  });

  // Blog stats
  const totalBlogs = sumCountsInRange({
    jsonString: analyticsDoc.blogCounts,
    fromDate: "1970-01-01",
    toDate: format(now, "yyyy-MM-dd"),
  });
  const blogsThisMonth = sumCountsInRange({
    jsonString: analyticsDoc.blogCounts,
    fromDate: thisMonth.from,
    toDate: thisMonth.to,
  });

  // Prediction stats
  const { from, to } = getDateRange(predictionTimeFilter);
  const totalPredictions = sumCountsInRange({
    jsonString: analyticsDoc.predictionCounts,
    fromDate: from,
    toDate: to,
  });
  const winPredictions = sumCountsInRange({
    jsonString: analyticsDoc.predictionWinCounts,
    fromDate: from,
    toDate: to,
  });
  const lossPredictions = sumCountsInRange({
    jsonString: analyticsDoc.predictionLossCounts,
    fromDate: from,
    toDate: to,
  });
  const winRate = totalPredictions
    ? ((winPredictions / totalPredictions) * 100).toFixed(1)
    : "0";

  // Revenue (if you store it as a daily JSON field)
  const totalRevenue = sumCountsInRange({
    jsonString: analyticsDoc.revenueCounts,
    fromDate: "1970-01-01",
    toDate: format(now, "yyyy-MM-dd"),
  });
  const thisMonthRevenue = sumCountsInRange({
    jsonString: analyticsDoc.revenueCounts,
    fromDate: thisMonth.from,
    toDate: thisMonth.to,
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Analytics Dashboard</h1>
        <div className="text-sm text-muted-foreground">
          Last updated: {format(new Date(), "PPP")}
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              +${thisMonthRevenue.toFixed(2)} this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Subscriptions</CardTitle>
            <CreditCard className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSubscriptions}</div>
            <p className="text-xs text-muted-foreground">
              +{thisMonthSubscriptions} this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              +{newUsersThisMonth} this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Prediction Win Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{winRate}%</div>
            <p className="text-xs text-muted-foreground">
              {winPredictions} wins / {totalPredictions} total
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Subscription Stats */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Subscription Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Total</span>
                <span className="text-sm text-green-500">{totalSubscriptions}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">This Month</span>
                <span className="text-sm text-blue-500">{thisMonthSubscriptions}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* User Stats */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>User Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Total Users</span>
                <span className="text-sm">{totalUsers}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">New This Month</span>
                <span className="text-sm text-green-500">+{newUsersThisMonth}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Prediction Stats */}
        <Card className="col-span-1">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Prediction Performance</CardTitle>
            <Select value={predictionTimeFilter} onValueChange={setPredictionTimeFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Select time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="yesterday">Yesterday</SelectItem>
                <SelectItem value="this-week">This Week</SelectItem>
                <SelectItem value="last-week">Last Week</SelectItem>
                <SelectItem value="last-7-days">Last 7 Days</SelectItem>
                <SelectItem value="this-month">This Month</SelectItem>
                <SelectItem value="last-month">Last Month</SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Total Predictions</span>
                <span className="text-sm">{totalPredictions}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Wins</span>
                <span className="text-sm text-green-500">{winPredictions}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Losses</span>
                <span className="text-sm text-red-500">{lossPredictions}</span>
              </div>
              <div className="pt-2">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full" 
                    style={{ width: `${winRate}%` }}
                  />
                </div>
                <p className="text-xs text-center mt-1">Win Rate: {winRate}%</p>
              </div>
              <div className="text-xs text-muted-foreground text-center">
                Showing stats for {getTimeFilterLabel(predictionTimeFilter)}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Blog Stats */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Blog Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Total Posts</span>
                <span className="text-sm">{totalBlogs}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">This Month</span>
                <span className="text-sm text-green-500">{blogsThisMonth}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}