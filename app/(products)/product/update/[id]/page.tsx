"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  useUpdateProductStore,
  ProductUpdatePayload,
} from "@/store/products/updateStore";
import { useProductStore } from "@/store/products/findStore";
import ProductForm, { ProductFormData } from "@/components/ProductForm";

export default function UpdatePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const {
    product,
    loading: productLoading,
    error: productError,
    fetchProductById,
  } = useProductStore();
  const {
    updateProduct,
    loading: updateLoading,
    error: updateError,
  } = useUpdateProductStore();

  const [initialData, setInitialData] = useState<Partial<ProductFormData>>({});

  useEffect(() => {
    if (id) {
      fetchProductById(id);
    }
  }, [id]);

  useEffect(() => {
    if (product) {
      setInitialData({
        name: product.name,
        price: product.price,
        items: product.items,
        old_price: product.old_price,
        category: product.category,
        descriptions: product.descriptions,
        tags: product.tags,
        brand: product.brand,
        discount: product.discount,
        stock: product.stock,
        size: product.size,
        colors: product.colors,
        warranty: product.warranty,
        sold: product.sold,
        thumbnail: null,
        images: [],
        thumbnail_url: product.thumbnail_url,
        image_url: JSON.stringify(product.image_url),
      });
    }
  }, [product]);

  const handleSubmit = async (formData: ProductFormData) => {
    const updatePayload: ProductUpdatePayload = {
      id,
      name: formData.name,
      price: formData.price,
      items: formData.items,
      old_price: formData.old_price,
      category: formData.category,
      descriptions: formData.descriptions,
      tags: formData.tags,
      brand: formData.brand,
      discount: formData.discount,
      stock: formData.stock,
      size: formData.size,
      colors: formData.colors,
      warranty: formData.warranty,
      sold: formData.sold,
      thumbnail: formData.thumbnail || undefined,
      images: formData.images,
    };

    await updateProduct(updatePayload);
    router.push("/all-products");
  };

  if (productLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (productError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Error</h2>
          <p className="text-gray-600">{productError}</p>
          <button
            onClick={() => router.push("/all-products")}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <ProductForm
      initialData={initialData}
      onSubmit={handleSubmit}
      loading={updateLoading}
      error={updateError}
      isUpdate={true}
    />
  );
}
