import { NextResponse, NextRequest } from "next/server";
import PocketBase from "pocketbase";
import { verifyToken } from "@/utils/auth";

const pb = new PocketBase(process.env.POCKETBASE_URL!);

export async function PATCH(req: NextRequest) {
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
    const updateData = new FormData();

    const name = formData.get("name");
    if (name) updateData.append("name", name.toString());

    const phone = formData.get("phone");
    if (phone) updateData.append("phone", phone.toString());

    const location = formData.get("location");
    if (location) updateData.append("location", location.toString());

    const address = formData.get("address");
    if (address) updateData.append("address", address.toString());

    const avatar = formData.get("avatar");
    if (avatar && avatar instanceof File && avatar.size > 0) {
      updateData.append("avatar", avatar);
    }

    const updatedUser = await pb
      .collection("app_users")
      .update(user.id, updateData);

    if (avatar && avatar instanceof File && avatar.size > 0) {
      const avatarFilename = updatedUser.avatar;
      const imageUrl = `${process.env.POCKETBASE_URL}/api/files/${updatedUser.collectionId}/${updatedUser.id}/${avatarFilename}`;
      const finalUser = await pb
        .collection("app_users")
        .update(user.id, { image_url: imageUrl });
      return NextResponse.json({
        message: "Profile updated successfully",
        user: finalUser,
      });
    }

    return NextResponse.json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch {
    return NextResponse.json(
      { message: "Failed to update profile" },
      { status: 500 }
    );
  }
}
