// app/components/FormComp/FormFields.tsx
"use client";
import React from "react";

export const Label = ({
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

export const InputField = ({
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

export const SelectField = ({
  placeholder,
  options,
  value,
  error,
  disabled = false,
  onChange,
}: {
  placeholder: string;
  options: string[];
  value: string;
  error?: string;
  disabled?: boolean;
  onChange: (val: string) => void;
}) => (
  <div>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className={`w-full px-3.5 py-2.5 rounded-lg border text-sm bg-white transition-all outline-none appearance-none
        ${disabled ? "cursor-not-allowed opacity-50 bg-slate-50" : "cursor-pointer"}
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
