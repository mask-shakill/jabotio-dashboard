import { NextRequest, NextResponse } from "next/server";
import PocketBase from "pocketbase";
import { verifyToken } from "@/utils/auth";

const pb = new PocketBase(process.env.POCKETBASE_URL!);

export async function POST(req: NextRequest) {
  try {
    const user = await verifyToken(req);
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (!req.headers.get("content-type")?.includes("multipart/form-data")) {
      return NextResponse.json(
        { message: "multipart/form-data required" },
        { status: 415 }
      );
    }

    const formData = await req.formData();

    const product_id = formData.get("product_id");
    const review = formData.get("review");
    const rating = formData.get("rating");

    if (!product_id) {
      return NextResponse.json(
        { message: "product_id is required" },
        { status: 400 }
      );
    }

    const payload: Record<string, any> = {
      product_id: product_id.toString(),
      user_id: user.id,
    };

    // OPTIONAL fields
    if (review && review.toString().trim() !== "") {
      payload.review = review.toString();
    }

    if (rating && rating.toString().trim() !== "") {
      payload.rating = rating.toString(); // 🔥 STRING only
    }

    const record = await pb.collection("review_rating").create(payload);

    return NextResponse.json(
      {
        message: "Review created successfully",
        review: record,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Review create error:", error);
    return NextResponse.json(
      { message: "Failed to create review" },
      { status: 500 }
    );
  }
}
