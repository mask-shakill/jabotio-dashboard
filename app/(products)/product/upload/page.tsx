"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useCreateProductStore } from "@/store/products/uploadStore";
import ProductForm from "@/components/ProductForm";
import { ProductFormData } from "@/components/ProductForm";

export default function UploadPage() {
  const router = useRouter();
  const { createProduct, loading, error } = useCreateProductStore();

  const handleSubmit = async (formData: ProductFormData) => {
    await createProduct(formData);
    // If no error after creation, navigate
    if (!error) {
      router.push("/all-products");
    }
  };

  return (
    <ProductForm
      onSubmit={handleSubmit}
      loading={loading}
      error={error}
      isUpdate={false}
    />
  );
}
