import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { randomBytes } from "crypto";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // --- Required field validation ---
    const requiredFields = [
      "category",
      "mecRollNumber",
      "mecRank",
      "mecScore",
      "program",
      "college",
      "salutation",
      "firstName",
      "lastName",
      "firstNameNepali",
      "lastNameNepali",
      "dobAD",
      "gender",
      "mobileNumber",
      "email",
      "nationalityDocType",
    ] as const;

    const missing = requiredFields.filter((f) => !body[f]);
    if (missing.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missing.join(", ")}` },
        { status: 400 },
      );
    }

    // --- Type coercions & validation ---
    const dobAD = new Date(body.dobAD);
    if (isNaN(dobAD.getTime())) {
      return NextResponse.json(
        { error: "Invalid date of birth (AD)" },
        { status: 400 },
      );
    }

    const mecRank = parseInt(body.mecRank, 10);
    const mecScore = parseFloat(body.mecScore);
    if (isNaN(mecRank) || isNaN(mecScore)) {
      return NextResponse.json(
        { error: "mecRank must be an integer and mecScore must be a number" },
        { status: 400 },
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 },
      );
    }

    if (!/^\d{10}$/.test(body.mobileNumber)) {
      return NextResponse.json(
        { error: "Mobile number must be exactly 10 digits" },
        { status: 400 },
      );
    }

    // --- Generate unique AMS code server-side ---
    const amsCode = "AMS-" + randomBytes(4).toString("hex").toUpperCase();

    const student = await prisma.studentApplication.create({
      data: {
        amsCode,
        status: "SUBMITTED", // always hardcoded — client cannot override

        category: body.category,
        mecRollNumber: body.mecRollNumber,
        mecRank,
        mecScore,
        program: body.program,
        college: body.college,

        salutation: body.salutation,
        firstName: body.firstName,
        middleName: body.middleName || null,
        lastName: body.lastName,

        firstNameNepali: body.firstNameNepali,
        middleNameNepali: body.middleNameNepali || null,
        lastNameNepali: body.lastNameNepali,

        dobAD,
        dobBS: body.dobBS || null,

        gender: body.gender,
        mobileNumber: body.mobileNumber,
        email: body.email,
        bloodGroup: body.bloodGroup || null,
        nationalityDocType: body.nationalityDocType,
      },
    });

    return NextResponse.json(student, { status: 201 });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Failed to create student application" },
      { status: 500 },
    );
  }
}
