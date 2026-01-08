import { NextResponse } from "next/server";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import PocketBase from "pocketbase";

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
const JWT_SECRET = process.env.JWT_SECRET!;
const POCKETBASE_URL = process.env.POCKETBASE_URL!;

const client = new OAuth2Client(CLIENT_ID);
const pb = new PocketBase(POCKETBASE_URL);

export async function POST(request: Request) {
  try {
    const { token } = await request.json();

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload) {
      return NextResponse.json({ message: "Invalid token" }, { status: 400 });
    }

    const result = await pb.collection("app_users").getList(1, 1, {
      filter: `googleId="${payload.sub}"`,
    });

    let user = result.items[0];

    const userData = {
      googleId: payload.sub,
      email: payload.email,
      name: payload.name,
      image_url: payload.picture || "",
      role: "user",
    };

    if (!user) {
      user = await pb.collection("app_users").create(userData);
    } else {
      user = await pb.collection("app_users").update(user.id, {
        email: payload.email,
        name: payload.name,
        image_url: payload.picture || "",
      });
    }

    const appJwt = jwt.sign(
      {
        id: user.id,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    const response = NextResponse.json({
      message: "Login successful",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        image_url: user.image_url,
      },
    });

    response.cookies.set("access_token", appJwt, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24,
    });

    return response;
  } catch (error) {
    console.error("Google login error:", error);
    return NextResponse.json(
      { message: "Authentication failed" },
      { status: 500 }
    );
  }
}
