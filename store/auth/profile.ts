import { create } from "zustand";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  location?: string;
  address?: string;
  image_url?: string;
  avatar?: File | null;
  role: string;
}

interface ProfileState {
  user: UserProfile | null;
  loading: boolean;
  error: string | null;
  fetchProfile: () => Promise<void>;
  updateProfile: (updateData: FormData) => Promise<void>;
  logout: () => Promise<void>;
}

export const useProfileStore = create<ProfileState>((set) => ({
  user: null,
  loading: false,
  error: null,

  fetchProfile: async () => {
    set({ loading: true, error: null });
    try {
      const res = await fetch("/api/auth/user-me");
      if (!res.ok) throw new Error("Failed to fetch profile");
      const data = await res.json();
      set({ user: data.user, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  updateProfile: async (updateData: FormData) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch("/api/auth/update", {
        method: "PATCH",
        body: updateData,
      });
      if (!res.ok) throw new Error("Failed to update profile");
      const data = await res.json();
      set({ user: data.user, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  logout: async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      set({ user: null });
    } catch {
      set({ error: "Logout failed" });
    }
  },
}));
