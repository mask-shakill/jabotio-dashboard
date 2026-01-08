import { NextResponse } from "next/server";
import PocketBase from "pocketbase";
import { verifyToken } from "@/utils/auth";

const POCKETBASE_URL = process.env.POCKETBASE_URL!;
const pb = new PocketBase(POCKETBASE_URL);

export async function GET(request: Request) {
  const req = request as any;
  const userPayload = await verifyToken(req);

  if (!userPayload) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const userRecord = await pb.collection("app_users").getOne(userPayload.id);
    return NextResponse.json({
      user: {
        id: userRecord.id,
        email: userRecord.email,
        name: userRecord.name,
        role: userRecord.role,
        phone: userRecord.phone,
        location: userRecord.location,
        address: userRecord.address,
        image_url: userRecord.image_url,
      },
    });
  } catch (error) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }
}
