import { create } from "zustand";

interface LoginState {
  error: string | null;
  loading: boolean;
  userRole: string | null;

  login: (idToken: string) => Promise<void>;
  setError: (message: string | null) => void;
}

export const useLoginStore = create<LoginState>((set) => ({
  error: null,
  loading: false,
  userRole: null,

  setError: (message) => set({ error: message }),

  login: async (idToken) => {
    set({ loading: true, error: null, userRole: null });
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: idToken }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Login failed");
      }

      const data = await res.json();

      if (data.user.role === "admin") {
        set({ loading: false, error: null, userRole: "admin" });
      } else if (data.user.role === "user") {
        set({
          loading: false,
          error: "You are not authorized user please call admin.",
          userRole: "user",
        });
      } else {
        set({ loading: false, error: "Unknown role", userRole: null });
      }
    } catch (error: any) {
      set({
        loading: false,
        error: error.message || "Login failed",
        userRole: null,
      });
    }
  },
}));
