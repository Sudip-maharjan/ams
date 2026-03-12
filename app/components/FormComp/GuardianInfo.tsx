"use client";
import { useState, useEffect, useImperativeHandle, forwardRef } from "react";

export type ParentBlock = {
  name: string;
  phone: string;
  email: string;
  education: string;
  occupation: string;
};

export type GuardianBlock = {
  name: string;
  phone: string;
  email: string;
  education: string;
  occupation: string;
  relationToStudent: string;
};

export type GrandfatherBlock = {
  name: string;
};

export type GuardianFields = {
  father: ParentBlock;
  mother: ParentBlock;
  guardian: GuardianBlock;
  grandfather: GrandfatherBlock;
};

export type GuardianInfoHandle = {
  validate: () => GuardianFields | null;
  reset: () => void;
};

const emptyParent = (): ParentBlock => ({
  name: "",
  phone: "",
  email: "",
  education: "",
  occupation: "",
});

const emptyGuardian = (): GuardianBlock => ({
  name: "",
  phone: "",
  email: "",
  education: "",
  occupation: "",
  relationToStudent: "",
});

const emptyGrandfather = (): GrandfatherBlock => ({ name: "" });

const emptyFields = (): GuardianFields => ({
  father: emptyParent(),
  mother: emptyParent(),
  guardian: emptyGuardian(),
  grandfather: emptyGrandfather(),
});

type ParentErrors = Partial<Record<keyof ParentBlock, string>>;
type GuardianErrors = Partial<Record<keyof GuardianBlock, string>>;
type GrandfatherErrors = Partial<Record<keyof GrandfatherBlock, string>>;

type AllErrors = {
  father: ParentErrors;
  mother: ParentErrors;
  guardian: GuardianErrors;
  grandfather: GrandfatherErrors;
};

function validateParent(
  p: ParentBlock,
  required: (keyof ParentBlock)[],
): ParentErrors {
  const errs: ParentErrors = {};
  required.forEach((k) => {
    if (!p[k]) errs[k] = "This field is required";
  });
  if (p.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.email))
    errs.email = "Enter a valid email";
  if (p.phone && !/^\d{10}$/.test(p.phone))
    errs.phone = "Enter a valid 10-digit number";
  return errs;
}

function validateGuardianBlock(g: GuardianBlock): GuardianErrors {
  const errs: GuardianErrors = {};
  if (g.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(g.email))
    errs.email = "Enter a valid email";
  if (g.phone && !/^\d{10}$/.test(g.phone))
    errs.phone = "Enter a valid 10-digit number";
  return errs;
}

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
  type = "text",
  inputMode,
  onChange,
}: {
  placeholder: string;
  value: string;
  error?: string;
  type?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  onChange: (val: string) => void;
}) => (
  <div>
    <input
      type={type}
      inputMode={inputMode}
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

function ParentForm({
  title,
  data,
  errors,
  requiredFields,
  onChange,
  onErrorClear,
}: {
  title: string;
  data: ParentBlock;
  errors: ParentErrors;
  requiredFields: (keyof ParentBlock)[];
  onChange: (patch: Partial<ParentBlock>) => void;
  onErrorClear: (keys: (keyof ParentBlock)[]) => void;
}) {
  const handle = (key: keyof ParentBlock) => (val: string) => {
    onChange({ [key]: val });
    onErrorClear([key]);
  };

  const req = (k: keyof ParentBlock) => requiredFields.includes(k);

  return (
    <div className="border border-slate-200 shadow-sm rounded-xl p-5 space-y-4">
      <h3 className="text-sm font-semibold text-slate-700">{title}</h3>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <Label required={req("name")}>Name</Label>
          <InputField
            placeholder="Name"
            value={data.name}
            error={errors.name}
            onChange={handle("name")}
          />
        </div>
        <div>
          <Label required={req("phone")}>Phone</Label>
          <InputField
            placeholder="98XXXXXXXX"
            value={data.phone}
            error={errors.phone}
            type="tel"
            inputMode="numeric"
            onChange={handle("phone")}
          />
        </div>
        <div>
          <Label required={req("email")}>Email</Label>
          <InputField
            placeholder="example@example.com"
            value={data.email}
            error={errors.email}
            type="email"
            onChange={handle("email")}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-sm">
        <div>
          <Label>Education</Label>
          <InputField
            placeholder="Education"
            value={data.education}
            error={errors.education}
            onChange={handle("education")}
          />
        </div>
        <div>
          <Label>Occupation</Label>
          <InputField
            placeholder="Occupation"
            value={data.occupation}
            error={errors.occupation}
            onChange={handle("occupation")}
          />
        </div>
      </div>
    </div>
  );
}

function GuardianForm({
  data,
  errors,
  onChange,
  onErrorClear,
}: {
  data: GuardianBlock;
  errors: GuardianErrors;
  onChange: (patch: Partial<GuardianBlock>) => void;
  onErrorClear: (keys: (keyof GuardianBlock)[]) => void;
}) {
  const handle = (key: keyof GuardianBlock) => (val: string) => {
    onChange({ [key]: val });
    onErrorClear([key]);
  };

  return (
    <div className="border border-slate-200 shadow-sm rounded-xl p-5 space-y-4">
      <h3 className="text-sm font-semibold text-slate-700">
        Guardian&apos;s Information
        <span className="ml-2 text-xs font-normal text-slate-400">
          (optional)
        </span>
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <Label>Name</Label>
          <InputField
            placeholder="Name"
            value={data.name}
            error={errors.name}
            onChange={handle("name")}
          />
        </div>
        <div>
          <Label>Phone</Label>
          <InputField
            placeholder="98XXXXXXXX"
            value={data.phone}
            error={errors.phone}
            type="tel"
            inputMode="numeric"
            onChange={handle("phone")}
          />
        </div>
        <div>
          <Label>Email</Label>
          <InputField
            placeholder="example@example.com"
            value={data.email}
            error={errors.email}
            type="email"
            onChange={handle("email")}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <Label>Education</Label>
          <InputField
            placeholder="Education"
            value={data.education}
            error={errors.education}
            onChange={handle("education")}
          />
        </div>
        <div>
          <Label>Occupation</Label>
          <InputField
            placeholder="Occupation"
            value={data.occupation}
            error={errors.occupation}
            onChange={handle("occupation")}
          />
        </div>
        <div>
          <Label>Relation to Student</Label>
          <InputField
            placeholder="Relation to Student"
            value={data.relationToStudent}
            error={errors.relationToStudent}
            onChange={handle("relationToStudent")}
          />
        </div>
      </div>
    </div>
  );
}

function GrandfatherForm({
  data,
  errors,
  onChange,
  onErrorClear,
}: {
  data: GrandfatherBlock;
  errors: GrandfatherErrors;
  onChange: (patch: Partial<GrandfatherBlock>) => void;
  onErrorClear: (keys: (keyof GrandfatherBlock)[]) => void;
}) {
  return (
    <div className="border border-slate-200 shadow-sm rounded-xl p-5 space-y-4">
      <h3 className="text-sm font-semibold text-slate-700">
        Grandfather&apos;s Information
        <span className="ml-2 text-xs font-normal text-slate-400">
          (optional)
        </span>
      </h3>

      <div className="max-w-xs">
        <Label>Name</Label>
        <InputField
          placeholder="Name"
          value={data.name}
          error={errors.name}
          onChange={(val) => {
            onChange({ name: val });
            onErrorClear(["name"]);
          }}
        />
      </div>
    </div>
  );
}

type GuardianInfoProps = {
  onChange?: (data: GuardianFields) => void;
};

const FATHER_REQUIRED: (keyof ParentBlock)[] = ["name", "phone"];
const MOTHER_REQUIRED: (keyof ParentBlock)[] = ["name", "phone"];

const GuardianInfo = forwardRef<GuardianInfoHandle, GuardianInfoProps>(
  function GuardianInfo({ onChange }, ref) {
    const [fields, setFields] = useState<GuardianFields>(emptyFields());
    const [errors, setErrors] = useState<AllErrors>({
      father: {},
      mother: {},
      guardian: {},
      grandfather: {},
    });

    useImperativeHandle(ref, () => ({
      validate: () => {
        const fe = validateParent(fields.father, FATHER_REQUIRED);
        const me = validateParent(fields.mother, MOTHER_REQUIRED);
        const ge = validateGuardianBlock(fields.guardian);
        const gfe: GrandfatherErrors = {};

        setErrors({ father: fe, mother: me, guardian: ge, grandfather: gfe });

        const hasErrors =
          Object.keys(fe).length > 0 ||
          Object.keys(me).length > 0 ||
          Object.keys(ge).length > 0;

        if (hasErrors) {
          document
            .querySelector("[data-guardian-info]")
            ?.scrollIntoView({ behavior: "smooth", block: "start" });
          return null;
        }
        return fields;
      },
      reset: () => {
        setFields(emptyFields());
        setErrors({ father: {}, mother: {}, guardian: {}, grandfather: {} });
      },
    }));

    function makeUpdater<K extends keyof GuardianFields>(section: K) {
      return (patch: Partial<GuardianFields[K]>) => {
        setFields((prev) => ({
          ...prev,
          [section]: { ...prev[section], ...patch },
        }));
      };
    }

    function makeErrorClearer<K extends keyof AllErrors>(
      section: K,
    ): (keys: string[]) => void {
      return (keys) => {
        setErrors((prev) => ({
          ...prev,
          [section]: {
            ...prev[section],
            ...Object.fromEntries(keys.map((k) => [k, ""])),
          },
        }));
      };
    }

    useEffect(() => {
      onChange?.(fields);
    }, [fields]);

    return (
      <div
        data-guardian-info
        className="bg-white rounded-xl border border-slate-200 shadow-lg overflow-hidden"
      >
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
                d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
              />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-800">
              Guardian Information
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Father and Mother name &amp; phone are required
            </p>
          </div>
        </div>

        <div className="px-8 py-7 space-y-6">
          <ParentForm
            title="Father's Information"
            data={fields.father}
            errors={errors.father}
            requiredFields={FATHER_REQUIRED}
            onChange={makeUpdater("father")}
            onErrorClear={makeErrorClearer("father")}
          />

          <ParentForm
            title="Mother's Information"
            data={fields.mother}
            errors={errors.mother}
            requiredFields={MOTHER_REQUIRED}
            onChange={makeUpdater("mother")}
            onErrorClear={makeErrorClearer("mother")}
          />

          <GuardianForm
            data={fields.guardian}
            errors={errors.guardian}
            onChange={makeUpdater("guardian")}
            onErrorClear={makeErrorClearer("guardian")}
          />

          <GrandfatherForm
            data={fields.grandfather}
            errors={errors.grandfather}
            onChange={makeUpdater("grandfather")}
            onErrorClear={makeErrorClearer("grandfather")}
          />
        </div>
      </div>
    );
  },
);

export default GuardianInfo;
