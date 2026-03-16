// lib/seed.ts
// Run with: npx tsx lib/seed.ts
import { prisma } from "./prisma";
import { faker } from "@faker-js/faker";
import { ApplicationStatus } from "./generated/prisma";

// ── helpers ──────────────────────────────────────────────────────────────────

const PROGRAMS = [
  "MBBS",
  "BDS",
  "B.Sc. Nursing",
  "BASLP",
  "B.Sc. MLT",
  "B.Sc. Radiography",
  "B.Pharm",
  "B.Sc. Optometry",
];

const COLLEGES = [
  "Tribhuvan University Teaching Hospital",
  "B.P. Koirala Institute of Health Sciences",
  "Kathmandu Medical College",
  "Nepal Medical College",
  "Manipal College of Medical Sciences",
  "Chitwan Medical College",
  "Lumbini Medical College",
  "Nobel Medical College",
];

const PROVINCES = [
  "Koshi",
  "Madhesh",
  "Bagmati",
  "Gandaki",
  "Lumbini",
  "Karnali",
  "Sudurpashchim",
];

const DISTRICTS = [
  "Kathmandu",
  "Lalitpur",
  "Bhaktapur",
  "Kaski",
  "Chitwan",
  "Morang",
  "Sunsari",
  "Rupandehi",
  "Banke",
  "Bara",
];

const MUNICIPALITIES = [
  "Kathmandu Metropolitan City",
  "Lalitpur Metropolitan City",
  "Pokhara Metropolitan City",
  "Bharatpur Metropolitan City",
  "Biratnagar Metropolitan City",
];

const QUALIFICATIONS = ["PCL", "+2 Science", "A Level", "IB"];
const BOARDS = ["NEB", "CTEVT", "Cambridge", "IB Organization"];
const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];
const SALUTATIONS = ["Mr.", "Ms.", "Mrs."];
const GENDERS = ["Male", "Female", "Other"];
const CATEGORIES = ["Open", "Reserved", "Scholarship"];
const NATIONALITY_DOCS = ["Citizenship", "Passport", "Birth Certificate"];
const STATUSES: ApplicationStatus[] = [
  "SUBMITTED",
  "SUBMITTED",
  "SUBMITTED", // weight towards submitted
  "UNDER_REVIEW",
  "UNDER_REVIEW",
  "APPROVED",
  "REJECTED",
];

let counter = 1;

function amsCode() {
  const hex = Math.floor(Math.random() * 0xffffffff)
    .toString(16)
    .toUpperCase()
    .padStart(8, "0");
  return `AMS-${hex}`;
}

function addressBlock() {
  return {
    country: "Nepal",
    province: faker.helpers.arrayElement(PROVINCES),
    district: faker.helpers.arrayElement(DISTRICTS),
    municipality: faker.helpers.arrayElement(MUNICIPALITIES),
    wardNumber: String(faker.number.int({ min: 1, max: 32 })),
    locality: faker.location.street(),
  };
}

function qualificationBlock() {
  return {
    qualificationName: faker.helpers.arrayElement(QUALIFICATIONS),
    universityBoard: faker.helpers.arrayElement(BOARDS),
    passingYearAD: String(faker.number.int({ min: 2018, max: 2024 })),
    schoolName: faker.company.name() + " School",
    schoolAddress: faker.helpers.arrayElement(DISTRICTS),
    country: "Nepal",
    symbolNumber: faker.string.numeric(7),
  };
}

function parentBlock() {
  const gender = faker.helpers.arrayElement(["male", "female"] as const);
  return {
    name: faker.person.fullName({ sex: gender }),
    phone: "98" + faker.string.numeric(8),
    email: faker.internet.email(),
    education: faker.helpers.arrayElement(["SLC", "+2", "Bachelor", "Master"]),
    occupation: faker.person.jobTitle(),
  };
}

function makeApplication() {
  const gender = faker.helpers.arrayElement(GENDERS);
  const firstName = faker.person.firstName(
    gender === "Male" ? "male" : "female",
  );
  const lastName = faker.person.lastName();
  const program = faker.helpers.arrayElement(PROGRAMS);
  const college = faker.helpers.arrayElement(COLLEGES);
  const status = faker.helpers.arrayElement(STATUSES);

  return {
    amsCode: amsCode(),
    status,
    category: faker.helpers.arrayElement(CATEGORIES),
    subCategory: faker.helpers.maybe(() =>
      faker.helpers.arrayElement(["Dalit", "Janajati", "Madhesi", "Muslim"]),
    ),
    mecRollNumber: faker.string.numeric(8),
    mecRank: faker.number.int({ min: 1, max: 5000 }),
    mecScore: parseFloat(faker.number.float({ min: 40, max: 100 }).toFixed(2)),
    program,
    college,

    salutation: faker.helpers.arrayElement(SALUTATIONS),
    firstName,
    middleName: faker.helpers.maybe(() => faker.person.middleName()),
    lastName,

    firstNameNepali: firstName, // placeholder — real app would use Nepali
    middleNameNepali: null,
    lastNameNepali: lastName,

    dobAD: faker.date.birthdate({ min: 18, max: 26, mode: "age" }),
    dobBS: null,

    gender,
    mobileNumber: "98" + faker.string.numeric(8),
    email: faker.internet.email({ firstName, lastName }),
    bloodGroup: faker.helpers.arrayElement(BLOOD_GROUPS),
    nationalityDocType: faker.helpers.arrayElement(NATIONALITY_DOCS),

    permanentAddress: addressBlock(),
    temporaryAddress: addressBlock(),

    qualification1: qualificationBlock(),
    qualification2: qualificationBlock(),

    father: parentBlock(),
    mother: parentBlock(),
    guardian: faker.helpers.maybe(() => ({
      name: faker.person.fullName(),
      phone: "98" + faker.string.numeric(8),
      email: faker.internet.email(),
      education: "Bachelor",
      occupation: faker.person.jobTitle(),
      relationToStudent: faker.helpers.arrayElement([
        "Uncle",
        "Aunt",
        "Grandparent",
      ]),
    })),
    grandfatherName: faker.person.fullName({ sex: "male" }),

    documentFlags: null,
    documentPaths: null,
  };
}

// ── main ─────────────────────────────────────────────────────────────────────

async function main() {
  const COUNT = parseInt(process.argv[2] ?? "20");

  console.log(`🌱 Seeding ${COUNT} student applications…`);

  const data = Array.from({ length: COUNT }, makeApplication);

  // Insert in batches of 10 to avoid overwhelming the connection
  const BATCH = 10;
  let created = 0;
  for (let i = 0; i < data.length; i += BATCH) {
    const batch = data.slice(i, i + BATCH);
    await Promise.all(
      batch.map((d) => prisma.studentApplication.create({ data: d })),
    );
    created += batch.length;
    console.log(`  ✓ ${created}/${COUNT}`);
  }

  console.log(`✅ Done. ${COUNT} applications seeded.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
