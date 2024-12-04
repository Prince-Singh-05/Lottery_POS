import { create } from "zustand";
import axios from "axios";
import toast from "react-hot-toast";

const useShopStore = create((set) => ({
  shops: [],
  loading: false,
  error: null,

  // Fetch all shops (for admin)
  fetchAllShops: async () => {
    set({ loading: true });
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/shop`,
        { withCredentials: true }
      );
      set({ shops: response.data, loading: false, error: null });
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        loading: false,
      });
      toast.error(error.message);
    }
  },

  // Fetch shops for current shop owner
  fetchMyShops: async () => {
    set({ loading: true });
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/shop/my-shops`,
        {
          withCredentials: true,
        }
      );
      set({ shops: response.data, loading: false, error: null });
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        loading: false,
      });
      toast.error(error.message);
    }
  },

  // Register new shop
  registerShop: async (shopData) => {
    set({ loading: true });
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/shop/register`,
        shopData,
        {
          withCredentials: true,
        }
      );
      set((state) => ({
        shops: [...state.shops, response.data],
        loading: false,
        error: null,
      }));
      toast.success("Shop registered successfully");
      return response.data;
    } catch (error) {
      toast.error("Failed to register shop");
      set({
        error: error.response?.data?.message || error.message,
        loading: false,
      });
      throw error;
    }
  },

  // Clear error
  clearError: () => set({ error: null }),
}));

export default useShopStore;
