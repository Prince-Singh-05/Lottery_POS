import { create } from "zustand";
import axios from "axios";
import toast from "react-hot-toast";

const useReportStore = create((set) => ({
  weeklyReport: null,
  loading: false,
  error: null,

  fetchWeeklyReport: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/ticket/weeklyReport`,
        { withCredentials: true }
      );
      set({ weeklyReport: response.data, loading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to fetch weekly report",
        loading: false,
      });
      toast.error(error.message);
    }
  },

  clearError: () => set({ error: null }),
}));

export default useReportStore;
