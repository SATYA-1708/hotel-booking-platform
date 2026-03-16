import { useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "react-query";
import * as apiClient from "../api-client";
import type { BookingType } from "../../../shared/types";
import PageContainer from "../components/PageContainer";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  TrendingUp,
  IndianRupee,
  CalendarRange,
  Percent,
  ArrowLeft,
  Loader2,
} from "lucide-react";

const STATUS_COLORS: Record<string, string> = {
  confirmed: "#16a34a",
  pending: "#eab308",
  completed: "#2563eb",
  cancelled: "#dc2626",
  refunded: "#6b7280",
};

const MONTH_FMT = new Intl.DateTimeFormat("en-IN", {
  month: "short",
  year: "2-digit",
});

const OwnerHotelAnalytics = () => {
  const { hotelId } = useParams<{ hotelId: string }>();

  const { data: hotel, isLoading: hotelLoading } = useQuery(
    ["fetchMyHotelById", hotelId],
    () => apiClient.fetchMyHotelById(hotelId as string),
    { enabled: !!hotelId },
  );

  const { data: bookings, isLoading: bookingsLoading } = useQuery<BookingType[]>(
    ["fetchHotelBookings", hotelId],
    () => apiClient.fetchHotelBookings(hotelId as string),
    { enabled: !!hotelId },
  );

  const stats = useMemo(() => {
    const list = bookings || [];
    const active = list.filter((b) => b.status !== "cancelled");

    const totalRevenue = active.reduce(
      (sum, b) => sum + (b.totalCost || 0),
      0,
    );

    const now = new Date();
    const upcoming = list.filter(
      (b) =>
        new Date(b.checkIn) >= now &&
        b.status !== "cancelled" &&
        b.status !== "refunded",
    ).length;

    // Occupancy proxy: nights sold over last 90 days vs capacity
    const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
    const recentNights = active
      .filter((b) => new Date(b.checkOut) >= ninetyDaysAgo)
      .reduce((sum, b) => {
        const start = Math.max(
          new Date(b.checkIn).getTime(),
          ninetyDaysAgo.getTime(),
        );
        const end = Math.min(new Date(b.checkOut).getTime(), now.getTime());
        return (
          sum +
          Math.max(0, Math.ceil((end - start) / (1000 * 60 * 60 * 24)))
        );
      }, 0);
    const occupancyRate = Math.min(
      100,
      Math.round((recentNights / 90) * 100),
    );

    // Revenue by month (last 12 months)
    const byMonth = new Map<string, number>();
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      byMonth.set(`${d.getFullYear()}-${d.getMonth()}`, 0);
    }
    for (const b of active) {
      const d = new Date(b.createdAt || b.checkIn);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      if (byMonth.has(key)) {
        byMonth.set(key, (byMonth.get(key) || 0) + (b.totalCost || 0));
      }
    }
    const revenueByMonth = Array.from(byMonth.entries()).map(
      ([key, value]) => {
        const [year, month] = key.split("-").map(Number);
        return {
          month: MONTH_FMT.format(new Date(year, month, 1)),
          revenue: value,
        };
      },
    );

    // Status breakdown
    const statusData = Object.entries(
      list.reduce<Record<string, number>>((acc, b) => {
        const s = b.status || "pending";
        acc[s] = (acc[s] || 0) + 1;
        return acc;
      }, {}),
    ).map(([name, value]) => ({ name, value }));

    return {
      totalBookings: list.length,
      totalRevenue,
      upcoming,
      occupancyRate,
      revenueByMonth,
      statusData,
      avgBookingValue: list.length ? Math.round(totalRevenue / list.length) : 0,
    };
  }, [bookings]);

  if (hotelLoading || bookingsLoading) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center min-h-[300px]">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      </PageContainer>
    );
  }

  const kpis = [
    {
      label: "Total Revenue",
      value: `₹${stats.totalRevenue.toLocaleString("en-IN")}`,
      icon: <IndianRupee className="w-5 h-5" />,
      accent: "text-green-600 bg-green-50",
    },
    {
      label: "Total Bookings",
      value: String(stats.totalBookings),
      icon: <CalendarRange className="w-5 h-5" />,
      accent: "text-blue-600 bg-blue-50",
    },
    {
      label: "Upcoming Stays",
      value: String(stats.upcoming),
      icon: <TrendingUp className="w-5 h-5" />,
      accent: "text-purple-600 bg-purple-50",
    },
    {
      label: "Occupancy (90d)",
      value: `${stats.occupancyRate}%`,
      icon: <Percent className="w-5 h-5" />,
      accent: "text-orange-600 bg-orange-50",
    },
  ];

  return (
    <PageContainer>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <Link to="/my-hotels">
            <Button variant="ghost" size="sm" className="mb-1 -ml-2">
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to My Hotels
            </Button>
          </Link>
          <h1 className="text-2xl md:text-3xl font-medium text-gray-800">
            Analytics{hotel?.name ? ` — ${hotel.name}` : ""}
          </h1>
          <p className="text-gray-500">
            Revenue, occupancy and booking health for this property
          </p>
        </div>

        {/* KPI cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpis.map((kpi) => (
            <Card key={kpi.label} className="shadow-md border border-gray-100">
              <CardContent className="p-5 flex items-center gap-4">
                <span
                  className={`p-3 rounded-xl ${kpi.accent}`}
                >
                  {kpi.icon}
                </span>
                <div>
                  <p className="text-sm text-gray-500">{kpi.label}</p>
                  <p className="text-xl font-medium text-gray-800">
                    {kpi.value}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Revenue chart */}
        <Card className="shadow-lg border border-gray-100">
          <CardContent className="p-6">
            <h2 className="font-medium text-gray-700 mb-1">
              Revenue by Month
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              Booking value created per month (last 12 months)
            </p>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={stats.revenueByMonth}>
                <defs>
                  <linearGradient id="revFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                />
                <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                <Tooltip
                  formatter={(value) => [
                    `₹${Number(value).toLocaleString("en-IN")}`,
                    "Revenue",
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#2563eb"
                  strokeWidth={2}
                  fill="url(#revFill)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Status breakdown */}
          <Card className="shadow-lg border border-gray-100">
            <CardContent className="p-6">
              <h2 className="font-medium text-gray-700 mb-4">
                Booking Status Split
              </h2>
              {stats.statusData.length === 0 ? (
                <p className="text-sm text-gray-500 py-10 text-center">
                  No bookings yet.
                </p>
              ) : (
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie
                      data={stats.statusData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={55}
                      outerRadius={90}
                      paddingAngle={3}
                    >
                      {stats.statusData.map((entry) => (
                        <Cell
                          key={entry.name}
                          fill={STATUS_COLORS[entry.name] || "#94a3b8"}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          {/* Averages */}
          <Card className="shadow-lg border border-gray-100">
            <CardContent className="p-6 space-y-4">
              <h2 className="font-medium text-gray-700">At a Glance</h2>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
                  <span className="text-gray-600">Average booking value</span>
                  <span className="font-medium text-gray-800">
                    ₹{stats.avgBookingValue.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
                  <span className="text-gray-600">Price per night</span>
                  <span className="font-medium text-gray-800">
                    ₹{(hotel?.pricePerNight ?? 0).toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
                  <span className="text-gray-600">Star rating</span>
                  <span className="font-medium text-gray-800">
                    {hotel?.starRating ?? "—"}★
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
                  <span className="text-gray-600">Guest rating</span>
                  <span className="font-medium text-gray-800">
                    {(hotel?.averageRating ?? 0).toFixed(1)}/5
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
};

export default OwnerHotelAnalytics;
