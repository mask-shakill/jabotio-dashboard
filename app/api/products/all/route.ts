import { NextResponse, NextRequest } from "next/server";
import PocketBase from "pocketbase";
import { verifyToken } from "@/utils/auth";

const pb = new PocketBase(process.env.POCKETBASE_URL!);

export async function GET(req: NextRequest) {
  const user = await verifyToken(req);

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const products = await pb.collection("products").getFullList(200, {
      sort: "-created",
    });

    return NextResponse.json({ products });
  } catch {
    return NextResponse.json(
      { message: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
