import { create } from "zustand";

export interface Product {
  id: string;
  name: string;
  price: string;
  items: string;
  old_price: string;
  category: string;
  descriptions: string;
  tags: string; // JSON string
  brand: string;
  discount: number;
  stock: number;
  size: string; // JSON string
  colors: string; // JSON string
  warranty: string;
  sold: number;
  thumbnail_url: string;
  image_url: string[]; // list of image URLs
  [key: string]: any; // extra fields if any
}

interface ProductStore {
  products: Product[];
  loading: boolean;
  error: string | null;
  product: Product | null;

  fetchAllProducts: () => Promise<void>;
  fetchProductById: (id: string) => Promise<void>;
}

export const useProductStore = create<ProductStore>((set) => ({
  products: [],
  loading: false,
  error: null,
  product: null,

  fetchAllProducts: async () => {
    set({ loading: true, error: null });
    try {
      const res = await fetch("/api/products/all");
      if (!res.ok) throw new Error("Failed to fetch products");
      const data = await res.json();
      set({ products: data.products, loading: false });
    } catch (err: any) {
      set({ error: err.message || "Error fetching products", loading: false });
    }
  },

  fetchProductById: async (id: string) => {
    set({ loading: true, error: null, product: null });
    try {
      const res = await fetch(`/api/products/${id}`);
      if (!res.ok) throw new Error("Failed to fetch product");
      const data = await res.json();
      set({ product: data.product, loading: false });
    } catch (err: any) {
      set({ error: err.message || "Error fetching product", loading: false });
    }
  },
}));
