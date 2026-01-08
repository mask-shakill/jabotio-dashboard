import { create } from "zustand";

export interface ProductUpdatePayload {
  id: string;
  name?: string;
  price?: string;
  items?: string;
  old_price?: string;
  category?: string;
  descriptions?: string;
  tags?: string; // JSON string
  brand?: string;
  discount?: number;
  stock?: number;
  size?: string; // JSON string
  colors?: string; // JSON string
  warranty?: string;
  sold?: number;
  thumbnail_url?: string;
  image_url?: string; // JSON string or url string depends on backend
  thumbnail?: File;
  images?: File[];
}

interface UpdateStore {
  loading: boolean;
  error: string | null;
  updateProduct: (data: ProductUpdatePayload) => Promise<void>;
}

export const useUpdateProductStore = create<UpdateStore>((set) => ({
  loading: false,
  error: null,

  updateProduct: async (data) => {
    set({ loading: true, error: null });
    try {
      const formData = new FormData();

      if (data.name) formData.append("name", data.name);
      if (data.price) formData.append("price", data.price);
      if (data.items) formData.append("items", data.items);
      if (data.old_price) formData.append("old_price", data.old_price);
      if (data.category) formData.append("category", data.category);
      if (data.descriptions) formData.append("descriptions", data.descriptions);
      if (data.tags) formData.append("tags", data.tags);
      if (data.brand) formData.append("brand", data.brand);
      if (data.discount !== undefined)
        formData.append("discount", String(data.discount));
      if (data.stock !== undefined)
        formData.append("stock", String(data.stock));
      if (data.size) formData.append("size", data.size);
      if (data.colors) formData.append("colors", data.colors);
      if (data.warranty) formData.append("warranty", data.warranty);
      if (data.sold !== undefined) formData.append("sold", String(data.sold));
      if (data.thumbnail_url)
        formData.append("thumbnail_url", data.thumbnail_url);
      if (data.image_url) formData.append("image_url", data.image_url);

      if (data.thumbnail) formData.append("thumbnail", data.thumbnail);

      if (data.images && data.images.length > 0) {
        data.images.forEach((file) => {
          formData.append("images", file);
        });
      }

      const res = await fetch(`/api/products/update/${data.id}`, {
        method: "PATCH",
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to update product");

      set({ loading: false });
    } catch (err: any) {
      set({ error: err.message || "Product update failed", loading: false });
    }
  },
}));
