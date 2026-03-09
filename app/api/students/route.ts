import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const student = await prisma.studentApplication.create({
      data: {
        amsCode: body.amsCode,
        fullName: body.fullName,
        dob: new Date(body.dob),
        gender: body.gender,
        status: body.status || "SUBMITTED",
      },
    });

    return NextResponse.json(student); // ✅ Always return a JSON response
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Failed to create student application" },
      { status: 500 }, // Important: set status code
    );
  }
}
