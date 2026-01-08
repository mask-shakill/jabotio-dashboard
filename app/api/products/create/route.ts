import { NextRequest, NextResponse } from "next/server";
import PocketBase from "pocketbase";
import { verifyToken } from "@/utils/auth";

const pb = new PocketBase(process.env.POCKETBASE_URL!);
const PB_URL = process.env.POCKETBASE_URL!;

export async function POST(req: NextRequest) {
  try {
    const user = await verifyToken(req);
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (!req.headers.get("content-type")?.includes("multipart/form-data")) {
      return NextResponse.json(
        { message: "Content-Type must be multipart/form-data" },
        { status: 415 }
      );
    }

    const formData = await req.formData();
    const data = new FormData();

    const fields = [
      "name",
      "price",
      "items",
      "old_price",
      "category",
      "descriptions",
      "brand",
      "warranty",
    ];

    fields.forEach((f) => {
      const v = formData.get(f);
      if (v) data.append(f, v.toString());
    });

    ["discount", "stock", "sold"].forEach((f) => {
      const v = formData.get(f);
      if (v) data.append(f, v.toString());
    });

    ["colors", "size", "tags"].forEach((f) => {
      const v = formData.get(f);
      if (v) data.append(f, v.toString());
    });

    const thumbnail = formData.get("thumbnail");
    if (thumbnail instanceof File) {
      data.append("thumbnail", thumbnail);
    }

    const images = formData.getAll("images");
    images.forEach((img) => {
      if (img instanceof File) data.append("images", img);
    });

    const product = await pb.collection("products").create(data);

    const imageUrls =
      product.images?.map(
        (img: string) => `${PB_URL}/api/files/products/${product.id}/${img}`
      ) || [];

    const thumbnailUrl = product.thumbnail
      ? `${PB_URL}/api/files/products/${product.id}/${product.thumbnail}`
      : null;

    const updatedProduct = await pb.collection("products").update(product.id, {
      image_url: imageUrls,
      thumbnail_url: thumbnailUrl,
    });

    return NextResponse.json({
      message: "Product created successfully",
      product: updatedProduct,
    });
  } catch {
    return NextResponse.json(
      { message: "Failed to create product" },
      { status: 500 }
    );
  }
}
