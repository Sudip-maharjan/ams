import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET ?? "change-me-in-production-min-32-chars!!",
);

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAdminRoute = pathname.startsWith("/admin");
  const isLoginPage = pathname === "/admin/login";

  const token = request.cookies.get("admin_token")?.value;

  let isValidToken = false;
  if (token) {
    try {
      await jwtVerify(token, SECRET);
      isValidToken = true;
    } catch {
      isValidToken = false;
    }
  }

  if (isAdminRoute && !isLoginPage && !isValidToken) {
    const response = NextResponse.redirect(
      new URL("/admin/login", request.url),
    );
    if (token)
      response.cookies.set("admin_token", "", { maxAge: 0, path: "/" });
    return response;
  }

  if (isLoginPage && isValidToken) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
