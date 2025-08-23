/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, CardContent } from "@/components/ui/card";
import { useGetReportQuery } from "@/redux/features/admin/admin.api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";


const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const AnalyticsReport = () => {
    const {data} = useGetReportQuery(undefined);
    // console.log(data?.data?.totalUsers);
  // Prepare data for charts
  const rideStatusData = [
    { name: "Completed", value: data?.data?.completedRides },
    { name: "Ongoing", value: data?.data?.ongoingRides },
    { name: "Total Rides", value: data?.data?.totalRides - data?.data?.completedRides },
  ];

  const userData = [
    { name: "Users", value: data?.data?.totalUsers },
    { name: "Drivers", value: data?.data?.totalDrivers },
  ];

  const earningsData = [
    { month: "Jan", earnings: data?.data?.totalEarnings },
  ];

  return (
    <div className="container mx-auto space-y-6 p-4">
      <h1 className="text-2xl font-bold mb-4">Analytics Dashboard</h1>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="text-center p-4">
          <CardContent>
            <h2 className="text-lg font-semibold">Total Users</h2>
            <p className="text-2xl font-bold">{data?.data?.totalUsers}</p>
          </CardContent>
        </Card>
        <Card className="text-center p-4">
          <CardContent>
            <h2 className="text-lg font-semibold">Total Drivers</h2>
            <p className="text-2xl font-bold">{data?.data?.totalDrivers}</p>
          </CardContent>
        </Card>
        <Card className="text-center p-4">
          <CardContent>
            <h2 className="text-lg font-semibold">Total Rides</h2>
            <p className="text-2xl font-bold">{data?.data?.totalRides}</p>
          </CardContent>
        </Card>
        <Card className="text-center p-4">
          <CardContent>
            <h2 className="text-lg font-semibold">Total Earnings</h2>
            <p className="text-2xl font-bold">${data?.data?.totalEarnings}</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart for ride status */}
        <Card>
          <CardContent>
            <h2 className="text-lg font-semibold mb-4">Ride Status Overview</h2>
            <BarChart width={400} height={300} data={rideStatusData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </CardContent>
        </Card>

        {/* Pie Chart for user vs drivers */}
        <Card>
          <CardContent>
            <h2 className="text-lg font-semibold mb-4">Users vs Drivers</h2>
            <PieChart width={400} height={300}>
              <Pie
                data={userData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#82ca9d"
                label
              >
                {userData.map((_entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </CardContent>
        </Card>

        {/* Line Chart for earnings */}
        <Card className="lg:col-span-2">
          <CardContent>
            <h2 className="text-lg font-semibold mb-4">Revenue Trend</h2>
            <BarChart width={800} height={300} data={earningsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="earnings" fill="#ff7300" />
            </BarChart>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsReport;
