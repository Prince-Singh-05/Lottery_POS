import { create } from "zustand";
import axios from "axios";

const TICKET_TYPES = ["Daily Draws", "Weekly Draws", "Monthly Draws"];

const useTicketTypeStore = create((set, get) => ({
  ticketTypes: [],
  loading: false,
  error: null,
  availableTypes: TICKET_TYPES,

  // Fetch all ticket types
  fetchTicketTypes: async () => {
    set({ loading: true });
    try {
      const response = await axios.get(
        "http://localhost:4000/api/ticket/ticket-types",
        { withCredentials: true }
      );
      set({ ticketTypes: response.data, loading: false, error: null });
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        loading: false,
      });
    }
  },

  // Create new ticket type
  createTicketType: async (ticketTypeData) => {
    set({ loading: true });
    try {
      if (!TICKET_TYPES.includes(ticketTypeData.name)) {
        throw new Error("Invalid ticket type name");
      }

      const response = await axios.post(
        "http://localhost:4000/api/ticket/createTicketType",
        ticketTypeData,
        { withCredentials: true }
      );
      set((state) => ({
        ticketTypes: [...state.ticketTypes, response.data],
        loading: false,
        error: null,
      }));
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        loading: false,
      });
      throw error;
    }
  },

  // Allocate tickets to shop
  allocateTickets: async (allocation) => {
    set({ loading: true });
    try {
      const response = await axios.post(
        "http://localhost:4000/api/ticket/allocateTickets",
        allocation,
        { withCredentials: true }
      );
      set({ loading: false, error: null });
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        loading: false,
      });
      throw error;
    }
  },

  // Get allocated tickets by shop
  getShopAllocations: async (shopId) => {
    set({ loading: true });
    try {
      const response = await axios.get(
        `http://localhost:4000/api/ticket-types/shop/${shopId}`,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        loading: false,
      });
      throw error;
    }
  },

  // Get default expiry duration based on ticket type
  getDefaultExpiryDuration: (typeName) => {
    switch (typeName) {
      case "Daily Draws":
        return 1; // 1 day
      case "Weekly Draws":
        return 7; // 7 days
      case "Monthly Draws":
        return 30; // 30 days
      default:
        return 1;
    }
  },

  // Clear error
  clearError: () => set({ error: null }),
}));

export default useTicketTypeStore;
