import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import useTicketStore from "../stores/ticketStore";
import useUserStore from "../stores/userStore";
import { Button } from "../components/ui/button";
import useReportStore from "../stores/reportStore";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useUserStore();
  const { tickets, loading, error, fetchTickets } = useTicketStore();

  useEffect(() => {
    fetchTickets();
  }, []);

  const navigateToTickets = () => {
    if (user.role === "customer") {
      navigate("/tickets");
    } else if (user.role === "shop_owner") {
      navigate("/shop/tickets");
    } else if (user.role === "admin") {
      navigate("/admin/tickets");
    }
  };

  const purchasedTickets = tickets
    .filter((ticket) => ticket.status === "sold" && ticket.soldTo === user._id)
    .slice(0, 5);
  const claimedTickets = tickets
    .filter(
      (ticket) => ticket.status === "claimed" && ticket.claimedBy === user._id
    )
    .slice(0, 5);

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );

  if (error)
    return <div className="text-red-500 text-center p-4">Error: {error}</div>;

  return (
    <div className="space-y-6 max-w-[100vw] overflow-x-hidden px-4 md:px-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {/* Welcome Section */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Welcome, {user.name}!</CardTitle>
          <CardDescription>
            You are logged in as {user.role.replace("_", " ")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4"
          >
            <Button
              onClick={navigateToTickets}
              className="w-full"
              variant="default"
            >
              {user.role === "customer"
                ? "Buy Tickets"
                : user.role === "shop_owner"
                ? "View My Tickets"
                : "Manage Tickets"}
            </Button>

            {user.role === "admin" && (
              <Button
                onClick={() => navigate("/admin/ticket-types")}
                className="w-full"
                variant="outline"
              >
                Manage Ticket Types
              </Button>
            )}

            {user.role === "shop_owner" && (
              <>
                <Button
                  onClick={() => navigate("/shop/manage")}
                  className="w-full"
                  variant="outline"
                >
                  Manage Shops
                </Button>
                <Button
                  onClick={() => navigate("/shop/weekly-report")}
                  className="w-full"
                  variant="outline"
                >
                  Weekly Report
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Recent Activity</CardTitle>
            <CardDescription>Last 24 hours</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="bg-gray-50 p-2 rounded">
                <p className="text-gray-600">Total Tickets</p>
                <p className="font-semibold">{tickets?.length || 0}</p>
              </div>
              <div className="bg-gray-50 p-2 rounded">
                <p className="text-gray-600">Active Tickets</p>
                <p className="font-semibold">
                  {tickets?.filter((t) => t.status === "active").length || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {user.role === "customer" && (
          <>
            <Card className="sm:col-span-1">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">My Purchased Tickets</CardTitle>
                <CardDescription>
                  Recently bought tickets which you have not claimed
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {purchasedTickets.map((ticket) => (
                    <div
                      key={ticket._id}
                      className="p-2 bg-secondary rounded-lg"
                    >
                      <div className="font-medium">
                        {ticket.ticketType.name}
                        {" #"}
                        {ticket.ticketNumber}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Price: ${ticket.ticketType.price} | Purchased:{" "}
                        {new Date(ticket.updatedAt).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="sm:col-span-1">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">My Claimed Tickets</CardTitle>
                <CardDescription>Recently claimed tickets</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {claimedTickets.map((ticket) => (
                    <div
                      key={ticket._id}
                      className="p-2 bg-secondary rounded-lg"
                    >
                      <div className="font-medium">
                        {ticket.ticketType.name}
                        {" #"}
                        {ticket.ticketNumber}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Price: ${ticket.ticketType.price} | Claimed:{" "}
                        {new Date(ticket.updatedAt).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {user.role === "shop_owner" && (
          <Card className="sm:col-span-1">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Shop Management</CardTitle>
              <CardDescription>Quick actions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button
                  onClick={() => navigate("/shop/manage")}
                  className="w-full"
                  variant="outline"
                >
                  View Shop Details
                </Button>
                <Button
                  onClick={() => navigate("/shop/weekly-report")}
                  className="w-full"
                  variant="outline"
                >
                  View Weekly Report
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {user.role === "admin" && (
          <Card className="sm:col-span-1">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Admin Controls</CardTitle>
              <CardDescription>Quick actions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button
                  onClick={() => navigate("/admin/tickets")}
                  className="w-full"
                  variant="outline"
                >
                  Manage Tickets
                </Button>
                <Button
                  onClick={() => navigate("/admin/ticket-types")}
                  className="w-full"
                  variant="outline"
                >
                  Manage Ticket Types
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
