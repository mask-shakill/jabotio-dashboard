"use client";

import React, { useState, useEffect } from "react";
import { X, Upload, Plus, Trash2 } from "lucide-react";

export interface ProductFormData {
  name: string;
  price: string;
  items: string;
  old_price: string;
  category: string;
  descriptions: string;
  tags: string;
  brand: string;
  discount: number;
  stock: number;
  size: string;
  colors: string;
  warranty: string;
  sold: number;
  thumbnail: File | null;
  images: File[];
  thumbnail_url?: string;
  image_url?: string;
}

interface ProductFormProps {
  initialData?: Partial<ProductFormData>;
  onSubmit: (data: ProductFormData) => Promise<void>;
  loading?: boolean;
  error?: string | null;
  isUpdate?: boolean;
}

export default function ProductForm({
  initialData = {},
  onSubmit,
  loading = false,
  error = null,
  isUpdate = false,
}: ProductFormProps) {
  const [formData, setFormData] = useState<ProductFormData>({
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
    thumbnail: null,
    images: [],
    ...initialData,
  });

  const [thumbPreview, setThumbPreview] = useState<string | null>(null);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [existingThumbnail, setExistingThumbnail] = useState<string | null>(
    initialData.thumbnail_url || null
  );
  const [existingImages, setExistingImages] = useState<string[]>(
    initialData.image_url ? JSON.parse(initialData.image_url) : []
  );

  // Array states for tags, sizes, colors
  const [tags, setTags] = useState<string[]>([]);
  const [sizes, setSizes] = useState<string[]>([]);
  const [colors, setColors] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [sizeInput, setSizeInput] = useState("");
  const [colorInput, setColorInput] = useState("");

  useEffect(() => {
    try {
      const parsedTags = JSON.parse(formData.tags);
      if (Array.isArray(parsedTags)) setTags(parsedTags);
    } catch {}
    try {
      const parsedSizes = JSON.parse(formData.size);
      if (Array.isArray(parsedSizes)) setSizes(parsedSizes);
    } catch {}
    try {
      const parsedColors = JSON.parse(formData.colors);
      if (Array.isArray(parsedColors)) setColors(parsedColors);
    } catch {}
  }, []);

  useEffect(() => {
    setFormData((prev) => ({ ...prev, tags: JSON.stringify(tags) }));
  }, [tags]);

  useEffect(() => {
    setFormData((prev) => ({ ...prev, size: JSON.stringify(sizes) }));
  }, [sizes]);

  useEffect(() => {
    setFormData((prev) => ({ ...prev, colors: JSON.stringify(colors) }));
  }, [colors]);

  useEffect(() => {
    if (formData.thumbnail) {
      const url = URL.createObjectURL(formData.thumbnail);
      setThumbPreview(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [formData.thumbnail]);

  useEffect(() => {
    if (formData.images.length > 0) {
      const urls = formData.images.map((file) => URL.createObjectURL(file));
      setImagePreviews(urls);
      return () => urls.forEach((url) => URL.revokeObjectURL(url));
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
    const numberValue = value === "" ? 0 : parseInt(value, 10);
    setFormData((prev) => ({
      ...prev,
      [name]: isNaN(numberValue) ? 0 : numberValue,
    }));
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, files } = e.target;
    if (!files) return;

    if (name === "thumbnail") {
      setFormData((prev) => ({ ...prev, thumbnail: files[0] }));
      setExistingThumbnail(null);
    } else if (name === "images") {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...Array.from(files)],
      }));
    }
  }

  function removeThumbnail() {
    setFormData((prev) => ({ ...prev, thumbnail: null }));
    setThumbPreview(null);
    setExistingThumbnail(null);
  }

  function removeImage(index: number) {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  }

  function removeExistingImage(index: number) {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  }

  function addTag() {
    if (tagInput.trim()) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  }

  function removeTag(index: number) {
    setTags(tags.filter((_, i) => i !== index));
  }

  function addSize() {
    if (sizeInput.trim()) {
      setSizes([...sizes, sizeInput.trim()]);
      setSizeInput("");
    }
  }

  function removeSize(index: number) {
    setSizes(sizes.filter((_, i) => i !== index));
  }

  function addColor() {
    if (colorInput.trim()) {
      setColors([...colors, colorInput.trim()]);
      setColorInput("");
    }
  }

  function removeColor(index: number) {
    setColors(colors.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await onSubmit(formData);
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-gray-900">
              {isUpdate ? "Update Product" : "Add New Product"}
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              {isUpdate
                ? "Edit product details"
                : "Fill in the product information"}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-md flex items-center text-red-700 text-sm">
              <X className="h-4 w-4 mr-2" />
              {error}
            </div>
          )}

          <div onSubmit={handleSubmit} className="space-y-8">
            {/* Images Section */}
            <div>
              <h2 className="text-sm font-medium text-gray-900 mb-4">
                Product Images
              </h2>

              {/* Thumbnail */}
              <div className="mb-4">
                <label className="block text-xs text-gray-600 mb-2">
                  Thumbnail *
                </label>
                <label className="cursor-pointer block">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors">
                    {thumbPreview || existingThumbnail ? (
                      <div className="relative h-48 p-4">
                        <img
                          src={thumbPreview || existingThumbnail || ""}
                          alt="Thumbnail"
                          className="w-full h-full object-contain"
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            removeThumbnail();
                          }}
                          className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
                        >
                          <X className="h-4 w-4 text-gray-600" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-48 text-gray-500">
                        <Upload className="h-8 w-8 mb-2" />
                        <span className="text-sm">Click to upload</span>
                        <span className="text-xs text-gray-400 mt-1">
                          PNG, JPG up to 10MB
                        </span>
                      </div>
                    )}
                  </div>
                  <input
                    type="file"
                    name="thumbnail"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Additional Images */}
              <div>
                <label className="block text-xs text-gray-600 mb-2">
                  Additional Images
                </label>
                <label className="cursor-pointer block">
                  <div className="border border-gray-300 rounded-lg p-4 hover:border-gray-400 transition-colors flex items-center justify-center">
                    <Plus className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">Add Images</span>
                  </div>
                  <input
                    type="file"
                    name="images"
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>

                {(imagePreviews.length > 0 || existingImages.length > 0) && (
                  <div className="grid grid-cols-4 gap-3 mt-3">
                    {existingImages.map((src, index) => (
                      <div key={`existing-${index}`} className="relative group">
                        <img
                          src={src}
                          alt={`Product ${index + 1}`}
                          className="w-full aspect-square object-cover rounded-lg border border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={() => removeExistingImage(index)}
                          className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-3 w-3 text-gray-600" />
                        </button>
                      </div>
                    ))}
                    {imagePreviews.map((src, index) => (
                      <div key={`new-${index}`} className="relative group">
                        <img
                          src={src}
                          alt={`New ${index + 1}`}
                          className="w-full aspect-square object-cover rounded-lg border border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-3 w-3 text-gray-600" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Basic Info */}
            <div>
              <h2 className="text-sm font-medium text-gray-900 mb-4">
                Basic Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">
                      Category *
                    </label>
                    <input
                      type="text"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-600 mb-1">
                      Brand
                    </label>
                    <input
                      type="text"
                      name="brand"
                      value={formData.brand}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    Description
                  </label>
                  <textarea
                    name="descriptions"
                    value={formData.descriptions}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div>
              <h2 className="text-sm font-medium text-gray-900 mb-4">
                Pricing & Inventory
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    Price *
                  </label>
                  <input
                    type="text"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    Old Price
                  </label>
                  <input
                    type="text"
                    name="old_price"
                    value={formData.old_price}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    Discount (%)
                  </label>
                  <input
                    type="number"
                    name="discount"
                    value={formData.discount || ""}
                    onChange={handleNumberChange}
                    min={0}
                    max={100}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    Stock *
                  </label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock || ""}
                    onChange={handleNumberChange}
                    required
                    min={0}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    SKU
                  </label>
                  <input
                    type="text"
                    name="items"
                    value={formData.items}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    Warranty
                  </label>
                  <input
                    type="text"
                    name="warranty"
                    value={formData.warranty}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Attributes */}
            <div>
              <h2 className="text-sm font-medium text-gray-900 mb-4">
                Attributes
              </h2>
              <div className="space-y-4">
                {/* Tags */}
                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    Tags
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={(e) =>
                        e.key === "Enter" && (e.preventDefault(), addTag())
                      }
                      placeholder="Enter tag"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={addTag}
                      className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Add
                    </button>
                  </div>
                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => removeTag(index)}
                            className="hover:text-red-600"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Sizes */}
                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    Sizes
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={sizeInput}
                      onChange={(e) => setSizeInput(e.target.value)}
                      onKeyPress={(e) =>
                        e.key === "Enter" && (e.preventDefault(), addSize())
                      }
                      placeholder="Enter size"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={addSize}
                      className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Add
                    </button>
                  </div>
                  {sizes.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {sizes.map((size, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                        >
                          {size}
                          <button
                            type="button"
                            onClick={() => removeSize(index)}
                            className="hover:text-red-600"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Colors */}
                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    Colors
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={colorInput}
                      onChange={(e) => setColorInput(e.target.value)}
                      onKeyPress={(e) =>
                        e.key === "Enter" && (e.preventDefault(), addColor())
                      }
                      placeholder="Enter color"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={addColor}
                      className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Add
                    </button>
                  </div>
                  {colors.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {colors.map((color, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                        >
                          {color}
                          <button
                            type="button"
                            onClick={() => removeColor(index)}
                            className="hover:text-red-600"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                  {isUpdate ? "Updating..." : "Uploading..."}
                </span>
              ) : (
                <span>{isUpdate ? "Update Product" : "Add Product"}</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
