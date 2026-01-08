import { create } from "zustand";
import { ProductPayload } from "@/types/product";

interface ProductState {
  loading: boolean;
  error: string | null;
  createProduct: (data: ProductPayload) => Promise<void>;
}

export const useCreateProductStore = create<ProductState>((set) => ({
  loading: false,
  error: null,

  createProduct: async (data) => {
    set({ loading: true, error: null });

    try {
      const formData = new FormData();

      formData.append("name", data.name);
      formData.append("price", data.price);
      formData.append("items", data.items);
      formData.append("old_price", data.old_price);
      formData.append("category", data.category);
      formData.append("descriptions", data.descriptions);
      formData.append("tags", data.tags);
      formData.append("brand", data.brand);
      formData.append("discount", String(data.discount));
      formData.append("stock", String(data.stock));
      formData.append("size", data.size);
      formData.append("colors", data.colors);
      formData.append("warranty", data.warranty);
      formData.append("sold", String(data.sold));

      if (data.thumnails) {
        formData.append("thumnails", data.thumnails);
      }

      data.images.forEach((file) => {
        formData.append("images", file);
      });

      const res = await fetch("/api/products/create", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to create product");

      set({ loading: false });
    } catch (err) {
      set({ error: "Product create failed", loading: false });
    }
  },
}));
