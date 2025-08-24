/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useMemo, useState } from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useGetEarningHistoryQuery } from "@/redux/features/driver/driver.api";

const EarningsDashboard = () => {
  const { data, isLoading } = useGetEarningHistoryQuery(undefined);
  const [view, setView] = useState<"daily" | "weekly" | "monthly">("daily");

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const rides = data?.data?.rides || [];
  const totalEarnings = data?.data?.totalEarnings || 0;
  const totalRides = data?.data?.totalRides || 0;

  const aggregatedData = useMemo(() => {
    if (!rides.length) return [];

    if (view === "daily") {
      const daily: Record<string, number> = {};
      rides.forEach((ride: any) => {
        const day = new Date(ride.createdAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });
        daily[day] = (daily[day] || 0) + ride.fare;
      });
      return Object.entries(daily).map(([name, earnings]) => ({
        name,
        earnings,
      }));
    }

    if (view === "weekly") {
      const weekly: Record<string, number> = {};
      rides.forEach((ride: any) => {
        const date = new Date(ride.createdAt);
        const week = `Week ${Math.ceil(date.getDate() / 7)}`;
        weekly[week] = (weekly[week] || 0) + ride.fare;
      });
      return Object.entries(weekly).map(([name, earnings]) => ({
        name,
        earnings,
      }));
    }

    if (view === "monthly") {
      const monthly: Record<string, number> = {};
      rides.forEach((ride: any) => {
        const month = new Date(ride.createdAt).toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        });
        monthly[month] = (monthly[month] || 0) + ride.fare;
      });
      return Object.entries(monthly).map(([name, earnings]) => ({
        name,
        earnings,
      }));
    }

    return [];
  }, [rides, view]);

  if (isLoading) return <p>Loading earnings...</p>;

  return (
    <div className="space-y-6">
      {/* Stats cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Earnings</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold text-green-600">
            ${totalEarnings}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Rides</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">{totalRides}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Average Fare</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            ${totalRides > 0 ? (totalEarnings / totalRides).toFixed(2) : 0}
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <Card className="p-4 shadow-xl rounded-2xl">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Earnings ({view})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            <Button
              variant={view === "daily" ? "default" : "outline"}
              onClick={() => setView("daily")}
            >
              Daily
            </Button>
            <Button
              variant={view === "weekly" ? "default" : "outline"}
              onClick={() => setView("weekly")}
            >
              Weekly
            </Button>
            <Button
              variant={view === "monthly" ? "default" : "outline"}
              onClick={() => setView("monthly")}
            >
              Monthly
            </Button>
          </div>

          <ResponsiveContainer width="100%" height={350}>
            {view === "daily" ? (
              <LineChart data={aggregatedData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="earnings" stroke="#2563eb" strokeWidth={3} />
              </LineChart>
            ) : (
              <BarChart data={aggregatedData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="earnings" fill="#10b981" radius={[8, 8, 0, 0]} />
              </BarChart>
            )}
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default EarningsDashboard;
