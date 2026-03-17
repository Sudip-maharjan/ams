// lib/seed.ts
// Run with: npx tsx lib/seed.ts [count]
import { prisma } from "./prisma";
import { faker } from "@faker-js/faker";
import { ApplicationStatus } from "./generated/prisma";

// ── constants matching real data ─────────────────────────────────────────────

const PROGRAMS = [
  "MBBS",
  "BDS",
  "BPH",
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
  "Universal College of Medical Sciences",
  "Kist Medical College",
  "Nepalgunj Medical College",
  "Gandaki Medical College",
];

const CATEGORIES = ["Open", "Reserved", "Scholarship", "Foreign"];

const SUB_CATEGORIES: Record<string, string[]> = {
  Open: ["MECEE-BL", "MECEE-PCL"],
  Reserved: ["Dalit", "Janajati", "Madhesi", "Muslim", "Disabled"],
  Scholarship: ["Government", "Province", "College"],
  Foreign: ["MECEE-BL", "MECEE-PCL", "NRI"],
};

const PROVINCES = [
  "Koshi Pradesh",
  "Madhesh Pradesh",
  "Bagmati Pradesh",
  "Gandaki Pradesh",
  "Lumbini Pradesh",
  "Karnali Pradesh",
  "Sudurpashchim Pradesh",
];

const DISTRICTS_BY_PROVINCE: Record<string, string[]> = {
  "Koshi Pradesh": ["Morang", "Sunsari", "Jhapa", "Ilam", "Taplejung"],
  "Madhesh Pradesh": ["Bara", "Parsa", "Rautahat", "Sarlahi", "Mahottari"],
  "Bagmati Pradesh": [
    "Kathmandu",
    "Lalitpur",
    "Bhaktapur",
    "Sindhupalchok",
    "Kavrepalanchok",
  ],
  "Gandaki Pradesh": ["Kaski", "Syangja", "Parbat", "Baglung", "Myagdi"],
  "Lumbini Pradesh": [
    "Rupandehi",
    "Kapilvastu",
    "Palpa",
    "Gulmi",
    "Arghakhanchi",
  ],
  "Karnali Pradesh": ["Surkhet", "Salyan", "Dailekh", "Jajarkot", "Rukum West"],
  "Sudurpashchim Pradesh": [
    "Kailali",
    "Kanchanpur",
    "Dadeldhura",
    "Baitadi",
    "Darchula",
  ],
};

const MUNICIPALITIES_BY_DISTRICT: Record<string, string[]> = {
  Kathmandu: [
    "Kathmandu Metropolitan City",
    "Kirtipur Municipality",
    "Kageshwori Manohara Municipality",
  ],
  Lalitpur: [
    "Lalitpur Metropolitan City",
    "Godawari Municipality",
    "Mahalaxmi Municipality",
  ],
  Kaski: ["Pokhara Metropolitan City", "Annapurna Rural Municipality"],
  Rupandehi: ["Butwal Sub-Metropolitan City", "Siddharthanagar Municipality"],
  Salyan: [
    "Chhatreshwori Rural Municipality",
    "Sharada Municipality",
    "Kapurkot Rural Municipality",
  ],
  Morang: ["Biratnagar Metropolitan City", "Rangeli Municipality"],
  Surkhet: ["Birendranagar Municipality", "Gurbhakot Municipality"],
  Kailali: ["Dhangadhi Sub-Metropolitan City", "Tikapur Municipality"],
};

const DEFAULT_MUNICIPALITIES = [
  "Pokhara Metropolitan City",
  "Bharatpur Metropolitan City",
  "Biratnagar Metropolitan City",
  "Butwal Sub-Metropolitan City",
  "Dhangadhi Sub-Metropolitan City",
];

const QUALIFICATIONS_1 = ["SLC", "SEE"];
const QUALIFICATIONS_2 = ["10+2 (NEB)", "A Level", "PCL", "IB", "CBSE +2"];
const BOARDS = [
  "NEB",
  "CTEVT",
  "Cambridge",
  "IB Organization",
  "CBSE",
  "SLC Board",
];
const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];
const SALUTATIONS = ["Mr.", "Ms.", "Mrs."];
const GENDERS = ["Male", "Female"];
const NATIONALITY_DOCS = [
  "Citizenship (नागरिकता)",
  "Passport (राहदानी)",
  "Birth Certificate (जन्मदर्ता)",
];

const STATUSES: ApplicationStatus[] = [
  "SUBMITTED",
  "SUBMITTED",
  "SUBMITTED",
  "UNDER_REVIEW",
  "UNDER_REVIEW",
  "APPROVED",
  "REJECTED",
];

// Reuse same Cloudinary links for all seeded documents
const DOCUMENT_PATHS = {
  nationalityId:
    "https://res.cloudinary.com/drckihwmc/image/upload/v1773655578/iom-admissions/AMS-359FA6A5/nationalityId.png",
  grade10Marksheet:
    "https://res.cloudinary.com/drckihwmc/image/upload/v1773655580/iom-admissions/AMS-359FA6A5/grade10Marksheet.png",
  grade12Marksheet:
    "https://res.cloudinary.com/drckihwmc/image/upload/v1773655583/iom-admissions/AMS-359FA6A5/grade12Marksheet.png",
  grade12Character:
    "https://res.cloudinary.com/drckihwmc/image/upload/v1773655583/iom-admissions/AMS-359FA6A5/grade12Character.jpg",
  signatureSpecimen:
    "https://res.cloudinary.com/drckihwmc/image/upload/v1773655584/iom-admissions/AMS-359FA6A5/signatureSpecimen.png",
  passportPhoto:
    "https://res.cloudinary.com/drckihwmc/image/upload/v1773655586/iom-admissions/AMS-359FA6A5/passportPhoto.png",
  grade10Certificate:
    "https://res.cloudinary.com/drckihwmc/image/upload/v1773655579/iom-admissions/AMS-359FA6A5/grade10Degree.png",
  grade12Provisional:
    "https://res.cloudinary.com/drckihwmc/image/upload/v1773655582/iom-admissions/AMS-359FA6A5/grade12Degree.png",
};

// ── helpers ───────────────────────────────────────────────────────────────────

function amsCode() {
  const hex = Math.floor(Math.random() * 0xffffffff)
    .toString(16)
    .toUpperCase()
    .padStart(8, "0");
  return `AMS-${hex}`;
}

function addressBlock() {
  const province = faker.helpers.arrayElement(PROVINCES);
  const districts = DISTRICTS_BY_PROVINCE[province] ?? ["Kathmandu"];
  const district = faker.helpers.arrayElement(districts);
  const municipalities =
    MUNICIPALITIES_BY_DISTRICT[district] ?? DEFAULT_MUNICIPALITIES;
  const municipality = faker.helpers.arrayElement(municipalities);

  return {
    country: "Nepal",
    province,
    district,
    municipality,
    wardNumber: String(faker.number.int({ min: 1, max: 32 })),
    locality: faker.location.street(),
  };
}

function qualificationBlock(nameOptions: string[]) {
  return {
    qualificationName: faker.helpers.arrayElement(nameOptions),
    universityBoard: faker.helpers.arrayElement(BOARDS),
    passingYearAD: String(faker.number.int({ min: 2010, max: 2024 })),
    schoolName: faker.company.name() + " School",
    schoolAddress: faker.location.city(),
    country: "Nepal",
    symbolNumber: faker.string.alphanumeric(7).toUpperCase(),
  };
}

function parentBlock(sex: "male" | "female") {
  return {
    name: faker.person.fullName({ sex }),
    phone: faker.helpers.arrayElement(["98", "97"]) + faker.string.numeric(8),
    email: faker.internet.email(),
    education: faker.helpers.arrayElement([
      "SLC",
      "SEE",
      "+2",
      "Bachelor",
      "Master",
    ]),
    occupation: faker.person.jobTitle(),
  };
}

function documentFlags() {
  return {
    requiresEquivalence: faker.datatype.boolean({ probability: 0.2 }),
    requiresCouncilCertificate: faker.datatype.boolean({ probability: 0.15 }),
    requiresBridgeCourse: faker.datatype.boolean({ probability: 0.1 }),
  };
}

function makeApplication() {
  const gender = faker.helpers.arrayElement(GENDERS);
  const firstName = faker.person.firstName(
    gender === "Male" ? "male" : "female",
  );
  const lastName = faker.person.lastName();
  const category = faker.helpers.arrayElement(CATEGORIES);
  const subCategory = faker.helpers.arrayElement(SUB_CATEGORIES[category]);
  const status = faker.helpers.arrayElement(STATUSES);
  const address = addressBlock();

  return {
    amsCode: amsCode(),
    status,
    category,
    subCategory,
    mecRollNumber: faker.string.numeric(8),
    mecRank: faker.number.int({ min: 1, max: 5000 }),
    mecScore: parseFloat(faker.number.float({ min: 40, max: 100 }).toFixed(2)),
    program: faker.helpers.arrayElement(PROGRAMS),
    college: faker.helpers.arrayElement(COLLEGES),

    salutation: faker.helpers.arrayElement(SALUTATIONS),
    firstName,
    middleName: faker.helpers.maybe(() =>
      faker.person.firstName(gender === "Male" ? "male" : "female"),
    ),
    lastName,

    firstNameNepali: firstName,
    middleNameNepali: faker.helpers.maybe(() => faker.person.firstName()),
    lastNameNepali: lastName,

    dobAD: faker.date.birthdate({ min: 18, max: 26, mode: "age" }),
    dobBS: faker.helpers.maybe(() => {
      const y = faker.number.int({ min: 2055, max: 2062 });
      const m = faker.number.int({ min: 1, max: 12 });
      const d = faker.number.int({ min: 1, max: 28 });
      return `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    }),

    gender,
    mobileNumber:
      faker.helpers.arrayElement(["98", "97"]) + faker.string.numeric(8),
    email: faker.internet.email({ firstName, lastName }),
    bloodGroup: faker.helpers.maybe(() =>
      faker.helpers.arrayElement(BLOOD_GROUPS),
    ),
    nationalityDocType: faker.helpers.arrayElement(NATIONALITY_DOCS),

    permanentAddress: address,
    temporaryAddress: faker.helpers.maybe(() => addressBlock()) ?? address,

    qualification1: qualificationBlock(QUALIFICATIONS_1),
    qualification2: qualificationBlock(QUALIFICATIONS_2),

    father: parentBlock("male"),
    mother: parentBlock("female"),
    guardian: faker.helpers.maybe(() => ({
      name: faker.person.fullName(),
      phone: faker.helpers.arrayElement(["98", "97"]) + faker.string.numeric(8),
      email: faker.internet.email(),
      education: faker.helpers.arrayElement(["Bachelor", "Master", "+2"]),
      occupation: faker.person.jobTitle(),
      relationToStudent: faker.helpers.arrayElement([
        "Uncle",
        "Aunt",
        "Grandparent",
        "Elder Sibling",
      ]),
    })),
    grandfatherName: faker.helpers.maybe(() =>
      faker.person.fullName({ sex: "male" }),
    ),

    documentFlags: documentFlags(),
    documentPaths: DOCUMENT_PATHS,
  };
}

// ── main ──────────────────────────────────────────────────────────────────────

async function main() {
  const COUNT = parseInt(process.argv[2] ?? "20");
  console.log(`🌱 Seeding ${COUNT} student applications…`);

  const data = Array.from({ length: COUNT }, makeApplication);

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
