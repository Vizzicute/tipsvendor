"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, Users, TrendingUp, DollarSign } from "lucide-react";
import { format, subDays, startOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, isToday, isYesterday } from "date-fns";
import { truncate } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { countryDiscounts } from "@/lib/config/countryDiscount";
import { getExchangeRate, calculateSubscriptionPrice as calcPriceUtil } from "@/lib/utils/exchangeRates";
import { useBlogs, usePredictions, useSubscriptions, useUsers } from "@/lib/react-query/queries";


function getCurrency(country: string) {
  switch (country?.toLowerCase()) {
    case "nigeria": return "NGN";
    case "ghana": return "GHS";
    case "kenya": return "KES";
    case "cameroon": return "XAF";
    case "south africa": return "ZAR";
    case "uganda": return "UGX";
    default: return "USD";
  }
}

// Use the exchangeRates util for price calculation
function getDiscountedPriceUSD(sub: any) {

  const currency = getCurrency(sub.user?.country || "USD");
  let price = calcPriceUtil(30, sub.subscriptionType, sub.duration, "USD");
  const discount = sub.user?.country ? countryDiscounts[sub.user.country?.toLowerCase()] || 0 : 0;
  if (discount > 0) {
    price = price - price * discount;
  }
  // Convert to USD using exchange rate
  const rate = getExchangeRate(currency) || 1;
  const priceInUSD = currency === "USD" ? price : price / rate;
  return priceInUSD;
}

// Calculate earnings in USD using exchange rate logic and discount
const calculateEarningsUSD = (subscriptions: any[]) => {
  return subscriptions.reduce((total, sub) => {
    return total + getDiscountedPriceUSD(sub);
  }, 0);
};

export default function AnalyticsPage() {
  const [predictionTimeFilter, setPredictionTimeFilter] = useState("all");

  const { data: subscriptions } = useSubscriptions();

  const { data: users } = useUsers();

  const { data: blogs } = useBlogs();

  const { data: predictions } = usePredictions();

  // Calculate subscription stats
  const allSubscriptions = subscriptions || [];
  const activeSubscriptions = subscriptions?.filter(sub => sub.isValid) || [];
  const expiredSubscriptions = subscriptions?.filter(sub => !sub.isValid) || [];
  const subscriptionTypes = subscriptions?.reduce((acc, sub) => {
    acc[sub.subscriptionType] = (acc[sub.subscriptionType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  const totalEarnings = calculateEarningsUSD(allSubscriptions);
  const thisMonthEarnings = calculateEarningsUSD(
    allSubscriptions.filter(sub => {
      const subDate = new Date(sub.$createdAt);
      const now = new Date();
      return subDate.getMonth() === now.getMonth() && subDate.getFullYear() === now.getFullYear();
    })
  );

  // Calculate user stats
  const regularUsers = users?.filter(user => user.role === "user") || [];
  const staffUsers = users?.filter(user => user.role !== "user") || [];
  const newUsersThisMonth = regularUsers.filter(user => {
    const userDate = new Date(user.$createdAt);
    const now = new Date();
    return userDate.getMonth() === now.getMonth() && userDate.getFullYear() === now.getFullYear();
  });

  // Filter predictions based on time filter
  const getFilteredPredictions = () => {
    if (!predictions) return [];
    
    const now = new Date();
    const lastWeekStart = startOfWeek(subDays(now, 7));
    const lastWeekEnd = endOfWeek(subDays(now, 7));
    const thisWeekStart = startOfWeek(now);
    const thisWeekEnd = endOfWeek(now);
    const lastMonthStart = startOfMonth(subDays(now, 30));
    const lastMonthEnd = endOfMonth(subDays(now, 30));
    const thisMonthStart = startOfMonth(now);
    const thisMonthEnd = endOfMonth(now);
    const last7DaysStart = startOfDay(subDays(now, 7));

    return predictions.filter(pred => {
      const predDate = new Date(pred.$createdAt);
      
      switch (predictionTimeFilter) {
        case "today":
          return isToday(predDate);
        case "yesterday":
          return isYesterday(predDate);
        case "this-week":
          return predDate >= thisWeekStart && predDate <= thisWeekEnd;
        case "last-week":
          return predDate >= lastWeekStart && predDate <= lastWeekEnd;
        case "last-7-days":
          return predDate >= last7DaysStart && predDate <= now;
        case "this-month":
          return predDate >= thisMonthStart && predDate <= thisMonthEnd;
        case "last-month":
          return predDate >= lastMonthStart && predDate <= lastMonthEnd;
        default:
          return true;
      }
    });
  };

  const filteredPredictions = getFilteredPredictions();
  const winPredictions = filteredPredictions.filter(pred => pred.status === "win");
  const lossPredictions = filteredPredictions.filter(pred => pred.status === "loss");
  const winRate = filteredPredictions.length ? (winPredictions.length / filteredPredictions.length * 100).toFixed(1) : 0;

  // Calculate blog stats
  const publishedBlogs = blogs?.filter(blog => blog.status === "published") || [];
  const draftBlogs = blogs?.filter(blog => blog.status === "draft") || [];

  const getTimeFilterLabel = () => {
    switch (predictionTimeFilter) {
      case "today": return "Today";
      case "yesterday": return "Yesterday";
      case "this-week": return "This Week";
      case "last-week": return "Last Week";
      case "last-7-days": return "Last 7 Days";
      case "this-month": return "This Month";
      case "last-month": return "Last Month";
      default: return "All Time";
    }
  };

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
            <div className="text-2xl font-bold">${totalEarnings.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              +${thisMonthEarnings.toFixed(2)} this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
            <CreditCard className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeSubscriptions.length}</div>
            <p className="text-xs text-muted-foreground">
              {((activeSubscriptions.length / (subscriptions?.length || 1)) * 100).toFixed(1)}% of total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{regularUsers.length}</div>
            <p className="text-xs text-muted-foreground">
              +{newUsersThisMonth.length} this month
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
              {winPredictions.length} wins / {filteredPredictions.length} total
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
                <span className="text-sm font-medium">Active</span>
                <span className="text-sm text-green-500">{activeSubscriptions.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Expired</span>
                <span className="text-sm text-red-500">{expiredSubscriptions.length}</span>
              </div>
              <div className="pt-4">
                <h4 className="text-sm font-medium mb-2">Subscription Types</h4>
                {Object.entries(subscriptionTypes).map(([type, count]) => (
                  <div key={type} className="flex items-center justify-between mb-1">
                    <span className="text-xs capitalize">{type}</span>
                    <span className="text-xs">{count}</span>
                  </div>
                ))}
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
                <span className="text-sm font-medium">Regular Users</span>
                <span className="text-sm">{regularUsers.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Staff Members</span>
                <span className="text-sm">{staffUsers.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">New This Month</span>
                <span className="text-sm text-green-500">+{newUsersThisMonth.length}</span>
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
                <span className="text-sm">{filteredPredictions.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Wins</span>
                <span className="text-sm text-green-500">{winPredictions.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Losses</span>
                <span className="text-sm text-red-500">{lossPredictions.length}</span>
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
                Showing stats for {getTimeFilterLabel()}
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
                <span className="text-sm font-medium">Published Posts</span>
                <span className="text-sm text-green-500">{publishedBlogs.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Draft Posts</span>
                <span className="text-sm text-yellow-500">{draftBlogs.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Total Posts</span>
                <span className="text-sm">{blogs?.length || 0}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...(subscriptions || []), ...(users || []), ...(blogs || [])]
                .sort((a, b) => new Date(b.$createdAt).getTime() - new Date(a.$createdAt).getTime())
                .slice(0, 5)
                .map((item) => (
                  <div key={item.$id} className="flex items-center justify-between border-b pb-2">
                    <div>
                      <p className="font-medium">
                        {truncate(item.subscriptionType || item.name || item.title, 25)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(item.$createdAt), "PPP")}
                      </p>
                    </div>
                    <div className="text-sm font-medium capitalize">
                      {item.subscriptionType ? "New Subscription" : 
                       item.title ? "New Blog Post" : "New User"}
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}