import { create } from "zustand";
import axios from "axios";

const useReportStore = create((set) => ({
  weeklyReport: null,
  loading: false,
  error: null,

  fetchWeeklyReport: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get("http://localhost:4000/api/ticket/weeklyReport", {
        withCredentials: true,
      });
      set({ weeklyReport: response.data, loading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to fetch weekly report",
        loading: false,
      });
    }
  },

  clearError: () => set({ error: null }),
}));

export default useReportStore;
