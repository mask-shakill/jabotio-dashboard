import { NextRequest, NextResponse } from "next/server";
import PocketBase from "pocketbase";
import { verifyToken } from "@/utils/auth";

const pb = new PocketBase(process.env.POCKETBASE_URL!);

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
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

  try {
    const { id } = await context.params;

    const formData = await req.formData();
    const updateData = new FormData();

    const fields = [
      "name",
      "price",
      "items",
      "old_price",
      "category",
      "descriptions",
      "brand",
      "warranty",
      "discount",
      "stock",
      "sold",
      "thumnails_url",
    ];

    fields.forEach((f) => {
      const v = formData.get(f);
      if (v) updateData.append(f, v.toString());
    });

    ["tags", "size", "colors", "image_url"].forEach((f) => {
      const v = formData.get(f);
      if (v) updateData.append(f, v.toString());
    });

    const thumnails = formData.get("thumnails");
    if (thumnails instanceof File) {
      updateData.append("thumnails", thumnails);
    }

    const images = formData.getAll("images");
    images.forEach((img) => {
      if (img instanceof File) updateData.append("images", img);
    });

    const product = await pb.collection("products").update(id, updateData);

    return NextResponse.json({ product });
  } catch {
    return NextResponse.json(
      { message: "Failed to update product" },
      { status: 500 }
    );
  }
}
