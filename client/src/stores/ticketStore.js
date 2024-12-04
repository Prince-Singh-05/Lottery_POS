import { create } from "zustand";
import axios from "axios";

const useTicketStore = create((set) => ({
  tickets: localStorage.getItem("tickets")
    ? JSON.parse(localStorage.getItem("tickets"))
    : [],
  loading: false,
  error: null,

  // Fetch all tickets
  fetchTickets: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get("http://localhost:4000/api/ticket", {
        withCredentials: true,
      });
      set({ tickets: response.data, loading: false });
      localStorage.setItem("tickets", JSON.stringify(response.data));
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to fetch tickets",
        loading: false,
      });
    }
  },

  // Fetch tickets by shop
  fetchShopTickets: async (shopId) => {
    set({ loading: true });
    try {
      const response = await axios.get(
        `http://localhost:4000/api/shop/${shopId}`,
        { withCredentials: true }
      );
      set({ tickets: response.data, loading: false, error: null });
      localStorage.setItem("tickets", JSON.stringify(response.data));
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        loading: false,
      });
    }
  },

  // Buy a ticket
  buyTicket: async (ticketData) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post(
        "http://localhost:4000/api/ticket/buy",
        ticketData,
        { withCredentials: true }
      );
      set((state) => ({
        tickets: state.tickets.map((ticket) =>
          ticket._id === response.data._id
            ? { ...ticket, status: "sold" }
            : ticket
        ),
        loading: false,
      }));
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to purchase ticket",
        loading: false,
      });
      throw error;
    }
  },

  // Claim a ticket
  claimTicket: async (ticketId) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(
        `http://localhost:4000/api/ticket/claim/${ticketId}`,
        { withCredentials: true }
      );
      set((state) => ({
        tickets: state.tickets.map((ticket) =>
          ticket._id === ticketId ? { ...ticket, status: "claimed" } : ticket
        ),
        loading: false,
      }));
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to claim ticket",
        loading: false,
      });
      throw error;
    }
  },

  // Get available tickets
  getAvailableTickets: () => {
    return useTicketStore
      .getState()
      .tickets.filter((ticket) => ticket.status === "available");
  },

  // Get sold tickets
  getSoldTickets: () => {
    return useTicketStore
      .getState()
      .tickets.filter((ticket) => ticket.status === "sold");
  },

  // Get claimed tickets
  getClaimedTickets: () => {
    return useTicketStore
      .getState()
      .tickets.filter((ticket) => ticket.status === "claimed");
  },

  // Get expired tickets
  getExpiredTickets: () => {
    return useTicketStore
      .getState()
      .tickets.filter((ticket) => ticket.status === "expired");
  },

  // Clear error
  clearError: () => set({ error: null }),
}));

export default useTicketStore;
