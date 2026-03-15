import { SignJWT, jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET ?? "change-me-in-production-min-32-chars!!",
);

const COOKIE_NAME = "admin_token";
const EXPIRY = "8h";

export async function signAdminToken(payload: {
  id: string;
  username: string;
}) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(EXPIRY)
    .sign(SECRET);
}

export async function verifyAdminToken(token: string) {
  const { payload } = await jwtVerify(token, SECRET);
  return payload as { id: string; username: string };
}

export { COOKIE_NAME };
