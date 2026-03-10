# AMS — Admission Management System (development phase)

A full-stack web application for managing student admissions for the **IOM (Institute of Medicine) Bachelor Program** under Tribhuvan University. Built with Next.js 16, Prisma, and MongoDB.

---

## Features

- **Landing page** with document requirements, mandatory/conditional document lists, and admission notices
- **Multi-field student application form** with client-side validation (English & Nepali name fields, MEC details, program/college selection, DOB in AD & BS, etc.)
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
│   │   ├── FormComp/      # FormLayout, StudentDetails
│   │   └── Header.tsx
│   ├── students/          # Student application form page
│   └── page.tsx           # Landing page
├── lib/
│   ├── data/              # Static data (colleges, programs, requirements)
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
  "nationalityDocType": "Citizenship"
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
model StudentApplication {
  id                 String            @id @default(auto()) @map("_id") @db.ObjectId
  amsCode            String            @unique
  status             ApplicationStatus @default(SUBMITTED)
  createdAt          DateTime          @default(now())
  category           String
  mecRollNumber      String
  mecRank            Int
  mecScore           Float
  program            String
  college            String
  salutation         String
  firstName          String
  middleName         String?
  lastName           String
  firstNameNepali    String
  middleNameNepali   String?
  lastNameNepali     String
  dobAD              DateTime
  dobBS              String?
  gender             String
  mobileNumber       String
  email              String
  bloodGroup         String?
  nationalityDocType String
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
- After any schema change, run `npx prisma generate` followed by `npm run dev` with a cleared `.next` cache.

---
