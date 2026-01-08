export interface ProductPayload {
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
  thumbnail: File | null;
  images: File[];
}
