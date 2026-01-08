"use client";

import React, { useState, useEffect } from "react";
import {
  useCreateProductStore,
  ProductPayload,
} from "@/store/products/uploadStore";
import { useRouter } from "next/navigation";

export default function ProductUploadPage() {
  const { createProduct, loading, error } = useCreateProductStore();
  const router = useRouter();

  const [formData, setFormData] = useState<ProductPayload>({
    name: "",
    price: "",
    items: "",
    old_price: "",
    category: "",
    descriptions: "",
    tags: "[]",
    brand: "",
    discount: 0,
    stock: 0,
    size: "[]",
    colors: "[]",
    warranty: "",
    sold: 0,
    thumnails: null,
    images: [],
  });

  const [thumbPreview, setThumbPreview] = useState<string | null>(null);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  useEffect(() => {
    if (formData.thumnails) {
      const url = URL.createObjectURL(formData.thumnails);
      setThumbPreview(url);

      return () => URL.revokeObjectURL(url);
    } else {
      setThumbPreview(null);
    }
  }, [formData.thumnails]);

  useEffect(() => {
    if (formData.images.length > 0) {
      const urls = formData.images.map((file) => URL.createObjectURL(file));
      setImagePreviews(urls);

      return () => {
        urls.forEach((url) => URL.revokeObjectURL(url));
      };
    } else {
      setImagePreviews([]);
    }
  }, [formData.images]);

  function handleInputChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function handleNumberChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    const numberValue = parseInt(value, 10);
    setFormData((prev) => ({
      ...prev,
      [name]: isNaN(numberValue) ? 0 : numberValue,
    }));
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, files } = e.target;
    if (!files) return;

    if (name === "thumnails") {
      setFormData((prev) => ({ ...prev, thumnails: files[0] }));
    } else if (name === "images") {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...Array.from(files)],
      }));
    }
  }

  function handleJSONChange(field: keyof ProductPayload, jsonString: string) {
    // Basic validation (optional)
    try {
      JSON.parse(jsonString);
      setFormData((prev) => ({ ...prev, [field]: jsonString }));
    } catch {
      // ignore invalid JSON
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    await createProduct(formData);

    if (!error) {
      router.push("/all-products");
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Upload Product</h1>

      <form onSubmit={onSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="Name"
          required
          className="input-field"
        />

        <input
          type="text"
          name="price"
          value={formData.price}
          onChange={handleInputChange}
          placeholder="Price"
          required
          className="input-field"
        />

        <input
          type="text"
          name="items"
          value={formData.items}
          onChange={handleInputChange}
          placeholder="Items"
          className="input-field"
        />

        <input
          type="text"
          name="old_price"
          value={formData.old_price}
          onChange={handleInputChange}
          placeholder="Old Price"
          className="input-field"
        />

        <input
          type="text"
          name="category"
          value={formData.category}
          onChange={handleInputChange}
          placeholder="Category"
          className="input-field"
        />

        <textarea
          name="descriptions"
          value={formData.descriptions}
          onChange={handleInputChange}
          placeholder="Descriptions"
          className="input-field"
        />

        <input
          type="text"
          name="tags"
          value={formData.tags}
          onChange={(e) => handleJSONChange("tags", e.target.value)}
          placeholder='Tags (JSON array like ["tag1", "tag2"])'
          className="input-field"
        />

        <input
          type="text"
          name="brand"
          value={formData.brand}
          onChange={handleInputChange}
          placeholder="Brand"
          className="input-field"
        />

        <input
          type="number"
          name="discount"
          value={formData.discount}
          onChange={handleNumberChange}
          placeholder="Discount"
          className="input-field"
          min={0}
        />

        <input
          type="number"
          name="stock"
          value={formData.stock}
          onChange={handleNumberChange}
          placeholder="Stock"
          className="input-field"
          min={0}
        />

        <input
          type="text"
          name="size"
          value={formData.size}
          onChange={(e) => handleJSONChange("size", e.target.value)}
          placeholder='Size (JSON array like ["S", "M", "L"])'
          className="input-field"
        />

        <input
          type="text"
          name="colors"
          value={formData.colors}
          onChange={(e) => handleJSONChange("colors", e.target.value)}
          placeholder='Colors (JSON array like ["red", "green"])'
          className="input-field"
        />

        <input
          type="text"
          name="warranty"
          value={formData.warranty}
          onChange={handleInputChange}
          placeholder="Warranty"
          className="input-field"
        />

        <input
          type="number"
          name="sold"
          value={formData.sold}
          onChange={handleNumberChange}
          placeholder="Sold"
          className="input-field"
          min={0}
        />

        <label className="block">
          Thumbnail:
          <input
            type="file"
            name="thumnails"
            accept="image/*"
            onChange={handleFileChange}
            className="mt-1"
          />
          {thumbPreview && (
            <img
              src={thumbPreview}
              alt="Thumbnail Preview"
              className="mt-2 max-h-40"
            />
          )}
        </label>

        <label className="block">
          Images:
          <input
            type="file"
            name="images"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            className="mt-1"
          />
          <div className="flex gap-2 mt-2 flex-wrap">
            {imagePreviews.map((src, i) => (
              <img
                key={i}
                src={src}
                alt={`Image Preview ${i}`}
                className="max-h-40"
              />
            ))}
          </div>
        </label>

        {error && <p className="text-red-600">{error}</p>}

        <button type="submit" disabled={loading} className="btn-primary mt-4">
          {loading ? "Uploading..." : "Upload"}
        </button>
      </form>
    </div>
  );
}
