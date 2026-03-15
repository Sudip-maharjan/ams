"use client";
import {
  useState,
  useRef,
  useImperativeHandle,
  forwardRef,
  useCallback,
} from "react";
import { Label } from "./FormFields";

export type DocumentsFields = {
  requiresEquivalence: boolean;
  requiresCouncilCertificate: boolean;
  requiresBridgeCourse: boolean;

  nationalityId: File | null;
  grade10Degree: File | null;
  grade10Marksheet: File | null;
  grade12Degree: File | null;
  grade12Marksheet: File | null;
  grade12Character: File | null;
  signatureSpecimen: File | null;
  passportPhoto: File | null;

  equivalenceCertificate: File | null;
  councilCertificate: File | null;
  bridgeCourseCertificate: File | null;
};

export type DocumentsHandle = {
  validate: () => DocumentsFields | null;
  reset: () => void;
  getFiles: () => DocumentsFields;
};

type DocumentsProps = {
  onChange?: (data: DocumentsFields) => void;
};

const MANDATORY_DOCS: { key: keyof DocumentsFields; label: string }[] = [
  {
    key: "nationalityId",
    label: "National Identity card | Citizenship/ Both Side/ passport/aadhar",
  },
  {
    key: "grade10Degree",
    label: "Grade 10/SLC/SEE/O level Degree/Board/Provisional certificate",
  },
  {
    key: "grade10Marksheet",
    label: "Grade 10/SLC/SEE/O level Grade sheet/Transcript/Mark sheet",
  },
  {
    key: "grade12Degree",
    label:
      "Grade 12/ISc/A level/PCL level Degree/Board/Provisional certificate",
  },
  {
    key: "grade12Marksheet",
    label: "Grade 12/ISc/A level/PCL level Grade sheet/Transcript/Mark sheet",
  },
  {
    key: "grade12Character",
    label: "Grade 12/ISc/A level/PCL level Character Certificate",
  },
  { key: "signatureSpecimen", label: "Signature Specimen" },
  { key: "passportPhoto", label: "Passport Size Photo" },
];

const ACCEPT = "image/jpeg,image/png,image/webp,application/pdf";

function FileSlot({
  label,
  required,
  file,
  error,
  onChange,
}: {
  label: string;
  required?: boolean;
  file: File | null;
  error?: string;
  onChange: (f: File | null) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const pick = () => inputRef.current?.click();

  const handleFile = (f: File) => {
    if (f.size > 5 * 1024 * 1024) {
      alert(`"${f.name}" exceeds the 5 MB limit.`);
      return;
    }
    onChange(f);
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files?.[0];
    if (f) handleFile(f);
  }, []);

  const remove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div
      onClick={pick}
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={onDrop}
      className={`relative flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-xl p-4 cursor-pointer transition-all min-h-[130px] text-center group
        ${dragging ? "border-blue-400 bg-blue-50" : file ? "border-emerald-300 bg-emerald-50" : error ? "border-red-300 bg-red-50" : "border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/50"}`}
    >
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT}
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
        }}
      />

      {file ? (
        <>
          {/* Preview thumbnail for images */}
          {file.type.startsWith("image/") ? (
            <img
              src={URL.createObjectURL(file)}
              alt="preview"
              className="h-12 w-12 object-cover rounded-md"
            />
          ) : (
            <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
              <svg
                className="w-5 h-5 text-emerald-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.8}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                />
              </svg>
            </div>
          )}
          <p className="text-xs font-medium text-emerald-700 leading-tight px-1 break-all line-clamp-2">
            {file.name}
          </p>
          <p className="text-[10px] text-slate-400">
            {(file.size / 1024).toFixed(0)} KB
          </p>
          {/* Remove button */}
          <button
            type="button"
            onClick={remove}
            className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-red-100 hover:bg-red-200 flex items-center justify-center transition-colors"
          >
            <svg
              className="w-3 h-3 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
          </button>
        </>
      ) : (
        <>
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${error ? "bg-red-100" : "bg-slate-100 group-hover:bg-blue-100"}`}
          >
            <svg
              className={`w-5 h-5 ${error ? "text-red-400" : "text-slate-400 group-hover:text-blue-500"}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.8}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
              />
            </svg>
          </div>
          <p className="text-xs font-semibold text-slate-700 leading-tight px-1">
            {label}
            {required && <span className="text-red-500 ml-0.5">*</span>}
          </p>
          <p
            className={`text-[10px] ${error ? "text-red-400" : "text-slate-400"}`}
          >
            {error || "Accepts images and PDF files"}
          </p>
        </>
      )}
    </div>
  );
}

const emptyDocs = (): DocumentsFields => ({
  requiresEquivalence: false,
  requiresCouncilCertificate: false,
  requiresBridgeCourse: false,
  nationalityId: null,
  grade10Degree: null,
  grade10Marksheet: null,
  grade12Degree: null,
  grade12Marksheet: null,
  grade12Character: null,
  signatureSpecimen: null,
  passportPhoto: null,
  equivalenceCertificate: null,
  councilCertificate: null,
  bridgeCourseCertificate: null,
});

const DocumentsUpload = forwardRef<DocumentsHandle, DocumentsProps>(
  function DocumentsUpload({ onChange }, ref) {
    const [docs, setDocs] = useState<DocumentsFields>(emptyDocs());
    const [errors, setErrors] = useState<
      Partial<Record<keyof DocumentsFields, string>>
    >({});

    const update = (patch: Partial<DocumentsFields>) => {
      setDocs((prev) => {
        const next = { ...prev, ...patch };
        onChange?.(next);
        return next;
      });

      const keys = Object.keys(patch) as (keyof DocumentsFields)[];
      setErrors((prev) => ({
        ...prev,
        ...Object.fromEntries(keys.map((k) => [k, ""])),
      }));
    };

    useImperativeHandle(ref, () => ({
      validate: () => {
        const errs: Partial<Record<keyof DocumentsFields, string>> = {};

        for (const { key } of MANDATORY_DOCS) {
          if (!docs[key]) errs[key] = "Required";
        }

        if (docs.requiresEquivalence && !docs.equivalenceCertificate)
          errs.equivalenceCertificate = "Required";
        if (docs.requiresCouncilCertificate && !docs.councilCertificate)
          errs.councilCertificate = "Required";
        if (docs.requiresBridgeCourse && !docs.bridgeCourseCertificate)
          errs.bridgeCourseCertificate = "Required";

        if (Object.keys(errs).length > 0) {
          setErrors(errs);
          document
            .querySelector("[data-documents-upload]")
            ?.scrollIntoView({ behavior: "smooth", block: "start" });
          return null;
        }
        return docs;
      },
      reset: () => {
        setDocs(emptyDocs());
        setErrors({});
      },
      getFiles: () => docs,
    }));

    return (
      <div
        data-documents-upload
        className="bg-white rounded-xl border border-slate-200 shadow-lg overflow-hidden"
      >
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
                d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
              />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-800">
              Document Upload
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Upload all required documents. Max 5 MB per file. Accepts images
              and PDF.
            </p>
          </div>
        </div>

        <div className="px-8 py-7 space-y-6">
          {/* ── Conditional document checkboxes ── */}
          <div className="space-y-3">
            {/* Equivalence */}
            <div
              className={`border rounded-xl p-4 transition-colors ${docs.requiresEquivalence ? "border-blue-200 bg-blue-50/40" : "border-slate-200"}`}
            >
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={docs.requiresEquivalence}
                  onChange={(e) =>
                    update({ requiresEquivalence: e.target.checked })
                  }
                  className="mt-0.5 w-4 h-4 rounded border-slate-300 accent-blue-500 cursor-pointer"
                />
                <div>
                  <p className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                    <svg
                      className="w-4 h-4 text-amber-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.8}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                      />
                    </svg>
                    Equivalence
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Candidate with O Level, PCL/Diploma Background, Nepali
                    national with foreign degree PCL background from BNS/BMS
                    Equivalence Certificate is mandatory.
                  </p>
                </div>
              </label>
              {docs.requiresEquivalence && (
                <div className="mt-4 max-w-xs">
                  <Label required>Equivalence Certificate</Label>
                  <FileSlot
                    label="Equivalence Certificate"
                    required
                    file={docs.equivalenceCertificate}
                    error={errors.equivalenceCertificate}
                    onChange={(f) => update({ equivalenceCertificate: f })}
                  />
                </div>
              )}
            </div>

            {/* Council Certificate */}
            <div
              className={`border rounded-xl p-4 transition-colors ${docs.requiresCouncilCertificate ? "border-blue-200 bg-blue-50/40" : "border-slate-200"}`}
            >
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={docs.requiresCouncilCertificate}
                  onChange={(e) =>
                    update({ requiresCouncilCertificate: e.target.checked })
                  }
                  className="mt-0.5 w-4 h-4 rounded border-slate-300 accent-blue-500 cursor-pointer"
                />
                <div>
                  <p className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                    <svg
                      className="w-4 h-4 text-amber-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.8}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                      />
                    </svg>
                    Council Certificate
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Provide the necessary supporting documents.
                  </p>
                </div>
              </label>
              {docs.requiresCouncilCertificate && (
                <div className="mt-4 max-w-xs">
                  <Label required>Council Certificate</Label>
                  <FileSlot
                    label="Council Certificate"
                    required
                    file={docs.councilCertificate}
                    error={errors.councilCertificate}
                    onChange={(f) => update({ councilCertificate: f })}
                  />
                </div>
              )}
            </div>

            {/* Bridge Course */}
            <div
              className={`border rounded-xl p-4 transition-colors ${docs.requiresBridgeCourse ? "border-blue-200 bg-blue-50/40" : "border-slate-200"}`}
            >
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={docs.requiresBridgeCourse}
                  onChange={(e) =>
                    update({ requiresBridgeCourse: e.target.checked })
                  }
                  className="mt-0.5 w-4 h-4 rounded border-slate-300 accent-blue-500 cursor-pointer"
                />
                <div>
                  <p className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                    <svg
                      className="w-4 h-4 text-amber-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.8}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                      />
                    </svg>
                    Bridge Course
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Candidate with PCL/Diploma background, Bridge Course
                    completion certificate is mandatory.
                  </p>
                </div>
              </label>
              {docs.requiresBridgeCourse && (
                <div className="mt-4 max-w-xs">
                  <Label required>Bridge Course Certificate</Label>
                  <FileSlot
                    label="Bridge Course Certificate"
                    required
                    file={docs.bridgeCourseCertificate}
                    error={errors.bridgeCourseCertificate}
                    onChange={(f) => update({ bridgeCourseCertificate: f })}
                  />
                </div>
              )}
            </div>
          </div>

          {/* ── Mandatory document uploads grid ── */}
          <div>
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">
              Document Upload
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {MANDATORY_DOCS.map(({ key, label }) => (
                <FileSlot
                  key={key}
                  label={label}
                  required
                  file={docs[key] as File | null}
                  error={errors[key]}
                  onChange={(f) =>
                    update({ [key]: f } as Partial<DocumentsFields>)
                  }
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  },
);

export default DocumentsUpload;
