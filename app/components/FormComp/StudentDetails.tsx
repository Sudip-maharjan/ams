"use client";
import { useState } from "react";
import { college_prog } from "@/lib/data/collegeandprog";

const CATEGORIES = ["Open", "Scholarship", "Quota"];
const PROGRAM_COLLEGES: Record<string, string[]> = college_prog;
const PROGRAMS = Object.keys(PROGRAM_COLLEGES);
const GENDERS = ["Male", "Female", "Other"];
const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const NATIONALITY_DOCS = ["Citizenship", "Passport", "Birth Certificate"];
const SALUTATIONS = ["Mr.", "Ms.", "Mrs.", "Dr."];

type FormFields = {
  category: string;
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

type StudentDetailsProps = {
  onSubmit?: (form: FormFields) => void;
};

const Label = ({
  children,
  required,
}: {
  children: React.ReactNode;
  required?: boolean;
}) => (
  <label className="block text-sm font-medium text-slate-700 mb-1.5">
    {children}
    {required && <span className="text-red-500 ml-1">*</span>}
  </label>
);

const Input = ({
  field,
  placeholder,
  type = "text",
  className = "",
  value,
  error,
  onChange,
}: {
  field: keyof FormFields;
  placeholder: string;
  type?: string;
  className?: string;
  value: string;
  error?: string;
  onChange: (
    field: keyof FormFields,
  ) => (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => (
  <div className={className}>
    <input
      type={type}
      value={value}
      onChange={onChange(field)}
      placeholder={placeholder}
      className={`w-full px-3.5 py-2.5 rounded-lg border text-sm text-slate-800 placeholder-slate-400 bg-white transition-all outline-none ${
        error
          ? "border-red-400 ring-1 ring-red-300 focus:ring-red-400"
          : "border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
      }`}
    />
    {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
  </div>
);

const Select = ({
  field,
  placeholder,
  options,
  className = "",
  disabled = false,
  value,
  error,
  onChange,
}: {
  field: keyof FormFields;
  placeholder: string;
  options: string[];
  className?: string;
  disabled?: boolean;
  value: string;
  error?: string;
  onChange: (
    field: keyof FormFields,
  ) => (e: React.ChangeEvent<HTMLSelectElement>) => void;
}) => (
  <div className={className}>
    <select
      value={value}
      onChange={onChange(field)}
      disabled={disabled}
      className={`w-full px-3.5 py-2.5 rounded-lg border text-sm bg-white transition-all outline-none appearance-none ${
        disabled
          ? "cursor-not-allowed opacity-50 bg-slate-50"
          : "cursor-pointer"
      } ${!value ? "text-slate-400" : "text-slate-800"} ${
        error
          ? "border-red-400 ring-1 ring-red-300 focus:ring-red-400"
          : "border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
      }`}
    >
      <option value="" disabled>
        {placeholder}
      </option>
      {options.map((o: string) => (
        <option key={o} value={o} className="text-slate-800">
          {o}
        </option>
      ))}
    </select>
    {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
  </div>
);

const Divider = ({ label }: { label: string }) => (
  <div className="flex items-center gap-3 my-6">
    <div className="h-px flex-1 bg-slate-100" />
    <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">
      {label}
    </span>
    <div className="h-px flex-1 bg-slate-100" />
  </div>
);

export default function StudentDetails({ onSubmit }: StudentDetailsProps) {
  const [form, setForm] = useState<FormFields>({
    category: "",
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

  const [errors, setErrors] = useState<Partial<FormFields>>({});

  const required: (keyof FormFields)[] = [
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
  ];

  const handle =
    (field: keyof FormFields) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const value = e.target.value;
      setForm((prev) => ({
        ...prev,
        [field]: value,
        ...(field === "program" ? { college: "" } : {}),
      }));
      if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
    };

  const availableColleges = form.program
    ? (PROGRAM_COLLEGES[form.program] ?? [])
    : [];

  const validate = (): Partial<FormFields> => {
    const errs: Partial<FormFields> = {};
    required.forEach((f) => {
      if (!form[f]) errs[f] = "This field is required";
    });
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errs.email = "Enter a valid email";
    if (form.mobileNumber && !/^\d{10}$/.test(form.mobileNumber))
      errs.mobileNumber = "Enter a valid 10-digit number";
    return errs;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    onSubmit?.(form);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-6">
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

        <form onSubmit={handleSubmit} className="px-8 py-7 space-y-5">
          <div>
            <Label required>Category</Label>
            <Select
              field="category"
              placeholder="Select Category"
              options={CATEGORIES}
              value={form.category}
              error={errors.category}
              onChange={handle}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <Label required>MEC Roll Number</Label>
              <Input
                field="mecRollNumber"
                placeholder="2024XXXX"
                value={form.mecRollNumber}
                error={errors.mecRollNumber}
                onChange={handle}
              />
            </div>
            <div>
              <Label required>MEC Rank</Label>
              <Input
                field="mecRank"
                placeholder="120"
                type="number"
                value={form.mecRank}
                error={errors.mecRank}
                onChange={handle}
              />
            </div>
            <div>
              <Label required>MEC Score</Label>
              <Input
                field="mecScore"
                placeholder="100"
                type="number"
                value={form.mecScore}
                error={errors.mecScore}
                onChange={handle}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label required>Program</Label>
              <Select
                field="program"
                placeholder="Select program"
                options={PROGRAMS}
                value={form.program}
                error={errors.program}
                onChange={handle}
              />
            </div>
            <div>
              <Label required>College</Label>
              <Select
                field="college"
                placeholder={
                  form.program ? "Select college" : "Select a program first"
                }
                options={availableColleges}
                disabled={!form.program}
                value={form.college}
                error={errors.college}
                onChange={handle}
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
            <div className="grid grid-cols-[130px_1fr_1fr] gap-3">
              <Select
                field="salutation"
                placeholder="Select"
                options={SALUTATIONS}
                value={form.salutation}
                error={errors.salutation}
                onChange={handle}
              />
              <Input
                field="firstName"
                placeholder="First name"
                value={form.firstName}
                error={errors.firstName}
                onChange={handle}
              />
              <Input
                field="middleName"
                placeholder="Middle name"
                value={form.middleName}
                error={errors.middleName}
                onChange={handle}
              />
            </div>
          </div>
          <div>
            <Label required>Last Name</Label>
            <Input
              field="lastName"
              placeholder="Last name"
              value={form.lastName}
              error={errors.lastName}
              onChange={handle}
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
              <Input
                field="firstNameNepali"
                placeholder="पहिलो नाम"
                value={form.firstNameNepali}
                error={errors.firstNameNepali}
                onChange={handle}
              />
            </div>
            <div>
              <Label>Middle Name (Nepali)</Label>
              <Input
                field="middleNameNepali"
                placeholder="बीचको नाम"
                value={form.middleNameNepali}
                error={errors.middleNameNepali}
                onChange={handle}
              />
            </div>
            <div>
              <Label required>Last Name (Nepali)</Label>
              <Input
                field="lastNameNepali"
                placeholder="थर"
                value={form.lastNameNepali}
                error={errors.lastNameNepali}
                onChange={handle}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <Label required>Date of Birth (AD)</Label>
              <Input
                field="dobAD"
                placeholder="YYYY-MM-DD"
                type="date"
                value={form.dobAD}
                error={errors.dobAD}
                onChange={handle}
              />
            </div>
            <div>
              <Label>Date of Birth (BS)</Label>
              <Input
                field="dobBS"
                placeholder="YYYY-MM-DD"
                value={form.dobBS}
                error={errors.dobBS}
                onChange={handle}
              />
            </div>
            <div>
              <Label required>Gender</Label>
              <Select
                field="gender"
                placeholder="Select Gender"
                options={GENDERS}
                value={form.gender}
                error={errors.gender}
                onChange={handle}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <Label required>Mobile Number (Nepali)</Label>
              <Input
                field="mobileNumber"
                placeholder="98XXXXXXXX"
                type="tel"
                value={form.mobileNumber}
                error={errors.mobileNumber}
                onChange={handle}
              />
            </div>
            <div>
              <Label required>Email</Label>
              <Input
                field="email"
                placeholder="example@example.com"
                type="email"
                value={form.email}
                error={errors.email}
                onChange={handle}
              />
            </div>
            <div>
              <Label>Blood Group</Label>
              <Select
                field="bloodGroup"
                placeholder="Select Blood Group"
                options={BLOOD_GROUPS}
                value={form.bloodGroup}
                error={errors.bloodGroup}
                onChange={handle}
              />
            </div>
          </div>

          <div className="max-w-xs">
            <Label required>Nationality Document Type</Label>
            <Select
              field="nationalityDocType"
              placeholder="Select Nationality Document Type"
              options={NATIONALITY_DOCS}
              value={form.nationalityDocType}
              error={errors.nationalityDocType}
              onChange={handle}
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                setForm(
                  Object.fromEntries(
                    Object.keys(form).map((k) => [k, ""]),
                  ) as FormFields,
                );
                setErrors({});
              }}
              className="px-5 py-2.5 rounded-lg text-sm font-medium text-slate-600 border border-slate-200 hover:bg-slate-50 transition-colors"
            >
              Reset
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-lg text-sm font-semibold text-white bg-blue-500 hover:bg-blue-600 active:bg-blue-700 transition-colors shadow-sm shadow-blue-200"
            >
              Save & Continue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
