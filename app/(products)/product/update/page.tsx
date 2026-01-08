"use client";

import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useUpdateProductStore } from "@/store/products/updateStore";
import { useProductStore } from "@/store/products/findStore";
import { useRouter } from "next/navigation";

interface UpdateProductPageProps {
  params: {
    id: string;
  };
}

const UpdateProductPage: React.FC<UpdateProductPageProps> = ({ params }) => {
  const { id } = params;

  const product = useProductStore((state) => state.product);
  const fetchProductById = useProductStore((state) => state.fetchProductById);

  const updateProduct = useUpdateProductStore((state) => state.updateProduct);
  const loading = useUpdateProductStore((state) => state.loading);
  const error = useUpdateProductStore((state) => state.error);

  const router = useRouter();

  const [form, setForm] = useState({
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
    thumbnail_url: "",
    image_url: "",
  });

  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [images, setImages] = useState<File[]>([]);

  useEffect(() => {
    fetchProductById(id);
  }, [id, fetchProductById]);

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name || "",
        price: product.price || "",
        items: product.items || "",
        old_price: product.old_price || "",
        category: product.category || "",
        descriptions: product.descriptions || "",
        tags: product.tags ? JSON.stringify(product.tags) : "",
        brand: product.brand || "",
        discount: product.discount || 0,
        stock: product.stock || 0,
        size: product.size ? JSON.stringify(product.size) : "",
        colors: product.colors ? JSON.stringify(product.colors) : "",
        warranty: product.warranty || "",
        sold: product.sold || 0,
        thumbnail_url: product.thumbnail_url || "",
        image_url: product.image_url ? JSON.stringify(product.image_url) : "",
      });
    }
  }, [product]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlethumbnailChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setThumbnail(e.target.files[0]);
    }
  };

  const handleImagesChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    await updateProduct({
      id,
      name: form.name,
      price: form.price,
      items: form.items,
      old_price: form.old_price,
      category: form.category,
      descriptions: form.descriptions,
      tags: form.tags,
      brand: form.brand,
      discount: form.discount,
      stock: form.stock,
      size: form.size,
      colors: form.colors,
      warranty: form.warranty,
      sold: form.sold,
      thumbnail: thumbnail ?? undefined,
      images,
    });

    router.push("/products");
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-6">Update Product</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Add input fields same as previous example */}
        {/* Example: */}
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Product Name"
          required
          className="w-full p-2 border rounded"
        />
        {/* ... other inputs ... */}

        <div>
          <label className="block mb-1 font-semibold">Thumbnail</label>
          <input
            type="file"
            accept="image/*"
            onChange={handlethumbnailChange}
          />
          {thumbnail && (
            <img
              src={URL.createObjectURL(thumbnail)}
              alt="Thumbnail preview"
              className="mt-2 h-24"
            />
          )}
        </div>

        <div>
          <label className="block mb-1 font-semibold">Images</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImagesChange}
          />
          {images.length > 0 && (
            <div className="flex space-x-2 mt-2 overflow-x-auto">
              {images.map((file, idx) => (
                <img
                  key={idx}
                  src={URL.createObjectURL(file)}
                  alt={`Image preview ${idx}`}
                  className="h-24"
                />
              ))}
            </div>
          )}
        </div>

        {error && <p className="text-red-600">{error}</p>}

        <button
          disabled={loading}
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? "Updating..." : "Update Product"}
        </button>
      </form>
    </div>
  );
};

export default UpdateProductPage;
