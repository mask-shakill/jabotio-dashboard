import { NextRequest, NextResponse } from "next/server";
import PocketBase from "pocketbase";
import { verifyToken } from "@/utils/auth";

const pb = new PocketBase(process.env.POCKETBASE_URL!);

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const user = await verifyToken(req);
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await context.params;

    const product = await pb.collection("products").getOne(id);

    return NextResponse.json({ product });
  } catch {
    return NextResponse.json({ message: "Product not found" }, { status: 404 });
  }
}
