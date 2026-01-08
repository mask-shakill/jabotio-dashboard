"use client";

import React, { useEffect, useState } from "react";
import { useProductStore } from "@/store/products/findStore";
import {
  ShoppingCart,
  Tag,
  Percent,
  Package,
  Shield,
  Star,
} from "lucide-react";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default function ProductDetailPage({ params }: ProductPageProps) {
  const { product, fetchProductById, loading, error } = useProductStore();
  const [productId, setProductId] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    params.then((resolvedParams) => {
      setProductId(resolvedParams.id);
      if (resolvedParams.id) {
        fetchProductById(resolvedParams.id);
      }
    });
  }, [params, fetchProductById]);

  if (!productId)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading product...
      </div>
    );
  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        {error}
      </div>
    );
  if (!product)
    return (
      <div className="min-h-screen flex items-center justify-center">
        No product found
      </div>
    );

  // Helper function to handle tags
  const renderTags = () => {
    if (!product.tags) return null;

    let tagsArray: string[] = [];

    if (Array.isArray(product.tags)) {
      tagsArray = product.tags;
    } else if (typeof product.tags === "string") {
      tagsArray = product.tags.split(",").map((tag) => tag.trim());
    } else {
      // Convert to string and try to split
      tagsArray = String(product.tags)
        .split(",")
        .map((tag) => tag.trim());
    }

    // Filter out empty strings
    tagsArray = tagsArray.filter((tag) => tag.length > 0);

    if (tagsArray.length === 0) return null;

    return (
      <div className="flex flex-wrap gap-2 mt-1">
        {tagsArray.map((tag: string, idx: number) => (
          <span
            key={idx}
            className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
          >
            {tag}
          </span>
        ))}
      </div>
    );
  };

  // Helper function for price display
  const displayPrice = () => {
    const price = Number(product.price) || 0;
    const oldPrice = Number(product.old_price) || 0;
    const discount = Number(product.discount) || 0;

    if (oldPrice > price) {
      return (
        <div className="flex items-center gap-2">
          <span className="text-3xl font-bold text-gray-900">
            ${price.toFixed(2)}
          </span>
          <span className="text-lg text-gray-500 line-through">
            ${oldPrice.toFixed(2)}
          </span>
          {discount > 0 && (
            <span className="px-2 py-1 bg-red-100 text-red-600 text-sm font-semibold rounded">
              -{discount}%
            </span>
          )}
        </div>
      );
    }

    return (
      <span className="text-3xl font-bold text-gray-900">
        ${price.toFixed(2)}
      </span>
    );
  };

  // Helper function for images
  const renderImages = () => {
    if (
      !product.image_url ||
      !Array.isArray(product.image_url) ||
      product.image_url.length === 0
    ) {
      return null;
    }

    return (
      <div className="grid grid-cols-4 gap-2">
        {product.image_url.map((url: string, idx: number) => (
          <button
            key={idx}
            onClick={() => setSelectedImage(idx)}
            className={`aspect-square rounded-lg overflow-hidden border-2 ${
              selectedImage === idx ? "border-blue-500" : "border-gray-200"
            }`}
          >
            <img
              src={url}
              alt={`Product view ${idx + 1}`}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "https://via.placeholder.com/150?text=No+Image";
              }}
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Left Column - Images */}
            <div>
              <div className="aspect-square w-full overflow-hidden rounded-xl bg-gray-100 mb-4">
                {product.thumbnail_url ? (
                  <img
                    src={product.thumbnail_url}
                    alt={product.name || "Product"}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://via.placeholder.com/500?text=No+Image";
                      (e.target as HTMLImageElement).className =
                        "w-full h-full object-contain p-8";
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    No image available
                  </div>
                )}
              </div>

              {renderImages()}
            </div>

            {/* Right Column - Details */}
            <div className="space-y-6">
              {/* Breadcrumb */}
              <div className="text-sm text-gray-500">
                <span>Home</span> &gt;{" "}
                <span>{product.category || "Category"}</span> &gt;{" "}
                <span className="text-gray-900">
                  {product.name || "Product"}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-3xl font-bold text-gray-900">
                {product.name || "Untitled Product"}
              </h1>

              {/* Brand */}
              {product.brand && (
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">{product.brand}</span>
                </div>
              )}

              {/* Price */}
              <div className="pt-4">{displayPrice()}</div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
                <div
                  className={`flex flex-col items-center p-3 rounded-lg ${
                    (product.stock || 0) > 0 ? "bg-green-50" : "bg-red-50"
                  }`}
                >
                  <Package
                    className={`w-5 h-5 mb-1 ${
                      (product.stock || 0) > 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  />
                  <span className="text-sm text-gray-600">Stock</span>
                  <span className="font-semibold">{product.stock || 0}</span>
                </div>

                <div className="flex flex-col items-center p-3 bg-blue-50 rounded-lg">
                  <ShoppingCart className="w-5 h-5 text-blue-600 mb-1" />
                  <span className="text-sm text-gray-600">Sold</span>
                  <span className="font-semibold">{product.sold || 0}</span>
                </div>

                {product.warranty && (
                  <div className="flex flex-col items-center p-3 bg-purple-50 rounded-lg">
                    <Shield className="w-5 h-5 text-purple-600 mb-1" />
                    <span className="text-sm text-gray-600">Warranty</span>
                    <span className="font-semibold">{product.warranty}</span>
                  </div>
                )}

                {product.discount > 0 && (
                  <div className="flex flex-col items-center p-3 bg-red-50 rounded-lg">
                    <Percent className="w-5 h-5 text-red-600 mb-1" />
                    <span className="text-sm text-gray-600">Discount</span>
                    <span className="font-semibold">{product.discount}%</span>
                  </div>
                )}
              </div>

              {/* Description */}
              {product.descriptions && (
                <div className="pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Description
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {product.descriptions}
                  </p>
                </div>
              )}

              {/* Details Grid */}
              <div className="pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Details
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {product.category && (
                    <div>
                      <div className="text-sm text-gray-500">Category</div>
                      <div className="font-medium">{product.category}</div>
                    </div>
                  )}
                  {product.size && (
                    <div>
                      <div className="text-sm text-gray-500">Size</div>
                      <div className="font-medium">{product.size}</div>
                    </div>
                  )}
                  {product.colors && (
                    <div>
                      <div className="text-sm text-gray-500">Colors</div>
                      <div className="font-medium">{product.colors}</div>
                    </div>
                  )}
                  {product.tags && (
                    <div className="col-span-2">
                      <div className="text-sm text-gray-500">Tags</div>
                      {renderTags()}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
