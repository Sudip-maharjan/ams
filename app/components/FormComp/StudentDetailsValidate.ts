import NepaliDate from "nepali-date-converter";
import { FormFields } from "./StudentDetails";

export const requiredFields = (f: FormFields): (keyof FormFields)[] => [
  "category",
  ...(f.category === "Scholarship" || f.category === "Foreign"
    ? (["subCategory"] as (keyof FormFields)[])
    : []),
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
];

export const validate = (f: FormFields): Partial<FormFields> => {
  const errs: Partial<FormFields> = {};

  requiredFields(f).forEach((field) => {
    if (!f[field]) errs[field] = "This field is required";
  });

  if (f.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email))
    errs.email = "Enter a valid email";

  if (f.mobileNumber && !/^\d{10}$/.test(f.mobileNumber))
    errs.mobileNumber = "Enter a valid 10-digit number";

  if (f.dobAD) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(f.dobAD)) {
      errs.dobAD = "Please enter date in YYYY-MM-DD format (e.g., 2025-07-02)";
    } else if (new Date(f.dobAD) >= new Date("2009-12-30")) {
      errs.dobAD = "Date must be before 2009-12-30";
    }
  }

  if (f.dobBS) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(f.dobBS)) {
      errs.dobBS = "Please enter date in YYYY-MM-DD format (e.g., 2082-03-20)";
    } else {
      const [y, m, d] = f.dobBS.split("-").map(Number);
      if (
        y > 2065 ||
        (y === 2065 && m > 12) ||
        (y === 2065 && m === 12 && d > 31)
      ) {
        errs.dobBS = "Date must be before 2065/12/31";
      }
    }
  }

  return errs;
};

export const convertADtoBS = (adValue: string): string | null => {
  try {
    const nd = new NepaliDate(new Date(adValue));
    const y = nd.getYear();
    const m = String(nd.getMonth() + 1).padStart(2, "0");
    const d = String(nd.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  } catch {
    return null;
  }
};

export const convertBStoAD = (bsValue: string): string | null => {
  try {
    const [y, m, d] = bsValue.split("-").map(Number);
    const ad = new NepaliDate(y, m - 1, d).toJsDate();
    const ay = ad.getFullYear();
    const am = String(ad.getMonth() + 1).padStart(2, "0");
    const ad2 = String(ad.getDate()).padStart(2, "0");
    return `${ay}-${am}-${ad2}`;
  } catch {
    return null;
  }
};
