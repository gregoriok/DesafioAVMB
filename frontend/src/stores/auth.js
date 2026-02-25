import { defineStore } from "pinia";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: localStorage.getItem("token") || null
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    institutionName: (state) => state.institution?.name || "",
  },

  actions: {
    setAuth(token, institution) {
      this.token = token;
      this.institution = institution;
      localStorage.setItem("token", token);
      localStorage.setItem("institution", JSON.stringify(institution));
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    },

    clearAuth() {
      this.token = null;
      this.institution = null;
      localStorage.removeItem("token");
      localStorage.removeItem("institution");
      delete axios.defaults.headers.common["Authorization"];
    },

    async login(email, password) {
      try {
        const response = await axios.post(`${API_URL}/api/auth/login`, {
          email,
          senha: password,
        });
        this.setAuth(response.data.token, response.data.institution);
        return { success: true };
      } catch (error) {
        return {
          success: false,
          message: error.response?.data?.message || "Erro ao fazer login",
        };
      }
    },

    async register(name, email, password) {
      try {
        const response = await axios.post(`${API_URL}/api/auth/register`, {
          nome: name,
          email,
          senha: password,
        });
        this.setAuth(response.data.token, response.data.institution);
        return { success: true };
      } catch (error) {
        return {
          success: false,
          message: error.response?.data?.message || "Erro ao registrar",
        };
      }
    },

    logout() {
      this.clearAuth();
    },
  },
});
