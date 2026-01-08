"use client";

import { useState } from "react";
import { useCreateProductStore } from "@/store/products/createStore";
import { ProductPayload } from "@/types/product";

export default function CreateProductPage() {
  const { createProduct, loading } = useCreateProductStore();

  const [form, setForm] = useState<ProductPayload>({
    name: "",
    price: "",
    items: "",
    old_price: "",
    category: "",
    descriptions: "",
    tags: "",
    brand: "",
    discount: 0,
    stock: 0,
    size: "",
    colors: "",
    warranty: "",
    sold: 0,
    thumnails: null,
    images: [],
  });

  const [thumbPreview, setThumbPreview] = useState<string | null>(null);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">Create Product</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          "name",
          "price",
          "old_price",
          "items",
          "category",
          "brand",
          "warranty",
        ].map((field) => (
          <input
            key={field}
            name={field}
            placeholder={field}
            className="border p-2 rounded"
            onChange={handleChange}
          />
        ))}

        <input
          name="discount"
          type="number"
          placeholder="discount"
          className="border p-2"
          onChange={handleChange}
        />
        <input
          name="stock"
          type="number"
          placeholder="stock"
          className="border p-2"
          onChange={handleChange}
        />
        <input
          name="sold"
          type="number"
          placeholder="sold"
          className="border p-2"
          onChange={handleChange}
        />

        <textarea
          name="descriptions"
          placeholder="descriptions"
          className="border p-2 col-span-3"
          onChange={handleChange}
        />
        <textarea
          name="tags"
          placeholder="tags (JSON)"
          className="border p-2 col-span-3"
          onChange={handleChange}
        />
        <textarea
          name="size"
          placeholder="size (JSON)"
          className="border p-2 col-span-3"
          onChange={handleChange}
        />
        <textarea
          name="colors"
          placeholder="colors (JSON)"
          className="border p-2 col-span-3"
          onChange={handleChange}
        />
      </div>

      {/* Thumbnail */}
      <div className="mt-6">
        <p className="mb-2">Thumbnail</p>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            setForm({ ...form, thumnails: file });
            setThumbPreview(URL.createObjectURL(file));
          }}
        />
        {thumbPreview && (
          <img src={thumbPreview} className="w-32 mt-2 rounded" />
        )}
      </div>

      {/* Images */}
      <div className="mt-6">
        <p className="mb-2">Images</p>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => {
            const files = Array.from(e.target.files || []);
            setForm({ ...form, images: files });
            setImagePreviews(files.map((f) => URL.createObjectURL(f)));
          }}
        />
        <div className="flex gap-2 mt-2 flex-wrap">
          {imagePreviews.map((src, i) => (
            <img key={i} src={src} className="w-24 h-24 object-cover rounded" />
          ))}
        </div>
      </div>

      <button
        disabled={loading}
        onClick={() => createProduct(form)}
        className="mt-6 px-6 py-2 bg-black text-white rounded"
      >
        {loading ? "Creating..." : "Create Product"}
      </button>
    </div>
  );
}
