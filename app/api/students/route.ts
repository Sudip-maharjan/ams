import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { randomBytes } from "crypto";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate required fields
    if (!body.fullName || !body.dob || !body.gender) {
      return NextResponse.json(
        { error: "Missing required fields: fullName, dob, gender" },
        { status: 400 },
      );
    }

    const parsedDob = new Date(body.dob);
    if (isNaN(parsedDob.getTime())) {
      return NextResponse.json(
        { error: "Invalid date of birth" },
        { status: 400 },
      );
    }

    // Generate unique AMS code server-side
    const amsCode = "AMS-" + randomBytes(4).toString("hex").toUpperCase();

    const student = await prisma.studentApplication.create({
      data: {
        amsCode,
        fullName: body.fullName,
        dob: parsedDob,
        gender: body.gender,
        status: "SUBMITTED", // always hardcoded — client cannot override
      },
    });

    return NextResponse.json(student);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Failed to create student application" },
      { status: 500 },
    );
  }
}
