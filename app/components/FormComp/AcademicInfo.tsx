"use client";
import { useState, useEffect, useImperativeHandle, forwardRef } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type QualificationBlock = {
  qualificationName: string;
  universityBoard: string;
  passingYearAD: string;
  schoolName: string;
  schoolAddress: string;
  country: string;
  symbolNumber: string;
};

export type AcademicFields = {
  qualification1: QualificationBlock;
  qualification2: QualificationBlock;
};

export type AcademicInfoHandle = {
  validate: () => AcademicFields | null;
  reset: () => void;
};

// ─── Static Data ──────────────────────────────────────────────────────────────

const QUALIFICATION_1_OPTIONS = [
  "SLC",
  "SEE",
  "O Level",
  "IGCSE (Grade 10)",
  "Other (Grade 10 Equivalent)",
];

const QUALIFICATION_2_OPTIONS = [
  "10+2 (NEB)",
  "I.Sc (PCL Science)",
  "A Level",
  "PCL Degree",
  "Diploma (3 Years)",
  "Other (Higher Secondary Equivalent)",
];

const COUNTRIES = [
  "Nepal",
  "India",
  "China",
  "United States",
  "United Kingdom",
  "Australia",
  "Canada",
  "Germany",
  "Other",
];

// Generate passing years from current year down to 1990
const PASSING_YEARS: string[] = Array.from(
  { length: new Date().getFullYear() - 1989 },
  (_, i) => String(new Date().getFullYear() - i),
);

// ─── Shared sub-components ────────────────────────────────────────────────────

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

const InputField = ({
  placeholder,
  value,
  error,
  onChange,
}: {
  placeholder: string;
  value: string;
  error?: string;
  onChange: (val: string) => void;
}) => (
  <div>
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`w-full px-3.5 py-2.5 rounded-lg border text-sm text-slate-800 placeholder-slate-400 bg-white transition-all outline-none
        ${
          error
            ? "border-red-400 ring-1 ring-red-300 focus:ring-red-400"
            : "border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
        }`}
    />
    {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
  </div>
);

const SelectField = ({
  placeholder,
  options,
  value,
  error,
  onChange,
}: {
  placeholder: string;
  options: string[];
  value: string;
  error?: string;
  onChange: (val: string) => void;
}) => (
  <div>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full px-3.5 py-2.5 rounded-lg border text-sm bg-white transition-all outline-none appearance-none cursor-pointer
        ${!value ? "text-slate-400" : "text-slate-800"}
        ${
          error
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
    {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
  </div>
);

// ─── Qualification block form ─────────────────────────────────────────────────

type QualErrors = Partial<QualificationBlock>;

function QualificationForm({
  index,
  label,
  qualOptions,
  data,
  errors,
  onChange,
}: {
  index: number;
  label: string;
  qualOptions: string[];
  data: QualificationBlock;
  errors: QualErrors;
  onChange: (patch: Partial<QualificationBlock>) => void;
}) {
  return (
    <div className="border border-slate-200 shadow-sm rounded-xl p-5 space-y-4">
      <h3 className="text-sm font-semibold text-slate-700">
        Qualification #{index} ({label})
      </h3>

      {/* Row 1: Qualification name | University/Board | Passing Year */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <Label required>Qualification Name</Label>
          <SelectField
            placeholder="Select level"
            options={qualOptions}
            value={data.qualificationName}
            error={errors.qualificationName}
            onChange={(val) => onChange({ qualificationName: val })}
          />
        </div>
        <div>
          <Label required>University/Board name</Label>
          <InputField
            placeholder="University/Board name"
            value={data.universityBoard}
            error={errors.universityBoard}
            onChange={(val) => onChange({ universityBoard: val })}
          />
        </div>
        <div>
          <Label required>Passing Year AD</Label>
          <SelectField
            placeholder="Select Passing Year"
            options={PASSING_YEARS}
            value={data.passingYearAD}
            error={errors.passingYearAD}
            onChange={(val) => onChange({ passingYearAD: val })}
          />
        </div>
      </div>

      {/* Row 2: School name | School Address | Country */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <Label required>School name</Label>
          <InputField
            placeholder="School name"
            value={data.schoolName}
            error={errors.schoolName}
            onChange={(val) => onChange({ schoolName: val })}
          />
        </div>
        <div>
          <Label required>School Address</Label>
          <InputField
            placeholder="School Address"
            value={data.schoolAddress}
            error={errors.schoolAddress}
            onChange={(val) => onChange({ schoolAddress: val })}
          />
        </div>
        <div>
          <Label required>Country</Label>
          <SelectField
            placeholder="Select Country"
            options={COUNTRIES}
            value={data.country}
            error={errors.country}
            onChange={(val) => onChange({ country: val })}
          />
        </div>
      </div>

      {/* Row 3: Symbol Number */}
      <div className="max-w-xs">
        <Label required>Symbol Number</Label>
        <InputField
          placeholder="Symbol Number"
          value={data.symbolNumber}
          error={errors.symbolNumber}
          onChange={(val) => onChange({ symbolNumber: val })}
        />
      </div>
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const emptyQual = (): QualificationBlock => ({
  qualificationName: "",
  universityBoard: "",
  passingYearAD: "",
  schoolName: "",
  schoolAddress: "",
  country: "Nepal",
  symbolNumber: "",
});

const REQUIRED_KEYS: (keyof QualificationBlock)[] = [
  "qualificationName",
  "universityBoard",
  "passingYearAD",
  "schoolName",
  "schoolAddress",
  "country",
  "symbolNumber",
];

function validateQual(block: QualificationBlock): QualErrors {
  const errs: QualErrors = {};
  REQUIRED_KEYS.forEach((k) => {
    if (!block[k]) errs[k] = "This field is required";
  });
  return errs;
}

// ─── Main component ───────────────────────────────────────────────────────────

type AcademicInfoProps = {
  onChange?: (data: AcademicFields) => void;
};

const AcademicInfo = forwardRef<AcademicInfoHandle, AcademicInfoProps>(
  function AcademicInfo({ onChange }, ref) {
    const [fields, setFields] = useState<AcademicFields>({
      qualification1: emptyQual(),
      qualification2: emptyQual(),
    });

    const [errors, setErrors] = useState<{
      qualification1: QualErrors;
      qualification2: QualErrors;
    }>({ qualification1: {}, qualification2: {} });

    useImperativeHandle(ref, () => ({
      validate: () => {
        const e1 = validateQual(fields.qualification1);
        const e2 = validateQual(fields.qualification2);
        setErrors({ qualification1: e1, qualification2: e2 });

        if (Object.keys(e1).length > 0 || Object.keys(e2).length > 0) {
          // Scroll to this section
          document
            .querySelector("[data-academic-info]")
            ?.scrollIntoView({ behavior: "smooth", block: "start" });
          return null;
        }
        return fields;
      },
      reset: () => {
        setFields({
          qualification1: emptyQual(),
          qualification2: emptyQual(),
        });
        setErrors({ qualification1: {}, qualification2: {} });
      },
    }));

    const updateQual =
      (key: "qualification1" | "qualification2") =>
      (patch: Partial<QualificationBlock>) => {
        setFields((prev) => {
          const updated = { ...prev[key], ...patch };
          return { ...prev, [key]: updated };
        });
        // Clear errors for patched keys
        const patchedKeys = Object.keys(patch) as (keyof QualificationBlock)[];
        setErrors((prev) => ({
          ...prev,
          [key]: {
            ...prev[key],
            ...Object.fromEntries(patchedKeys.map((k) => [k, ""])),
          },
        }));
      };

    // Notify parent after state settles - same pattern as StudemtAddress.tsx
    useEffect(() => {
      onChange?.(fields);
    }, [fields]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
      <div
        data-academic-info
        className="bg-white rounded-xl border border-slate-200 shadow-lg overflow-hidden"
      >
        {/* Section header */}
        <div className="px-8 py-6 border-b border-slate-100 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
            {/* Book icon */}
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
                d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"
              />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-800">
              Academic Information
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Fill in all required fields marked with *
            </p>
          </div>
        </div>

        {/* Qualification blocks */}
        <div className="px-8 py-7 space-y-6">
          <QualificationForm
            index={1}
            label="Grade 10 Level : SLC/SEE/O LEVEL DEGREE"
            qualOptions={QUALIFICATION_1_OPTIONS}
            data={fields.qualification1}
            errors={errors.qualification1}
            onChange={updateQual("qualification1")}
          />

          <QualificationForm
            index={2}
            label="Higher Secondary/ Certificate Level : 10+2/I SC/A LEVEL/ PCL DEGREE"
            qualOptions={QUALIFICATION_2_OPTIONS}
            data={fields.qualification2}
            errors={errors.qualification2}
            onChange={updateQual("qualification2")}
          />
        </div>
      </div>
    );
  },
);

export default AcademicInfo;
