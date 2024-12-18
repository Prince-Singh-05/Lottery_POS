import { create } from "zustand";
import axios from "axios";
import toast from "react-hot-toast";

const useUserStore = create((set) => ({
  user: localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null,
  loading: false,
  error: null,

  // Login user
  login: async (credentials) => {
    set({ loading: true });
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/user/login`,
        credentials,
        { withCredentials: true }
      );
      const userData = response.data;

      // Ensure role is set
      if (!["admin", "shop_owner", "customer"].includes(userData.role)) {
        throw new Error("Invalid user role");
      }

      set({ user: userData, loading: false, error: null });
      localStorage.setItem("user", JSON.stringify(userData));
      toast.success("Logged in successfully");
      return userData;
    } catch (error) {
      toast.error("Failed to login");
      set({
        error: error.response?.data?.message || error.message,
        loading: false,
      });
      throw error;
    }
  },

  // Register user
  register: async (userData) => {
    set({ loading: true });
    try {
      if (!["admin", "shop_owner", "customer"].includes(userData.role)) {
        throw new Error("Invalid user role");
      }

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/user/signup`,
        userData,
        { withCredentials: true }
      );
      set({ user: response.data, loading: false, error: null });
      localStorage.setItem("user", JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        loading: false,
      });
      throw error;
    }
  },

  // Logout user
  logout: () => {
    try {
      set({ user: null, error: null });
      localStorage.removeItem("user");
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error(error.message);
      set({ error: error.message });
      throw error;
    }
  },

  // Check if user has specific role
  hasRole: (role) => {
    const user = useUserStore.getState().user;
    return user?.role === role;
  },

  // Clear error
  clearError: () => set({ error: null }),
}));

export default useUserStore;
