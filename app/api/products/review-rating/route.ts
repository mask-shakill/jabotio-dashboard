import { NextRequest, NextResponse } from "next/server";
import PocketBase from "pocketbase";
import { verifyToken } from "@/utils/auth";

const pb = new PocketBase(process.env.POCKETBASE_URL!);

export async function GET(req: NextRequest) {
  try {
    const user = await verifyToken(req);
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId");

    if (!productId) {
      return NextResponse.json(
        { message: "productId is required" },
        { status: 400 }
      );
    }

    console.log("🔍 Fetching reviews for product:", productId);

    const records = await pb.collection("review_rating").getFullList({
      filter: `product_id = "${productId}"`,
      expand: "user_id",
      sort: "-created",
    });

    console.log("✅ Found reviews:", records.length);

    return NextResponse.json({
      success: true,
      total: records.length,
      data: records.map((r: any) => ({
        id: r.id,
        review: r.review || null,
        rating: r.rating || null,
        product_id: r.product_id,
        user: r.expand?.user_id
          ? {
              id: r.expand.user_id.id,
              name: r.expand.user_id.name || "Anonymous",
              email: r.expand.user_id.email || null,
              avatar: r.expand.user_id.avatar || null,
            }
          : null,
        created: r.created,
        updated: r.updated,
      })),
    });
  } catch (error: any) {
    console.error("❌ GET Reviews Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to fetch reviews",
        details: error.response?.data || null,
      },
      { status: error.status || 500 }
    );
  }
}
