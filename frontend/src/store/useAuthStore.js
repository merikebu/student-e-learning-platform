import { create } from "zustand";
import axios from "axios";
import Cookies from "js-cookie";

const useAuthStore = create((set) => ({
  user: Cookies.get("user") ? safeParse(Cookies.get("user")) : null,

  setUser: (userData) => {
    Cookies.set("user", JSON.stringify(userData), { expires: 40, secure: true, sameSite: "Strict" });
    set({ user: userData });
  },

  login: async (credentials) => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", credentials, { withCredentials: true });
      const userData = res.data;
      Cookies.set("user", JSON.stringify(userData), { expires: 1, secure: true, sameSite: "Strict" });
      set({ user: userData });
    } catch (err) {
      console.error("Login error:", err);
    }
  },

  logout: () => {
    Cookies.remove("user");
    set({ user: null });
  },
}));

function safeParse(value) {
  try {
    return JSON.parse(value);
  } catch (error) {
    console.error("Invalid JSON in cookies:", error);
    Cookies.remove("user");
    return null;
  }
}

export default useAuthStore;