import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { username, password } = await req.json();

  // Replace with DB lookup + bcrypt compare in production
  if (username === "admin" && password === "admin") {
    const response = NextResponse.json({ success: true });
    response.cookies.set("admin_token", "your-secret-token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 8, // 8 hours
      path: "/",
    });
    return response;
  }

  return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
}
