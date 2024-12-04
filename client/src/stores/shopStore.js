import { create } from 'zustand';
import axios from 'axios';

const useShopStore = create((set) => ({
  shops: [],
  loading: false,
  error: null,

  // Fetch all shops (for admin)
  fetchAllShops: async () => {
    set({ loading: true });
    try {
      const response = await axios.get('http://localhost:4000/api/shop', {
        withCredentials: true
      });
      set({ shops: response.data, loading: false, error: null });
    } catch (error) {
      set({ error: error.response?.data?.message || error.message, loading: false });
    }
  },

  // Fetch shops for current shop owner
  fetchMyShops: async () => {
    set({ loading: true });
    try {
      const response = await axios.get('http://localhost:4000/api/shop/my-shops', {
        withCredentials: true
      });
      set({ shops: response.data, loading: false, error: null });
    } catch (error) {
      set({ error: error.response?.data?.message || error.message, loading: false });
    }
  },

  // Register new shop
  registerShop: async (shopData) => {
    set({ loading: true });
    try {
      const response = await axios.post('http://localhost:4000/api/shop/register', shopData, {
        withCredentials: true
      });
      set(state => ({
        shops: [...state.shops, response.data],
        loading: false,
        error: null
      }));
      return response.data;
    } catch (error) {
      set({ error: error.response?.data?.message || error.message, loading: false });
      throw error;
    }
  },

  // Clear error
  clearError: () => set({ error: null })
}));

export default useShopStore;
