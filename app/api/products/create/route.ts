import { NextResponse, NextRequest } from "next/server";
import PocketBase from "pocketbase";
import { verifyToken } from "@/utils/auth";

const pb = new PocketBase(process.env.POCKETBASE_URL!);

export async function POST(req: NextRequest) {
  try {
    const user = await verifyToken(req);
    if (!user)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

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

    for (const field of fields) {
      const value = formData.get(field);
      if (value) data.append(field, value.toString());
    }

    // Numbers
    const numbers = ["discount", "stock", "sold"];
    for (const numField of numbers) {
      const value = formData.get(numField);
      if (value) data.append(numField, value.toString());
    }

    // JSON fields as stringified JSON
    const jsonFields = ["colors", "size", "tags"];
    for (const jsonField of jsonFields) {
      const value = formData.get(jsonField);
      if (value) data.append(jsonField, value.toString());
    }

    // Thumbnail file
    const thumbnail = formData.get("thumnails");
    if (thumbnail && thumbnail instanceof File && thumbnail.size > 0) {
      data.append("thumnails", thumbnail);
    }

    // Multiple images files
    const images = formData.getAll("images");
    for (const image of images) {
      if (image instanceof File && image.size > 0) {
        data.append("images", image);
      }
    }

    const createdProduct = await pb.collection("products").create(data);

    return NextResponse.json({
      message: "Product created successfully",
      product: createdProduct,
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to create product" },
      { status: 500 }
    );
  }
}
