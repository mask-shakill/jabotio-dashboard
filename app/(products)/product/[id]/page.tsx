"use client";

import React, { useEffect, useState } from "react";
import { useProductStore } from "@/store/products/findStore";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default function ProductDetailPage({ params }: ProductPageProps) {
  const { product, fetchProductById, loading, error } = useProductStore();
  const [productId, setProductId] = useState<string | null>(null);

  useEffect(() => {
    // Unwrap the params Promise
    params.then((resolvedParams) => {
      setProductId(resolvedParams.id);
      if (resolvedParams.id) {
        fetchProductById(resolvedParams.id);
      }
    });
  }, [params, fetchProductById]);

  if (!productId) return <p>Loading product ID...</p>;
  if (loading) return <p>Loading product...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!product) return <p>No product found</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">{product.name}</h1>

      <div className="mb-6">
        <strong>Price:</strong> {product.price}
      </div>

      <div className="mb-6">
        <strong>Category:</strong> {product.category}
      </div>

      <div className="mb-6">
        <strong>Description:</strong> {product.descriptions}
      </div>

      <div className="mb-6">
        <strong>Brand:</strong> {product.brand}
      </div>

      <div className="mb-6">
        <strong>Discount:</strong> {product.discount}%
      </div>

      <div className="mb-6">
        <strong>Stock:</strong> {product.stock}
      </div>

      <div className="mb-6">
        <strong>Sold:</strong> {product.sold}
      </div>

      <div className="mb-6">
        <strong>Warranty:</strong> {product.warranty}
      </div>

      <div className="mb-6">
        <strong>Tags:</strong> {product.tags}
      </div>

      <div className="mb-6">
        <strong>Size:</strong> {product.size}
      </div>

      <div className="mb-6">
        <strong>Colors:</strong> {product.colors}
      </div>

      <div className="mb-6">
        <strong>Old Price:</strong> {product.old_price}
      </div>

      <div className="mb-6">
        <strong>Items:</strong> {product.items}
      </div>

      <div className="mb-6">
        <strong>Thumbnail:</strong>
        <br />
        {product.thumbnail_url && (
          <img
            src={product.thumbnail_url}
            alt="Thumbnail"
            className="max-w-xs"
          />
        )}
      </div>

      <div className="mb-6">
        <strong>Images:</strong>
        <br />
        {product.image_url?.map((url: string, idx: number) => (
          <img
            key={idx}
            src={url}
            alt={`Image ${idx + 1}`}
            className="max-w-xs inline-block mr-2"
          />
        ))}
      </div>
    </div>
  );
}
