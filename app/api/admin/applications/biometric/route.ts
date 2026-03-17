import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyAdminToken } from "@/lib/auth";
import cloudinary from "@/lib/cloudinary";

export async function POST(req: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;
  if (!token)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    await verifyAdminToken(token);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id, photo } = await req.json();
  if (!id || !photo)
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });

  const app = await prisma.studentApplication.findUnique({
    where: { id },
    select: { amsCode: true },
  });
  if (!app)
    return NextResponse.json(
      { error: "Application not found" },
      { status: 404 },
    );

  const result = await cloudinary.uploader.upload(photo, {
    folder: `iom-admissions/${app.amsCode}`,
    public_id: `biometric-photo`,
    resource_type: "image",
  });

  const updated = await prisma.studentApplication.update({
    where: { id },
    data: {
      biometricPhotoUrl: result.secure_url,
      biometricCapturedAt: new Date(),
    },
    select: { id: true, biometricPhotoUrl: true },
  });

  return NextResponse.json(updated);
}
