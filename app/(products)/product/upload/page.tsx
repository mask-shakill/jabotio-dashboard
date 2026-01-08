"use client";

import React, { useState, useEffect } from "react";
import {
  useCreateProductStore,
  ProductPayload,
} from "@/store/products/uploadStore";
import { useRouter } from "next/navigation";
import { X, Upload, Image as ImageIcon, Trash2, Plus } from "lucide-react";

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
    try {
      JSON.parse(jsonString);
      setFormData((prev) => ({ ...prev, [field]: jsonString }));
    } catch {
      // ignore invalid JSON
    }
  }

  function removeThumbnail() {
    setFormData((prev) => ({ ...prev, thumnails: null }));
    setThumbPreview(null);
  }

  function removeImage(index: number) {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    await createProduct(formData);

    if (!error) {
      router.push("/all-products");
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Upload Product
                </h1>
                <p className="text-gray-600 mt-2">
                  Fill in the details to add a new product to your store
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <Upload className="h-8 w-8 text-blue-600" />
              </div>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center text-red-700">
                <X className="h-5 w-5 mr-2" />
                <span className="font-medium">Error:</span>
                <span className="ml-2">{error}</span>
              </div>
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-8">
            {/* Basic Information Section */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">
                Basic Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g., Premium Wireless Headphones"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    placeholder="e.g., Head Phones, Men Fashion"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Brand
                  </label>
                  <input
                    type="text"
                    name="brand"
                    value={formData.brand}
                    onChange={handleInputChange}
                    placeholder="e.g., Apple, Nike"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Items
                  </label>
                  <input
                    type="text"
                    name="items"
                    value={formData.items}
                    onChange={handleInputChange}
                    placeholder="e.g., Gadget, Fashion"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="descriptions"
                  value={formData.descriptions}
                  onChange={handleInputChange}
                  placeholder="Describe your product in detail..."
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>

            {/* Pricing Section */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">
                Pricing & Inventory
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Price *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                      $
                    </span>
                    <input
                      type="text"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      placeholder="0.00"
                      required
                      className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Old Price
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                      $
                    </span>
                    <input
                      type="text"
                      name="old_price"
                      value={formData.old_price}
                      onChange={handleInputChange}
                      placeholder="0.00"
                      className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Discount (%)
                  </label>
                  <div className="relative">
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                      %
                    </span>
                    <input
                      type="number"
                      name="discount"
                      value={formData.discount}
                      onChange={handleNumberChange}
                      placeholder="0"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      min={0}
                      max={100}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stock *
                  </label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleNumberChange}
                    placeholder="0"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    min={0}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sold
                  </label>
                  <input
                    type="number"
                    name="sold"
                    value={formData.sold}
                    onChange={handleNumberChange}
                    placeholder="0"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    min={0}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Warranty
                  </label>
                  <input
                    type="text"
                    name="warranty"
                    value={formData.warranty}
                    onChange={handleInputChange}
                    placeholder="e.g., 1 Year Warranty"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>
            </div>

            {/* Attributes Section */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">
                Product Attributes
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags (JSON Array)
                  </label>
                  <input
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={(e) => handleJSONChange("tags", e.target.value)}
                    placeholder='["wireless", "headphones", "bluetooth"]'
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 font-mono text-sm"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Enter as JSON array format
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sizes (JSON Array)
                  </label>
                  <input
                    type="text"
                    name="size"
                    value={formData.size}
                    onChange={(e) => handleJSONChange("size", e.target.value)}
                    placeholder='["S", "M", "L"]'
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 font-mono text-sm"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Enter as JSON array format
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Colors (JSON Array)
                  </label>
                  <input
                    type="text"
                    name="colors"
                    value={formData.colors}
                    onChange={(e) => handleJSONChange("colors", e.target.value)}
                    placeholder='["red", "blue", "black"]'
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 font-mono text-sm"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Enter as JSON array format
                  </p>
                </div>
              </div>
            </div>

            {/* Images Section */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">
                Product Images
              </h2>

              {/* Thumbnail Upload */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Thumbnail Image *
                  </label>
                  <div className="mt-1 flex items-center space-x-4">
                    <label className="cursor-pointer">
                      <div className="flex flex-col items-center justify-center w-48 h-48 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 transition-colors duration-200 bg-gray-50 hover:bg-gray-100">
                        {thumbPreview ? (
                          <div className="relative w-full h-full">
                            <img
                              src={thumbPreview}
                              alt="Thumbnail Preview"
                              className="w-full h-full object-cover rounded-lg"
                            />
                            <button
                              type="button"
                              onClick={removeThumbnail}
                              className="absolute -top-2 -right-2 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 transition-colors duration-200 shadow-lg"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ) : (
                          <>
                            <Upload className="h-12 w-12 text-gray-400 mb-2" />
                            <span className="text-sm text-gray-500 font-medium">
                              Upload Thumbnail
                            </span>
                            <span className="text-xs text-gray-400 mt-1">
                              Recommended: 500x500px
                            </span>
                          </>
                        )}
                      </div>
                      <input
                        type="file"
                        name="thumnails"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>

                    <div className="flex-1">
                      <p className="text-sm text-gray-600">
                        <span className="font-semibold">Important:</span> This
                        image will be used as the main thumbnail for your
                        product. Make sure it's high-quality and represents your
                        product well.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Multiple Images Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Images
                  </label>
                  <div className="space-y-4">
                    {/* Upload Button */}
                    <label className="cursor-pointer inline-block">
                      <div className="flex items-center justify-center w-full px-6 py-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 transition-colors duration-200 bg-gray-50 hover:bg-gray-100">
                        <Plus className="h-6 w-6 text-gray-400 mr-2" />
                        <span className="text-gray-700 font-medium">
                          Add More Images
                        </span>
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

                    {/* Image Previews Grid */}
                    {imagePreviews.length > 0 && (
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-medium text-gray-700">
                            Uploaded Images ({imagePreviews.length})
                          </h3>
                          <button
                            type="button"
                            onClick={() =>
                              setFormData((prev) => ({ ...prev, images: [] }))
                            }
                            className="flex items-center text-sm text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Remove All
                          </button>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                          {imagePreviews.map((src, index) => (
                            <div key={index} className="relative group">
                              <div className="aspect-square rounded-lg overflow-hidden border border-gray-200">
                                <img
                                  src={src}
                                  alt={`Product Image ${index + 1}`}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                                />
                              </div>
                              <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="absolute -top-2 -right-2 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 transition-all duration-200 opacity-0 group-hover:opacity-100 shadow-lg"
                              >
                                <X className="h-4 w-4" />
                              </button>
                              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                Image {index + 1}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6 border-t">
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200 font-medium"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-3 bg-linear-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="h-5 w-5 mr-2" />
                      Upload Product
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
