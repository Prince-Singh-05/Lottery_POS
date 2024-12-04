import React, { useEffect } from "react";
import useReportStore from "../../stores/reportStore";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";

const WeeklyReport = () => {
  const { weeklyReport, loading, error, fetchWeeklyReport } = useReportStore();

  useEffect(() => {
    fetchWeeklyReport();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center p-4">Error: {error}</div>;
  }

  if (!weeklyReport) {
    return <div>No report data available.</div>;
  }

  return (
    <div className="space-y-6 max-w-[100vw] overflow-x-hidden px-0 sm:px-4 md:px-6">
      <h1 className="text-2xl font-bold">Weekly Report</h1>

      {/* Overall Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Revenue</CardTitle>
            <CardDescription>Past 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-bold text-green-600">
              ${weeklyReport.summary.totalRevenue.toFixed(2)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Payouts</CardTitle>
            <CardDescription>Past 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-bold text-red-600">
              ${weeklyReport.summary.totalPayouts.toFixed(2)}
            </p>
          </CardContent>
        </Card>

        <Card className="sm:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Net Profit</CardTitle>
            <CardDescription>Past 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-bold text-blue-600">
              ${weeklyReport.summary.netProfit.toFixed(2)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Shop Statistics */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Shop Statistics</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {weeklyReport.shopStats.map((shop) => (
            <Card key={shop.shopId} className="overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Shop #{shop.shopId}</CardTitle>
                <CardDescription>Individual shop performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="bg-gray-50 p-2 rounded">
                      <p className="text-gray-600">Total Tickets</p>
                      <p className="font-semibold">{shop.totalTickets}</p>
                    </div>
                    <div className="bg-gray-50 p-2 rounded">
                      <p className="text-gray-600">Revenue</p>
                      <p className="font-semibold text-green-600">
                        ${shop.revenue.toFixed(2)}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-2 rounded">
                      <p className="text-gray-600">Payouts</p>
                      <p className="font-semibold text-red-600">
                        ${shop.payouts.toFixed(2)}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-2 rounded">
                      <p className="text-gray-600">Net Profit</p>
                      <p className="font-semibold text-blue-600">
                        ${shop.netProfit.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Ticket Status Breakdown */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Ticket Status</h2>
        <div className="grid grid-cols-1 gap-4">
          {weeklyReport.ticketStats.map((stat) => (
            <Card key={stat._id}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg capitalize">{stat._id}</CardTitle>
                <CardDescription>
                  Total: {stat.totalCount} | Amount: $
                  {stat.totalAmount.toFixed(2)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {stat.shops.map((shop) => (
                    <div
                      key={shop.shop}
                      className="bg-gray-50 p-3 rounded text-sm"
                    >
                      <p className="text-gray-600 mb-1">Shop #{shop.shop}</p>
                      <div className="flex justify-between">
                        <span>Count: {shop.count}</span>
                        <span className="font-medium">
                          ${shop.totalAmount.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Claimed Tickets */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Claimed Tickets</h2>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Claims Overview</CardTitle>
            <CardDescription>
              Total Claims: {weeklyReport.claimedTickets.total} | Amount: $
              {weeklyReport.claimedTickets.totalAmount.toFixed(2)}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {weeklyReport.claimedTickets.byShop.map((shop) => (
                <div key={shop.shop}>
                  <h3 className="font-medium mb-2">Shop #{shop.shop}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                    <div className="bg-gray-50 p-2 rounded text-sm">
                      <p className="text-gray-600">Total Claimed</p>
                      <p className="font-medium">{shop.totalClaimed}</p>
                    </div>
                    <div className="bg-gray-50 p-2 rounded text-sm">
                      <p className="text-gray-600">Total Amount</p>
                      <p className="font-medium">
                        ${shop.totalWinningAmount.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <div className="inline-block min-w-full">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                        {shop.claimedTickets.map((ticket) => (
                          <div
                            key={ticket.ticketNumber}
                            className="bg-gray-50 p-2 rounded text-sm"
                          >
                            <div className="flex justify-between mb-1">
                              <span>#{ticket.ticketNumber}</span>
                              <span className="font-medium">
                                ${ticket.winningAmount.toFixed(2)}
                              </span>
                            </div>
                            <p className="text-gray-600 text-xs">
                              {new Date(ticket.claimedAt).toLocaleDateString()}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Report Period */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Report Period</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
            <div className="bg-gray-50 p-2 rounded">
              <p className="text-gray-600">From</p>
              <p className="font-medium">
                {new Date(weeklyReport.period.start).toLocaleDateString()}
              </p>
            </div>
            <div className="bg-gray-50 p-2 rounded">
              <p className="text-gray-600">To</p>
              <p className="font-medium">
                {new Date(weeklyReport.period.end).toLocaleDateString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WeeklyReport;
