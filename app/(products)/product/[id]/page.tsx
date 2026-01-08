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

  const displayPrice =
    product.old_price && product.old_price > product.price ? (
      <div className="flex items-center gap-2">
        <span className="text-3xl font-bold text-gray-900">
          ${product.price}
        </span>
        <span className="text-lg text-gray-500 line-through">
          ${product.old_price}
        </span>
        {product.discount > 0 && (
          <span className="px-2 py-1 bg-red-100 text-red-600 text-sm font-semibold rounded">
            -{product.discount}%
          </span>
        )}
      </div>
    ) : (
      <span className="text-3xl font-bold text-gray-900">${product.price}</span>
    );

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
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    No image
                  </div>
                )}
              </div>

              {product.image_url && product.image_url.length > 0 && (
                <div className="grid grid-cols-4 gap-2">
                  {product.image_url.map((url: string, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`aspect-square rounded-lg overflow-hidden border-2 ${
                        selectedImage === idx
                          ? "border-blue-500"
                          : "border-gray-200"
                      }`}
                    >
                      <img
                        src={url}
                        alt={`Product view ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right Column - Details */}
            <div className="space-y-6">
              {/* Breadcrumb */}
              <div className="text-sm text-gray-500">
                <span>Home</span> &gt; <span>{product.category}</span> &gt;{" "}
                <span className="text-gray-900">{product.name}</span>
              </div>

              {/* Title */}
              <h1 className="text-3xl font-bold text-gray-900">
                {product.name}
              </h1>

              {/* Brand */}
              {product.brand && (
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">{product.brand}</span>
                </div>
              )}

              {/* Price */}
              <div className="pt-4">{displayPrice}</div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
                {product.stock > 0 ? (
                  <div className="flex flex-col items-center p-3 bg-green-50 rounded-lg">
                    <Package className="w-5 h-5 text-green-600 mb-1" />
                    <span className="text-sm text-gray-600">In Stock</span>
                    <span className="font-semibold">{product.stock}</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center p-3 bg-red-50 rounded-lg">
                    <Package className="w-5 h-5 text-red-600 mb-1" />
                    <span className="text-sm text-gray-600">Out of Stock</span>
                  </div>
                )}

                <div className="flex flex-col items-center p-3 bg-blue-50 rounded-lg">
                  <ShoppingCart className="w-5 h-5 text-blue-600 mb-1" />
                  <span className="text-sm text-gray-600">Sold</span>
                  <span className="font-semibold">{product.sold}</span>
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
                      <div className="flex flex-wrap gap-2 mt-1">
                        {product.tags
                          .split(",")
                          .map((tag: string, idx: number) => (
                            <span
                              key={idx}
                              className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                            >
                              {tag.trim()}
                            </span>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-8">
                <div className="flex gap-4">
                  <button className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                    <ShoppingCart className="w-5 h-5" />
                    Add to Cart
                  </button>
                  <button className="flex-1 border-2 border-blue-600 text-blue-600 py-3 px-6 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
