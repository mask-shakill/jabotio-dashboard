import { create } from "zustand";

export interface ProductPayload {
  name: string;
  price: string;
  items: string;
  old_price: string;
  category: string;
  descriptions: string;
  tags: string; // stringify JSON
  brand: string;
  discount: number;
  stock: number;
  size: string; // stringify JSON
  colors: string; // stringify JSON
  warranty: string;
  sold: number;
  thumbnail?: File | null;
  images: File[];
}

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
      formData.append("discount", data.discount.toString());
      formData.append("stock", data.stock.toString());
      formData.append("size", data.size);
      formData.append("colors", data.colors);
      formData.append("warranty", data.warranty);
      formData.append("sold", data.sold.toString());

      if (data.thumbnail) formData.append("thumbnail", data.thumbnail);

      data.images.forEach((file) => {
        formData.append("images", file);
      });

      const res = await fetch("/api/products/create", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to create product");
      }

      set({ loading: false });
    } catch (error: any) {
      set({ error: error.message || "Product create failed", loading: false });
    }
  },
}));
