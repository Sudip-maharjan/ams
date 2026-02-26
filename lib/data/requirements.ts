import {
  FileText,
  User,
  PenTool,
  FileCheck,
  GraduationCap,
  CreditCard,
} from "lucide-react";
export const documentRequirements = [
  {
    id: 1,
    type: "Passport Size Photo",
    dimension: "350x450 px",
    maxSize: "200 KB",
  },
  {
    id: 2,
    type: "Citizenship/Passport",
    dimension: "800x600 px",
    maxSize: "500 KB",
  },
  {
    id: 3,
    type: "Academic Transcripts",
    dimension: "A4 Scan",
    maxSize: "1 MB",
  },
  { id: 4, type: "Bank Voucher", dimension: "Clear Scan", maxSize: "500 KB" },
];

export const mandatoryDocuments = [
  { icon: User, text: "Recent Passport Size Photograph" },
  {
    icon: CreditCard,
    text: "Citizenship Certificate or Passport",
  },
  {
    icon: GraduationCap,
    text: "SLC/SEE Marksheet & Character Certificate",
  },
  {
    icon: GraduationCap,
    text: "Plus Two/PCL Transcript & Character Certificate",
  },
  {
    icon: FileCheck,
    text: "Bank Deposit Voucher / Payment Proof",
  },
  { icon: PenTool, text: "Scanned Signature" },
];

export const conditionalDocuments = [
  {
    icon: FileText,
    text: "Equivalence Certificate (if studied abroad)",
  },
  {
    icon: FileText,
    text: "Reservation Category Certificate (if applicable)",
  },
  {
    icon: FileText,
    text: "Professional Council Registration (if applicable)",
  },
  { icon: User, text: "Identification Document of Guardian" },
];
