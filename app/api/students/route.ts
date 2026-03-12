import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { randomBytes } from "crypto";

type AddressBlock = {
  country: string;
  province: string;
  district: string;
  municipality: string;
  wardNumber: string;
  locality: string;
};
type QualificationBlock = {
  qualificationName: string;
  universityBoard: string;
  passingYearAD: string;
  schoolName: string;
  schoolAddress: string;
  country: string;
  symbolNumber: string;
};

type AddressPayload = {
  permanent: AddressBlock;
  temporary: AddressBlock;
  sameAsPermanent: boolean;
};

const ADDRESS_BLOCK_FIELDS: (keyof AddressBlock)[] = [
  "country",
  "province",
  "district",
  "municipality",
  "wardNumber",
  "locality",
];

/** Returns an array of missing field names within an address block, prefixed with the block label. */
function validateAddressBlock(block: AddressBlock, label: string): string[] {
  return ADDRESS_BLOCK_FIELDS.filter((f) => !block?.[f]).map(
    (f) => `${label}.${f}`,
  );
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

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

    if (
      (body.category === "Scholarship" || body.category === "Foreign") &&
      !body.subCategory
    ) {
      missing.push("subCategory" as never);
    }

    if (missing.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missing.join(", ")}` },
        { status: 400 },
      );
    }

    const address: AddressPayload | undefined = body.address;
    const academic = body.academic as
      | {
          qualification1: QualificationBlock;
          qualification2: QualificationBlock;
        }
      | undefined;

    if (!academic?.qualification1 || !academic?.qualification2) {
      return NextResponse.json(
        { error: "Both qualifications are required" },
        { status: 400 },
      );
    }

    if (!address || !address.permanent || !address.temporary) {
      return NextResponse.json(
        { error: "Both permanent and temporary address are required" },
        { status: 400 },
      );
    }

    const addressErrors = [
      ...validateAddressBlock(address.permanent, "permanentAddress"),
      ...validateAddressBlock(address.temporary, "temporaryAddress"),
    ];

    if (addressErrors.length > 0) {
      return NextResponse.json(
        { error: `Missing address fields: ${addressErrors.join(", ")}` },
        { status: 400 },
      );
    }

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

    const amsCode = "AMS-" + randomBytes(4).toString("hex").toUpperCase();

    const student = await prisma.studentApplication.create({
      data: {
        amsCode,
        status: "SUBMITTED",

        category: body.category,
        subCategory: body.subCategory || null,
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

        permanentAddress: {
          country: address.permanent.country,
          province: address.permanent.province,
          district: address.permanent.district,
          municipality: address.permanent.municipality,
          wardNumber: address.permanent.wardNumber,
          locality: address.permanent.locality,
        },
        temporaryAddress: {
          country: address.temporary.country,
          province: address.temporary.province,
          district: address.temporary.district,
          municipality: address.temporary.municipality,
          wardNumber: address.temporary.wardNumber,
          locality: address.temporary.locality,
        },
        qualification1: { ...academic.qualification1 },
        qualification2: { ...academic.qualification2 },
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
