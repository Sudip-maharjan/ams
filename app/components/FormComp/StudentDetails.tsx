"use client";
import { useState, useImperativeHandle, forwardRef } from "react";
import "./studentDetails.css";
import {
  validate,
  convertADtoBS,
  convertBStoAD,
} from "./StudentDetailsValidate";
import {
  PROGRAM_COLLEGES,
  CATEGORIES,
  FOREIGN_SUBCATEGORIES,
  SCHOLARSHIP_SUBCATEGORIES,
  PROGRAMS,
  SALUTATIONS,
  GENDERS,
  BLOOD_GROUPS,
  NATIONALITY_DOCS,
} from "@/lib/data/collegeandprog";
import { Label, InputField, SelectField, Divider } from "./FormFields";

export type FormFields = {
  category: string;
  subCategory: string;
  mecRollNumber: string;
  mecRank: string;
  mecScore: string;
  program: string;
  college: string;
  salutation: string;
  firstName: string;
  middleName: string;
  lastName: string;
  firstNameNepali: string;
  middleNameNepali: string;
  lastNameNepali: string;
  dobAD: string;
  dobBS: string;
  gender: string;
  mobileNumber: string;
  email: string;
  bloodGroup: string;
  nationalityDocType: string;
};

export type StudentDetailsHandle = {
  validate: () => FormFields | null;
  reset: () => void;
};

type StudentDetailsProps = {
  onChange?: (form: FormFields) => void;
};

const emptyForm = (): FormFields => ({
  category: "",
  subCategory: "",
  mecRollNumber: "",
  mecRank: "",
  mecScore: "",
  program: "",
  college: "",
  salutation: "",
  firstName: "",
  middleName: "",
  lastName: "",
  firstNameNepali: "",
  middleNameNepali: "",
  lastNameNepali: "",
  dobAD: "",
  dobBS: "",
  gender: "",
  mobileNumber: "",
  email: "",
  bloodGroup: "",
  nationalityDocType: "",
});

const StudentDetails = forwardRef<StudentDetailsHandle, StudentDetailsProps>(
  function StudentDetails({ onChange }, ref) {
    const [form, setForm] = useState<FormFields>(emptyForm());
    const [errors, setErrors] = useState<Partial<FormFields>>({});

    useImperativeHandle(ref, () => ({
      validate: () => {
        const errs = validate(form);
        if (Object.keys(errs).length > 0) {
          setErrors(errs);
          setTimeout(() => {
            document
              .querySelector("[data-student-details]")
              ?.scrollIntoView({ behavior: "smooth", block: "start" });
          }, 50);
          return null;
        }
        return form;
      },
      reset: () => {
        setForm(emptyForm());
        setErrors({});
      },
    }));

    // Single unified handler — takes a field key and returns a (val: string) => void
    const handle = (field: keyof FormFields) => (value: string) => {
      setForm((prev) => {
        let next: FormFields = {
          ...prev,
          [field]: value,
          ...(field === "program" ? { college: "" } : {}),
          ...(field === "category" ? { subCategory: "" } : {}),
        };

        if (field === "dobAD" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
          const bs = convertADtoBS(value);
          if (bs) next = { ...next, dobBS: bs };
        }

        if (field === "dobBS" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
          const ad = convertBStoAD(value);
          if (ad) next = { ...next, dobAD: ad };
        }

        onChange?.(next);
        return next;
      });

      setErrors((prev) => ({
        ...prev,
        [field]: "",
        ...(field === "dobAD" ? { dobBS: "" } : {}),
        ...(field === "dobBS" ? { dobAD: "" } : {}),
      }));
    };

    const availableColleges = form.program
      ? (PROGRAM_COLLEGES[form.program] ?? [])
      : [];

    return (
      <div
        data-student-details
        className="bg-white rounded-xl border border-slate-200 shadow-lg overflow-hidden"
      >
        <div className="p-2">
          <div className="px-8 py-6 border-b border-slate-100 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
              <svg
                className="w-5 h-5 text-blue-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.8}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-800">
                Student Details
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Fill in all required fields marked with *
              </p>
            </div>
          </div>

          <div className="px-2 py-7 space-y-5">
            {" "}
            <div className="border border-slate-200 shadow-sm rounded-xl p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label required>Category</Label>
                  <SelectField
                    placeholder="Select Category"
                    options={CATEGORIES}
                    value={form.category}
                    error={errors.category}
                    onChange={handle("category")}
                  />
                </div>
                {(form.category === "Scholarship" ||
                  form.category === "Foreign") && (
                  <div>
                    <Label required>Sub-Category</Label>
                    <SelectField
                      placeholder="Select Sub-Category"
                      options={
                        form.category === "Scholarship"
                          ? SCHOLARSHIP_SUBCATEGORIES
                          : FOREIGN_SUBCATEGORIES
                      }
                      value={form.subCategory}
                      error={errors.subCategory}
                      onChange={handle("subCategory")}
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <Label required>MEC Roll Number</Label>
                  <InputField
                    placeholder="2024XXXX"
                    value={form.mecRollNumber}
                    error={errors.mecRollNumber}
                    inputMode="numeric"
                    numericOnly
                    onChange={handle("mecRollNumber")}
                  />
                </div>
                <div>
                  <Label required>MEC Rank</Label>
                  <InputField
                    placeholder="120"
                    value={form.mecRank}
                    error={errors.mecRank}
                    inputMode="numeric"
                    numericOnly
                    onChange={handle("mecRank")}
                  />
                </div>
                <div>
                  <Label required>MEC Score</Label>
                  <InputField
                    placeholder="100"
                    value={form.mecScore}
                    error={errors.mecScore}
                    inputMode="numeric"
                    numericOnly
                    onChange={handle("mecScore")}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label required>Program</Label>
                  <SelectField
                    placeholder="Select program"
                    options={PROGRAMS}
                    value={form.program}
                    error={errors.program}
                    onChange={handle("program")}
                  />
                </div>
                <div>
                  <Label required>College</Label>
                  <SelectField
                    placeholder={
                      form.program ? "Select college" : "Select a program first"
                    }
                    options={availableColleges}
                    disabled={!form.program}
                    value={form.college}
                    error={errors.college}
                    onChange={handle("college")}
                  />
                  {form.program && availableColleges.length > 0 && (
                    <p className="mt-1 text-xs text-slate-400">
                      {availableColleges.length} college
                      {availableColleges.length !== 1 ? "s" : ""} available for{" "}
                      {form.program}
                    </p>
                  )}
                </div>
              </div>

              <Divider label="Personal Information" />

              <div>
                <Label required>Name</Label>
                <div className="grid grid-cols-[75px_1fr] sm:grid-cols-[130px_1fr_1fr] gap-3">
                  <SelectField
                    placeholder="Select"
                    options={SALUTATIONS}
                    value={form.salutation}
                    error={errors.salutation}
                    onChange={handle("salutation")}
                  />
                  <InputField
                    placeholder="First name"
                    value={form.firstName}
                    error={errors.firstName}
                    noNumbers
                    onChange={handle("firstName")}
                  />
                  <InputField
                    placeholder="Middle name"
                    value={form.middleName}
                    error={errors.middleName}
                    noNumbers
                    className="col-span-2 sm:col-span-1"
                    onChange={handle("middleName")}
                  />
                </div>
              </div>

              <div>
                <Label required>Last Name</Label>
                <InputField
                  placeholder="Last name"
                  value={form.lastName}
                  error={errors.lastName}
                  noNumbers
                  onChange={handle("lastName")}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <Label required>
                    First Name (Nepali)
                    <span
                      className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full bg-blue-100 text-blue-500 text-[10px] cursor-help"
                      title="Enter name in Devanagari script"
                    >
                      ?
                    </span>
                  </Label>
                  <InputField
                    placeholder="पहिलो नाम"
                    value={form.firstNameNepali}
                    error={errors.firstNameNepali}
                    noNumbers
                    onChange={handle("firstNameNepali")}
                  />
                </div>
                <div>
                  <Label>Middle Name (Nepali)</Label>
                  <InputField
                    placeholder="बीचको नाम"
                    value={form.middleNameNepali}
                    error={errors.middleNameNepali}
                    noNumbers
                    onChange={handle("middleNameNepali")}
                  />
                </div>
                <div>
                  <Label required>Last Name (Nepali)</Label>
                  <InputField
                    placeholder="थर"
                    value={form.lastNameNepali}
                    error={errors.lastNameNepali}
                    noNumbers
                    onChange={handle("lastNameNepali")}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <Label required>Date of Birth (AD)</Label>
                  <InputField
                    placeholder="YYYY-MM-DD"
                    type="date"
                    value={form.dobAD}
                    error={errors.dobAD}
                    onChange={handle("dobAD")}
                  />
                </div>
                <div>
                  <Label>Date of Birth (BS)</Label>
                  <InputField
                    placeholder="YYYY-MM-DD"
                    type="date"
                    value={form.dobBS}
                    error={errors.dobBS}
                    onChange={handle("dobBS")}
                  />
                </div>
                <div>
                  <Label required>Gender</Label>
                  <SelectField
                    placeholder="Select Gender"
                    options={GENDERS}
                    value={form.gender}
                    error={errors.gender}
                    onChange={handle("gender")}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <Label required>Mobile Number (Nepali)</Label>
                  <InputField
                    placeholder="98XXXXXXXX"
                    type="tel"
                    value={form.mobileNumber}
                    error={errors.mobileNumber}
                    onChange={handle("mobileNumber")}
                  />
                </div>
                <div>
                  <Label required>Email</Label>
                  <InputField
                    placeholder="example@example.com"
                    type="email"
                    value={form.email}
                    error={errors.email}
                    onChange={handle("email")}
                  />
                </div>
                <div>
                  <Label>Blood Group</Label>
                  <SelectField
                    placeholder="Select Blood Group"
                    options={BLOOD_GROUPS}
                    value={form.bloodGroup}
                    error={errors.bloodGroup}
                    onChange={handle("bloodGroup")}
                  />
                </div>
              </div>

              <div className="max-w-xs">
                <Label required>Nationality Document Type</Label>
                <SelectField
                  placeholder="Select Nationality Document Type"
                  options={NATIONALITY_DOCS}
                  value={form.nationalityDocType}
                  error={errors.nationalityDocType}
                  onChange={handle("nationalityDocType")}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  },
);

export default StudentDetails;
