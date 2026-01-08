import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET!;

export interface UserPayload {
  id: string;
  role: string;
  // যেকোনো extra data চাইলে এখানে add করতে পারো
}

export async function verifyToken(
  request: NextRequest
): Promise<UserPayload | null> {
  try {
    // cookie থেকে token নাও (Next.js 13+ এর জন্য NextRequest)
    const token = request.cookies.get("access_token")?.value;

    if (!token) return null;

    // jwt verify করো
    const decoded = jwt.verify(token, JWT_SECRET);

    // যদি valid হয়, তাহলে decoded রিটার্ন করো
    return decoded as UserPayload;
  } catch (error) {
    // error হলে null রিটার্ন করো
    return null;
  }
}
