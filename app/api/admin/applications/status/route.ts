import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyAdminToken } from "@/lib/auth";

export async function PATCH(req: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;
  if (!token)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    await verifyAdminToken(token);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id, status } = await req.json();

  const validStatuses = ["SUBMITTED", "UNDER_REVIEW", "APPROVED", "REJECTED"];
  if (!id || !validStatuses.includes(status)) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const updated = await prisma.studentApplication.update({
    where: { id },
    data: { status },
    select: { id: true, status: true },
  });

  return NextResponse.json(updated);
}
