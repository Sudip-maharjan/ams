# AMS — Admission Management System

A full-stack web application for managing student admissions for the **IOM (Institute of Medicine) Bachelor Program** under Tribhuvan University. Built with Next.js 16, Prisma, and MongoDB.

---

## Features

- **Landing page** with document requirements, mandatory/conditional document lists, and admission notices
- **Multi-field student application form** with client-side validation (English & Nepali name fields, MEC details, program/college selection, DOB in AD & BS with auto-conversion, etc.)
- **Category & subcategory support** — Open, Foreign, and Scholarship categories with subcategory selection
- **DOB auto-conversion** — entering a complete date in AD auto-fills BS (and vice versa), with format and range validation
- **Academic information section** — two qualification blocks (Grade 10 & Higher Secondary level) with qualification name, university/board, passing year, school details, country, and symbol number; all fields validated before submission
- **Guardian information section** — Father and Mother details (name & phone required), plus optional Guardian and Grandfather blocks; email and phone format validated where provided
- **Modular form architecture** — `FormLayout` orchestrates `StudentDetails`, `Address`, `AcademicInfo`, and `GuardianInfo` components via `forwardRef`, each exposing `validate()` and `reset()` methods
- **`FormActions` component** — dedicated Reset/Submit buttons with loading state
- **Success page** — displays the generated AMS code after successful submission
- **Server-side AMS code generation** — unique submission code generated on the server and returned after successful submission
- **Admin section** with login/logout routes
- **MongoDB** backend via Prisma ORM with a custom output path

---

## Tech Stack

| Layer     | Technology                         |
| --------- | ---------------------------------- |
| Framework | Next.js 16 (App Router, Turbopack) |
| Language  | TypeScript                         |
| Database  | MongoDB Atlas                      |
| ORM       | Prisma 6                           |
| Styling   | Tailwind CSS                       |
| Animation | Framer Motion                      |
| Icons     | Lucide React                       |

---

## Project Structure

```
ams/
├── app/
│   ├── admin/             # Admin login & dashboard pages
│   ├── api/
│   │   ├── admin/         # Login & logout API routes
│   │   └── students/      # Student application POST endpoint
│   ├── components/
│   │   ├── FormComp/      # FormLayout, StudentDetails, Address, AcademicInfo, GuardianInfo, FormActions
│   │   └── Header.tsx
│   ├── students/          # Student application form page
│   ├── success/           # Success page — displays AMS code from URL search param
│   └── page.tsx           # Landing page
├── lib/
│   ├── data/              # Static data (colleges, programs, categories, requirements)
│   ├── generated/prisma/  # Auto-generated Prisma client
│   └── prisma.ts          # Prisma client singleton
└── prisma/
    └── schema.prisma      # Database schema
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- A MongoDB Atlas cluster (or local MongoDB instance)

### Installation

```bash
git clone https://github.com/Sudip-maharjan/ams.git
cd ams
npm install
```

### Environment Setup

Create a `.env` file in the project root:

```env
DATABASE_URL="mongodb+srv://<user>:<password>@<cluster>.mongodb.net/ams"
```

### Database Setup

```bash
npx prisma generate
npx prisma db push
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## API Reference

### `POST /api/students`

Creates a new student application. Returns the created record including the server-generated `amsCode`.

**Request body:**

```json
{
  "category": "Open",
  "mecRollNumber": "2024XXXX",
  "mecRank": 42,
  "mecScore": 480.5,
  "program": "MBBS",
  "college": "Maharajgunj Medical Campus (MMC)",
  "salutation": "Mr.",
  "firstName": "Sudip",
  "middleName": "",
  "lastName": "Maharjan",
  "firstNameNepali": "सुदिप",
  "middleNameNepali": "",
  "lastNameNepali": "महर्जन",
  "dobAD": "2003-08-24",
  "dobBS": "2060-05-07",
  "gender": "Male",
  "mobileNumber": "98XXXXXXXX",
  "email": "example@example.com",
  "bloodGroup": "A+",
  "nationalityDocType": "Citizenship",
  "address": {
    "permanent": {
      "country": "Nepal",
      "province": "Bagmati",
      "district": "Kathmandu",
      "municipality": "Kathmandu Metropolitan",
      "wardNumber": "10",
      "locality": "Thamel"
    },
    "temporary": {
      "country": "Nepal",
      "province": "Bagmati",
      "district": "Kathmandu",
      "municipality": "Kathmandu Metropolitan",
      "wardNumber": "10",
      "locality": "Thamel"
    },
    "sameAsPermanent": false
  },
  "academic": {
    "qualification1": {
      "qualificationName": "SEE",
      "universityBoard": "National Examinations Board",
      "passingYearAD": "2020",
      "schoolName": "Example School",
      "schoolAddress": "Kathmandu",
      "country": "Nepal",
      "symbolNumber": "1234567"
    },
    "qualification2": {
      "qualificationName": "10+2 (NEB)",
      "universityBoard": "National Examinations Board",
      "passingYearAD": "2022",
      "schoolName": "Example College",
      "schoolAddress": "Kathmandu",
      "country": "Nepal",
      "symbolNumber": "7654321"
    }
  },
  "guardian": {
    "father": {
      "name": "Ram Maharjan",
      "phone": "9800000001",
      "email": "ram@example.com",
      "education": "Bachelor",
      "occupation": "Businessman"
    },
    "mother": {
      "name": "Sita Maharjan",
      "phone": "9800000002",
      "email": "",
      "education": "SLC",
      "occupation": "Homemaker"
    },
    "guardian": {
      "name": "",
      "phone": "",
      "email": "",
      "education": "",
      "occupation": "",
      "relationToStudent": ""
    },
    "grandfather": {
      "name": "Hari Maharjan"
    }
  }
}
```

**Response `201`:**

```json
{
  "id": "...",
  "amsCode": "AMS-B02E3FCA",
  "status": "SUBMITTED",
  ...
}
```

---

## Data Model

```prisma
type AddressBlock {
  country      String
  province     String
  district     String
  municipality String
  wardNumber   String
  locality     String
}

type QualificationBlock {
  qualificationName String
  universityBoard   String
  passingYearAD     String
  schoolName        String
  schoolAddress     String
  country           String
  symbolNumber      String
}

type ParentBlock {
  name       String
  phone      String
  email      String?
  education  String?
  occupation String?
}

type GuardianBlock {
  name              String?
  phone             String?
  email             String?
  education         String?
  occupation        String?
  relationToStudent String?
}

model StudentApplication {
  id        String            @id @default(auto()) @map("_id") @db.ObjectId
  amsCode   String            @unique
  status    ApplicationStatus @default(SUBMITTED)
  createdAt DateTime          @default(now())

  category      String
  subCategory   String?
  mecRollNumber String
  mecRank       Int
  mecScore      Float
  program       String
  college       String

  salutation String
  firstName  String
  middleName String?
  lastName   String

  firstNameNepali  String
  middleNameNepali String?
  lastNameNepali   String

  dobAD DateTime
  dobBS String?

  gender             String
  mobileNumber       String
  email              String
  bloodGroup         String?
  nationalityDocType String

  permanentAddress AddressBlock
  temporaryAddress AddressBlock

  qualification1 QualificationBlock
  qualification2 QualificationBlock

  father          ParentBlock
  mother          ParentBlock
  guardian        GuardianBlock?
  grandfatherName String?
}
```

---

## Scripts

```bash
npm run dev        # Start development server
npm run build      # Production build
npm run start      # Start production server
npm run lint       # Run ESLint
npx prisma studio  # Open Prisma database GUI
```

---

## Important Notes

- The `amsCode` is always generated server-side and cannot be set by the client.
- The `status` field defaults to `SUBMITTED` and is always hardcoded on creation.
- DOB conversion helpers (`convertADtoBS`, `convertBStoAD`) and constants (`CATEGORIES`, `PROGRAMS`, `GENDERS`, `SALUTATIONS`) are colocated in `@/lib/data/` for reuse across components.
- `StudentDetails`, `Address`, `AcademicInfo`, and `GuardianInfo` all use `forwardRef` — `FormLayout` calls `validate()` on all four before submitting and `reset()` on all four when Reset is clicked.
- `AddressBlock`, `QualificationBlock`, `ParentBlock`, and `GuardianBlock` are embedded Prisma types — stored as inline BSON objects within `StudentApplication`, not as separate collections.
- `guardian` and `grandfatherName` are optional — the API only persists `guardian` if `guardian.name` is non-empty.
- After any schema change, run `npx prisma generate` followed by `npm run dev` with a cleared `.next` cache (`rm -rf .next`).
