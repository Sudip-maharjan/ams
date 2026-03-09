// import { BookOpen, HelpCircle } from "lucide-react";

// export default function StudentDetails() {
//   return (
//     <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
//       <div className="p-6"></div>
//     </div>
//   );
// }

"use client";

import { useState } from "react";

const CATEGORIES = ["Open", "Scholarship", "Quota"];
const PROGRAMS = ["MBBS", "BDS", "B.Sc Nursing", "BASLP", "B.Pharm"];
const COLLEGES = [
  "Institute of Medicine (IOM)",
  "BP Koirala Institute",
  "Manipal College of Medical Sciences",
  "Kathmandu Medical College",
  "Nobel Medical College",
];
const GENDERS = ["Male", "Female", "Other"];
const BLOOD_GROUPS = ["A+", "A−", "B+", "B−", "AB+", "AB−", "O+", "O−"];
const NATIONALITY_DOCS = ["Citizenship", "Passport", "Birth Certificate"];
const SALUTATIONS = ["Mr.", "Ms.", "Mrs.", "Dr."];

export default function StudentDetails({ onSubmit }) {
  const [form, setForm] = useState({
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

  const [errors, setErrors] = useState({});

  const required = [
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

  const handle = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validate = () => {
    const errs = {};
    required.forEach((f) => {
      if (!form[f]) errs[f] = "This field is required";
    });
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errs.email = "Enter a valid email";
    if (form.mobileNumber && !/^\d{10}$/.test(form.mobileNumber))
      errs.mobileNumber = "Enter a valid 10-digit number";
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    onSubmit?.(form);
  };

  // Reusable field components
  const Label = ({ children, required }) => (
    <label className="block text-sm font-medium text-slate-700 mb-1.5">
      {children}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
  );

  const Input = ({ field, placeholder, type = "text", className = "" }) => (
    <div className={className}>
      <input
        type={type}
        value={form[field]}
        onChange={handle(field)}
        placeholder={placeholder}
        className={`w-full px-3.5 py-2.5 rounded-lg border text-sm text-slate-800 placeholder-slate-400 bg-white transition-all outline-none
          ${
            errors[field]
              ? "border-red-400 ring-1 ring-red-300 focus:ring-red-400"
              : "border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
          }`}
      />
      {errors[field] && (
        <p className="mt-1 text-xs text-red-500">{errors[field]}</p>
      )}
    </div>
  );

  const Select = ({ field, placeholder, options, className = "" }) => (
    <div className={className}>
      <select
        value={form[field]}
        onChange={handle(field)}
        className={`w-full px-3.5 py-2.5 rounded-lg border text-sm bg-white transition-all outline-none appearance-none cursor-pointer
          ${!form[field] ? "text-slate-400" : "text-slate-800"}
          ${
            errors[field]
              ? "border-red-400 ring-1 ring-red-300 focus:ring-red-400"
              : "border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
          }`}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((o) => (
          <option key={o} value={o} className="text-slate-800">
            {o}
          </option>
        ))}
      </select>
      {errors[field] && (
        <p className="mt-1 text-xs text-red-500">{errors[field]}</p>
      )}
    </div>
  );

  const Divider = ({ label }) => (
    <div className="flex items-center gap-3 my-6">
      <div className="h-px flex-1 bg-slate-100" />
      <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">
        {label}
      </span>
      <div className="h-px flex-1 bg-slate-100" />
    </div>
  );

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-6">
        {/* Header */}
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
          {/* Category */}
          <div>
            <Label required>Category</Label>
            <Select
              field="category"
              placeholder="Select Category"
              options={CATEGORIES}
            />
          </div>

          {/* MEC Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <Label required>MEC Roll Number</Label>
              <Input field="mecRollNumber" placeholder="2024XXXX" />
            </div>
            <div>
              <Label required>MEC Rank</Label>
              <Input field="mecRank" placeholder="120" type="number" />
            </div>
            <div>
              <Label required>MEC Score</Label>
              <Input field="mecScore" placeholder="100" type="number" />
            </div>
          </div>

          {/* Program & College */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label required>Program</Label>
              <Select
                field="program"
                placeholder="Select program"
                options={PROGRAMS}
              />
            </div>
            <div>
              <Label required>College</Label>
              <Select
                field="college"
                placeholder="Select college"
                options={COLLEGES}
              />
            </div>
          </div>

          <Divider label="Personal Information" />

          {/* Name Row */}
          <div>
            <Label required>Name</Label>
            <div className="grid grid-cols-[130px_1fr_1fr] gap-3">
              <Select
                field="salutation"
                placeholder="Select"
                options={SALUTATIONS}
              />
              <Input field="firstName" placeholder="First name" />
              <Input field="middleName" placeholder="Middle name" />
            </div>
          </div>
          <div>
            <Label required>Last Name</Label>
            <Input field="lastName" placeholder="Last name" />
          </div>

          {/* Nepali Names */}
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
              <Input field="firstNameNepali" placeholder="पहिलो नाम" />
            </div>
            <div>
              <Label>Middle Name (Nepali)</Label>
              <Input field="middleNameNepali" placeholder="बीचको नाम" />
            </div>
            <div>
              <Label required>Last Name (Nepali)</Label>
              <Input field="lastNameNepali" placeholder="थर" />
            </div>
          </div>

          {/* DOB, Gender */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <Label required>Date of Birth (AD)</Label>
              <Input field="dobAD" placeholder="YYYY-MM-DD" type="date" />
            </div>
            <div>
              <Label>Date of Birth (BS)</Label>
              <Input field="dobBS" placeholder="YYYY-MM-DD" />
            </div>
            <div>
              <Label required>Gender</Label>
              <Select
                field="gender"
                placeholder="Select Gender"
                options={GENDERS}
              />
            </div>
          </div>

          {/* Contact */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <Label required>Mobile Number (Nepali)</Label>
              <Input field="mobileNumber" placeholder="98XXXXXXXX" type="tel" />
            </div>
            <div>
              <Label required>Email</Label>
              <Input
                field="email"
                placeholder="example@example.com"
                type="email"
              />
            </div>
            <div>
              <Label>Blood Group</Label>
              <Select
                field="bloodGroup"
                placeholder="Select Blood Group"
                options={BLOOD_GROUPS}
              />
            </div>
          </div>

          {/* Nationality Doc */}
          <div className="max-w-xs">
            <Label required>Nationality Document Type</Label>
            <Select
              field="nationalityDocType"
              placeholder="Select Nationality Document Type"
              options={NATIONALITY_DOCS}
            />
          </div>

          {/* Submit */}
          <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                setForm(
                  Object.fromEntries(Object.keys(form).map((k) => [k, ""])),
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
