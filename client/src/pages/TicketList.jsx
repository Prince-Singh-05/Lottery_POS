import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useTicketStore from "../stores/ticketStore";
import useUserStore from "../stores/userStore";
import { Button } from "../components/ui/button";

const TicketList = () => {
  const navigate = useNavigate();
  const { tickets, loading, error, fetchTickets, buyTicket } =
    useTicketStore();
  const { user } = useUserStore();

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
    fetchTickets();
  }, [user, navigate]);

  const handlePurchase = async (ticketId) => {
    try {
      await buyTicket({
        ticketId
      });
      // Refresh tickets after purchase
      fetchTickets();
    } catch (error) {
      console.error("Purchase error:", error);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );

  if (error)
    return <div className="text-red-500 text-center p-4">Error: {error}</div>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Available Tickets</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tickets
          .filter((ticket) => ticket.status === "available")
          .map((ticket) => (
            <div
              key={ticket._id}
              className="bg-white rounded-lg shadow-md p-6 transition-transform hover:scale-105"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold">
                    Ticket #{ticket.ticketNumber}
                  </h3>
                  <p className="text-gray-600">{ticket.description}</p>
                </div>
                <span className="text-green-600 font-bold">
                  ${ticket.price}
                </span>
              </div>

              <div className="mt-4">
                <p className="text-sm text-gray-500 mb-2">
                  Expiry Date:{" "}
                  {new Date(ticket.expiryDate).toLocaleDateString()}
                </p>
                {user.role === "customer" && (
                  <Button
                    onClick={() => handlePurchase(ticket._id)}
                    className="w-full"
                  >
                    Purchase Ticket
                  </Button>
                )}
              </div>
            </div>
          ))}
      </div>

      {tickets.filter((ticket) => ticket.status === "available").length ===
        0 && (
        <div className="text-center text-gray-500 mt-8">
          No tickets available at the moment.
        </div>
      )}
    </div>
  );
};

export default TicketList;
