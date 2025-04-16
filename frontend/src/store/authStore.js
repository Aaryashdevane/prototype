import { create } from "zustand";

const useAuthStore = create((set) => ({
  user: null, // Stores the authenticated user
  token: null, // Stores the JWT token
  isAuthenticated: false, // Tracks authentication status

  // Login action
  login: (user, token) => {
    set({ user, token, isAuthenticated: true });
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", token);
  },  

  // Logout action
  logout: () => {
    set({ user: null, token: null, isAuthenticated: false });
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  },

  // Load user from localStorage
  loadUser: () => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const storedToken = localStorage.getItem("token");
    if (storedUser && storedToken) {
      set({ user: storedUser, token: storedToken, isAuthenticated: true });
    }
  },
}));

export default useAuthStore;