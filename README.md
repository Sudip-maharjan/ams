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
- **Document upload section** — drag-and-drop `FileSlot` uploader for 8 mandatory documents (nationality ID, Grade 10 & 12 certificates, marksheets, character certificate, signature specimen, passport photo) plus 3 conditional documents (equivalence certificate, council certificate, bridge course certificate) gated behind checkboxes; 5 MB per-file limit; accepts images and PDF
- **Cloudinary file storage** — uploaded files are streamed to Cloudinary under a per-submission folder (`iom-admissions/<amsCode>`); Cloudinary secure URLs are persisted as `documentPaths` (JSON) in the database
- **Shared form primitives** — `FormFields.tsx` exports `Label`, `InputField` (`numericOnly`/`noNumbers` props), `SelectField` (`disabled` prop), and `Divider`; consumed by all section components, eliminating duplicated local definitions
- **Modular form architecture** — `FormLayout` orchestrates `StudentDetails`, `Address`, `AcademicInfo`, `GuardianInfo`, and `DocumentsUpload` components via `forwardRef`, each exposing `validate()` and `reset()` methods
- **`FormActions` component** — dedicated Reset/Submit buttons with loading state
- **Success page** — displays the generated AMS code after successful submission
- **Server-side AMS code generation** — unique submission code generated on the server and returned after successful submission
- **Admin panel** — protected dashboard with JWT authentication (jose) and bcrypt password hashing; includes stats cards, recent applications table, searchable/filterable requests page, approved students page, and a full application detail/approve view; login page sits outside the `(protected)` route group so it renders without the sidebar; status transitions (approve / reject / under review) handled by a dedicated API route
- **Cryptographic JWT middleware** — `proxy.ts` verifies tokens using jose; the `Admin` model is seeded via `lib/seedadmin.ts`
- **Animated landing page** — `MotionSection.tsx` wraps Framer Motion scroll animations; `LogoComp.tsx` renders the institution logo
- **MongoDB** backend via Prisma ORM with a custom output path

---

## Tech Stack

| Layer     | Technology                  |
| --------- | --------------------------- |
| Framework | Next.js 16.1.6 (App Router) |
| Language  | TypeScript 5                |
| Database  | MongoDB Atlas               |
| ORM       | Prisma 6.19                 |
| Storage   | Cloudinary 2                |
| Auth      | jose 6 (JWT) + bcryptjs     |
| Date      | nepali-date-converter       |
| Styling   | Tailwind CSS 4              |
| Animation | Framer Motion 12            |
| Icons     | Lucide React                |

---

## Project Structure

```
ams/
├── app/
│   ├── admin/
│   │   ├── (protected)/          # Admin layout with responsive sidebar
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx          # Dashboard — stats cards and recent applications
│   │   │   ├── approve/
│   │   │   │   └── page.tsx      # Full application detail and status action view
│   │   │   ├── approved/
│   │   │   │   └── page.tsx      # Approved students list
│   │   │   └── requests/
│   │   │       └── page.tsx      # Searchable, filterable applications list
│   │   └── login/
│   │       └── page.tsx          # Login page — outside (protected), no sidebar
│   ├── api/
│   │   ├── admin/
│   │   │   ├── applications/
│   │   │   │   └── status/
│   │   │   │       └── route.ts  # PATCH — approve / reject / under review
│   │   │   ├── login/
│   │   │   │   └── route.ts      # POST — bcrypt verify + JWT sign
│   │   │   └── logout/
│   │   │       └── route.ts      # POST — clear auth cookie
│   │   └── students/
│   │       └── route.ts          # POST — create application + Cloudinary upload
│   ├── components/
│   │   ├── FormComp/
│   │   │   ├── AcademicInfo.tsx
│   │   │   ├── DocumentsUpload.tsx
│   │   │   ├── FormActions.tsx
│   │   │   ├── FormFields.tsx
│   │   │   ├── FormLayout.tsx
│   │   │   ├── GuardianInfo.tsx
│   │   │   ├── StudemtAddress.tsx
│   │   │   ├── StudentDetails.tsx
│   │   │   ├── StudentDetailsValidate.ts
│   │   │   └── studentDetails.css
│   │   ├── Header.tsx
│   │   ├── LogoComp.tsx
│   │   └── MotionSection.tsx
│   ├── students/
│   │   └── page.tsx              # Student application form page
│   ├── success/
│   │   └── page.tsx              # Displays AMS code from URL search param
│   └── page.tsx                  # Landing page
├── lib/
│   ├── auth.ts                   # jose JWT sign/verify helpers
│   ├── cloudinary.ts             # Cloudinary client singleton
│   ├── data/
│   │   ├── collegeandprog.ts     # Programs, colleges, categories, salutations, etc.
│   │   ├── districts.json
│   │   ├── locallevel.ts
│   │   ├── local_levels.json
│   │   ├── local_level_type.json
│   │   ├── provinces.json
│   │   ├── generate.ts
│   │   └── requirements.ts
│   ├── generated/prisma/         # Auto-generated Prisma client
│   ├── mockData.ts               # Mock application data for admin dev/testing
│   ├── prisma.ts                 # Prisma client singleton
│   └── seedadmin.ts              # Seeds initial Admin account
├── prisma/
│   └── schema.prisma
└── proxy.ts                      # Middleware — cryptographic JWT verification
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

CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"

JWT_SECRET="your_jwt_secret_min_32_chars"
```

### Database Setup

```bash
npx prisma generate
npx prisma db push
npx tsx lib/seedadmin.ts   # Creates the initial admin account
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## API Reference

### `POST /api/students`

Creates a new student application, uploads documents to Cloudinary, and returns the created record including the server-generated `amsCode`.

**Content-Type:** `multipart/form-data`

The request body is a `FormData` object containing:

- `data` — a JSON string with all structured fields (see shape below)
- File fields — one entry per document key (mandatory + any applicable conditional files)

**`data` JSON shape:**

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
  },
  "documents": {
    "requiresEquivalence": false,
    "requiresCouncilCertificate": false,
    "requiresBridgeCourse": false
  }
}
```

**Mandatory file keys** (always required):

`nationalityId`, `grade10Degree`, `grade10Marksheet`, `grade12Degree`, `grade12Marksheet`, `grade12Character`, `signatureSpecimen`, `passportPhoto`

**Conditional file keys** (required only when the corresponding flag is `true`):

`equivalenceCertificate`, `councilCertificate`, `bridgeCourseCertificate`

**Response `201`:**

```json
{
  "id": "...",
  "amsCode": "AMS-B02E3FCA",
  "status": "SUBMITTED",
  ...
}
```

### `POST /api/admin/login`

Verifies admin credentials and sets a signed JWT cookie.

**Request body:** `{ "username": "admin", "password": "..." }`

**Response `200`:** Sets `token` HTTP-only cookie; returns `{ "success": true }`.

### `POST /api/admin/logout`

Clears the JWT cookie. Returns `{ "success": true }`.

### `PATCH /api/admin/applications/[id]/status`

Updates the status of a student application.

**Request body:** `{ "status": "APPROVED" | "REJECTED" | "UNDER_REVIEW" }`

**Response `200`:** Returns the updated application record.

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

  documentFlags Json? # { requiresEquivalence, requiresCouncilCertificate, requiresBridgeCourse }
  documentPaths Json? # { nationalityId, grade10Degree, ... } — Cloudinary secure URLs
}

model Admin {
  id           String   @id @default(auto()) @map("_id") @db.ObjectId
  username     String   @unique
  passwordHash String
  createdAt    DateTime @default(now())
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
- `FormFields.tsx` is the single source of truth for `Label`, `InputField`, `SelectField`, and `Divider` — no component defines its own local versions. `InputField` accepts `numericOnly` and `noNumbers` boolean props that replace standalone `onKeyDown` handlers.
- All `onChange` callbacks across form components use the unified `(val: string) => void` signature.
- `StudentDetails`, `Address`, `AcademicInfo`, `GuardianInfo`, and `DocumentsUpload` all use `forwardRef` — `FormLayout` calls `validate()` on all five before submitting and `reset()` on all five when Reset is clicked. `DocumentsUpload` additionally exposes `getFiles()` to retrieve the `File` objects for `FormData` assembly.
- The API route reads `multipart/form-data` — structured fields arrive as a JSON string in the `data` field, and file uploads as individual `FormData` entries. Files are uploaded to Cloudinary as base64 data URIs with `resource_type: "auto"` (handles both images and PDFs).
- `documentPaths` stores Cloudinary secure URLs as a JSON blob; `documentFlags` stores the three conditional-document booleans.
- `AddressBlock`, `QualificationBlock`, `ParentBlock`, and `GuardianBlock` are embedded Prisma types — stored as inline BSON objects within `StudentApplication`, not as separate collections.
- `guardian` and `grandfatherName` are optional — the API only persists `guardian` if `guardian.name` is non-empty.
- Admin authentication uses **jose** for JWT signing/verification and **bcryptjs** for password hashing. The JWT secret is read from `JWT_SECRET` in `.env`. Tokens are stored as HTTP-only cookies; `proxy.ts` verifies them cryptographically on every protected route.
- The admin login page lives at `app/admin/login/` outside the `(protected)` route group, so it renders without the admin layout (no sidebar).
- Run `npx tsx lib/seedadmin.ts` to create the first admin account before using the admin panel.
- `lib/mockData.ts` provides mock application data for developing and testing the admin panel without live database entries.
- `StudemtAddress.tsx` sources province, district, and local-level data from `lib/data/` JSON files (`provinces.json`, `districts.json`, `local_levels.json`) via `locallevel.ts`.
- After any schema change, run `npx prisma generate` followed by `npm run dev` with a cleared `.next` cache (`rm -rf .next`).
