import { create } from "zustand";

interface DeleteProductState {
  loading: boolean;
  error: string | null;
  deleteProduct: (id: string) => Promise<void>;
}

export const useDeleteProductStore = create<DeleteProductState>((set) => ({
  loading: false,
  error: null,

  deleteProduct: async (id) => {
    set({ loading: true, error: null });

    try {
      const res = await fetch(`/api/products/delete/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to delete product");
      }

      set({ loading: false });
    } catch (error: any) {
      set({
        error: error.message || "Failed to delete product",
        loading: false,
      });
    }
  },
}));
