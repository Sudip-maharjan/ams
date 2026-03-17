"use client";
import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Webcam from "react-webcam";
import {
  User,
  Camera,
  FileText,
  Fingerprint,
  CheckCircle,
  ChevronRight,
  ChevronLeft,
  AlertCircle,
  ExternalLink,
  RotateCcw,
  ZoomIn,
  Check,
  X,
  Clock,
  ShieldCheck,
} from "lucide-react";

type AddressBlock = {
  country: string;
  province: string;
  district: string;
  municipality: string;
  wardNumber: string;
  locality: string;
};

type QualBlock = {
  qualificationName: string;
  universityBoard: string;
  passingYearAD: string;
  schoolName: string;
  schoolAddress: string;
  country: string;
  symbolNumber: string;
};

type ParentBlock = {
  name: string;
  phone: string;
  email?: string | null;
  education?: string | null;
  occupation?: string | null;
};

type GuardianBlock = {
  name?: string | null;
  phone?: string | null;
  email?: string | null;
  education?: string | null;
  occupation?: string | null;
  relationToStudent?: string | null;
};

type Application = {
  id: string;
  amsCode: string;
  status: string;
  createdAt: string;
  category: string;
  subCategory?: string | null;
  mecRollNumber: string;
  mecRank: number;
  mecScore: number;
  program: string;
  college: string;
  salutation: string;
  firstName: string;
  middleName?: string | null;
  lastName: string;
  firstNameNepali: string;
  middleNameNepali?: string | null;
  lastNameNepali: string;
  dobAD: string;
  dobBS?: string | null;
  gender: string;
  mobileNumber: string;
  email: string;
  bloodGroup?: string | null;
  nationalityDocType: string;
  permanentAddress: AddressBlock;
  temporaryAddress: AddressBlock;
  qualification1: QualBlock;
  qualification2: QualBlock;
  father: ParentBlock;
  mother: ParentBlock;
  guardian?: GuardianBlock | null;
  grandfatherName?: string | null;
  documentFlags?: {
    requiresEquivalence?: boolean;
    requiresCouncilCertificate?: boolean;
    requiresBridgeCourse?: boolean;
  } | null;
  documentPaths?: Record<string, string> | null;
};

const STEPS = [
  { id: "personal", label: "Personal Details", icon: User },
  { id: "biometric1", label: "Photo Capture", icon: Camera },
  { id: "voucher", label: "Fee Voucher", icon: FileText },
  { id: "documents", label: "Documents", icon: FileText },
  { id: "biometric2", label: "Fingerprint", icon: Fingerprint },
  { id: "confirm", label: "Final Approval", icon: ShieldCheck },
];

const statusStyles: Record<string, string> = {
  SUBMITTED: "bg-blue-50 text-blue-700 border-blue-100",
  UNDER_REVIEW: "bg-amber-50 text-amber-700 border-amber-100",
  APPROVED: "bg-emerald-50 text-emerald-700 border-emerald-100",
  REJECTED: "bg-red-50 text-red-700 border-red-100",
  DRAFT: "bg-slate-100 text-slate-600 border-slate-200",
};

function Field({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div>
      <dt className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-0.5">
        {label}
      </dt>
      <dd className="text-sm text-slate-800">{value}</dd>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="px-5 py-3.5 border-b border-slate-100 bg-slate-50/60">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">
          {title}
        </h3>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

type PhotoState = "idle" | "capturing" | "preview" | "done";

function PhotoCapture({ onComplete }: { onComplete: (img: string) => void }) {
  const [state, setState] = useState<PhotoState>("idle");
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [camError, setCamError] = useState<string | null>(null);
  const webcamRef = useRef<Webcam>(null);

  const capture = useCallback(() => {
    const screenshot = webcamRef.current?.getScreenshot();
    if (screenshot) {
      setImgSrc(screenshot);
      setState("preview");
    } else {
      setCamError("Failed to capture. Please try again.");
    }
  }, []);

  const retake = () => {
    setImgSrc(null);
    setCamError(null);
    setState("capturing");
  };

  const confirm = () => {
    if (imgSrc) {
      setState("done");
      onComplete(imgSrc);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 py-6">
      {state === "idle" && (
        <div className="w-72 h-72 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 flex items-center justify-center">
          <Camera className="w-16 h-16 text-slate-300" />
        </div>
      )}

      {state === "capturing" && (
        <div className="rounded-2xl overflow-hidden border-2 border-blue-400 shadow-lg">
          <Webcam
            ref={webcamRef}
            audio={false}
            screenshotFormat="image/jpeg"
            videoConstraints={{ width: 288, height: 288, facingMode: "user" }}
            className="w-72 h-72 object-cover"
            onUserMediaError={() =>
              setCamError("Camera access denied or unavailable.")
            }
          />
        </div>
      )}

      {(state === "preview" || state === "done") && imgSrc && (
        <div
          className={`rounded-2xl overflow-hidden border-2 shadow-lg
          ${state === "done" ? "border-emerald-400" : "border-blue-400"}`}
        >
          <img src={imgSrc} alt="Captured" className="w-72 h-72 object-cover" />
        </div>
      )}

      {camError && (
        <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-100 px-4 py-2.5 rounded-xl">
          <AlertCircle className="w-4 h-4 shrink-0" /> {camError}
        </div>
      )}

      <div className="text-center">
        {state === "idle" && (
          <>
            <p className="text-slate-700 font-semibold mb-1">
              Ready to capture photo
            </p>
            <p className="text-sm text-slate-400 mb-4">
              Position the student in front of the camera
            </p>
            <button
              onClick={() => {
                setCamError(null);
                setState("capturing");
              }}
              className="bg-blue-700 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-800 transition-colors"
            >
              Start Camera
            </button>
          </>
        )}

        {state === "capturing" && (
          <>
            <p className="text-sm text-slate-500 mb-4">
              Ensure the student&apos;s face is clearly visible
            </p>
            <button
              onClick={capture}
              className="flex items-center gap-2 bg-blue-700 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-800 transition-colors mx-auto"
            >
              <Camera className="w-4 h-4" /> Capture Photo
            </button>
          </>
        )}

        {state === "preview" && (
          <>
            <p className="text-slate-700 font-semibold mb-4">
              Does this photo look good?
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={retake}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium border border-slate-200 text-slate-600 hover:bg-slate-50"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Retake
              </button>
              <button
                onClick={confirm}
                className="flex items-center gap-1.5 bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-emerald-700"
              >
                <Check className="w-3.5 h-3.5" /> Confirm & Continue
              </button>
            </div>
          </>
        )}

        {state === "done" && (
          <div className="flex items-center gap-2 text-sm text-emerald-600 font-medium justify-center">
            <CheckCircle className="w-4 h-4" /> Photo captured and confirmed
          </div>
        )}
      </div>
    </div>
  );
}

function FingerprintCapture({ onComplete }: { onComplete: () => void }) {
  const [state, setState] = useState<"idle" | "scanning" | "done">("idle");

  const start = () => {
    setState("scanning");

    setTimeout(() => setState("done"), 2500);
  };

  return (
    <div className="flex flex-col items-center gap-6 py-6">
      <div
        className={`w-40 h-40 rounded-3xl border-2 flex items-center justify-center transition-all duration-500
        ${
          state === "idle"
            ? "border-dashed border-slate-200 bg-slate-50"
            : state === "scanning"
              ? "border-blue-400 bg-blue-50 animate-pulse"
              : "border-emerald-400 bg-emerald-50"
        }`}
      >
        {state === "done" ? (
          <CheckCircle className="w-16 h-16 text-emerald-500" />
        ) : (
          <Fingerprint
            className={`w-16 h-16 ${state === "scanning" ? "text-blue-500" : "text-slate-300"}`}
          />
        )}
      </div>

      <div className="text-center">
        {state === "idle" && (
          <>
            <p className="text-slate-700 font-semibold mb-1">
              Ready to scan fingerprint
            </p>
            <p className="text-sm text-slate-400 mb-4">
              Ask the student to place their right index finger on the scanner
            </p>
            <button
              onClick={start}
              className="bg-blue-700 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-800 transition-colors"
            >
              Start Scanner
            </button>
          </>
        )}
        {state === "scanning" && (
          <p className="text-blue-600 font-semibold animate-pulse">Scanning…</p>
        )}
        {state === "done" && (
          <>
            <p className="text-emerald-600 font-bold mb-1">
              Fingerprint scanned!
            </p>
            <p className="text-sm text-slate-400 mb-4">
              Biometric data recorded successfully
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setState("idle")}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium border border-slate-200 text-slate-600 hover:bg-slate-50"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Rescan
              </button>
              <button
                onClick={onComplete}
                className="flex items-center gap-1.5 bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-emerald-700"
              >
                <Check className="w-3.5 h-3.5" /> Confirm & Continue
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

type DocCheckState = Record<string, boolean | null>;

function DocumentChecklist({
  paths,
  flags,
  checks,
  onChange,
}: {
  paths: Record<string, string>;
  flags: Application["documentFlags"];
  checks: DocCheckState;
  onChange: (key: string, val: boolean) => void;
}) {
  const docList = [
    { key: "passportPhoto", label: "Passport Photo" },
    { key: "nationalityId", label: "Nationality ID" },
    { key: "grade10Certificate", label: "Grade 10 Certificate" },
    { key: "grade10Marksheet", label: "Grade 10 Marksheet" },
    { key: "grade12Provisional", label: "Grade 12 Provisional" },
    { key: "grade12Marksheet", label: "Grade 12 Marksheet" },
    { key: "grade12Character", label: "Grade 12 Character Certificate" },
    { key: "signatureSpecimen", label: "Signature Specimen" },
    ...(flags?.requiresEquivalence
      ? [{ key: "equivalenceCertificate", label: "Equivalence Certificate" }]
      : []),
    ...(flags?.requiresCouncilCertificate
      ? [{ key: "councilCertificate", label: "Council Certificate" }]
      : []),
    ...(flags?.requiresBridgeCourse
      ? [{ key: "bridgeCourseCertificate", label: "Bridge Course Certificate" }]
      : []),
  ];

  return (
    <div className="space-y-2.5">
      {docList.map(({ key, label }) => {
        const url = paths[key];
        const status = checks[key];
        return (
          <div
            key={key}
            className={`flex items-center gap-3 p-3.5 rounded-xl border transition-colors
              ${
                status === true
                  ? "border-emerald-200 bg-emerald-50/60"
                  : status === false
                    ? "border-red-200 bg-red-50/50"
                    : "border-slate-100 bg-white"
              }`}
          >
            <div className="flex-1 min-w-0">
              <p
                className={`text-sm font-medium ${!url ? "text-slate-400" : "text-slate-700"}`}
              >
                {label}
              </p>
              {!url && (
                <p className="text-xs text-red-500">Not uploaded by student</p>
              )}
            </div>

            {url && (
              <a
                href={url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-medium shrink-0"
              >
                <ZoomIn className="w-3.5 h-3.5" /> View
              </a>
            )}

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={() => onChange(key, true)}
                title="Approve document"
                className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors
                  ${
                    status === true
                      ? "bg-emerald-500 text-white"
                      : "bg-slate-100 text-slate-400 hover:bg-emerald-100 hover:text-emerald-600"
                  }`}
              >
                <Check className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onChange(key, false)}
                title="Reject document"
                className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors
                  ${
                    status === false
                      ? "bg-red-500 text-white"
                      : "bg-slate-100 text-slate-400 hover:bg-red-100 hover:text-red-600"
                  }`}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function ApprovalWizard({
  application: app,
}: {
  application: Application;
}) {
  const router = useRouter();

  const [step, setStep] = useState(0);
  const [personalVerified, setPersonalVerified] = useState(false);
  const [photoDone, setPhotoDone] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [voucherVerified, setVoucherVerified] = useState(false);
  const [docChecks, setDocChecks] = useState<DocCheckState>({});
  const [fingerprintDone, setFingerprintDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [finalStatus, setFinalStatus] = useState<
    "idle" | "approved" | "rejected"
  >("idle");
  const [error, setError] = useState("");

  const paths = (app.documentPaths ?? {}) as Record<string, string>;
  const flags = app.documentFlags;

  const requiredDocs = [
    "passportPhoto",
    "nationalityId",
    "grade10Certificate",
    "grade10Marksheet",
    "grade12Provisional",
    "grade12Marksheet",
    "grade12Character",
    "signatureSpecimen",
    ...(flags?.requiresEquivalence ? ["equivalenceCertificate"] : []),
    ...(flags?.requiresCouncilCertificate ? ["councilCertificate"] : []),
    ...(flags?.requiresBridgeCourse ? ["bridgeCourseCertificate"] : []),
  ];

  const allDocsChecked = requiredDocs.every(
    (k) => docChecks[k] !== undefined && docChecks[k] !== null,
  );
  const allDocsValid = requiredDocs.every((k) => docChecks[k] === true);

  const updateStatus = async (status: "APPROVED" | "REJECTED") => {
    setSubmitting(true);
    setError("");
    try {
      if (capturedPhoto && status === "APPROVED") {
        const bioRes = await fetch("/api/admin/applications/biometric", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: app.id, photo: capturedPhoto }),
        });
        if (!bioRes.ok) throw new Error("Failed to save biometric photo.");
      }

      const res = await fetch("/api/admin/applications/status", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: app.id, status }),
      });
      if (!res.ok) throw new Error("Failed to update status.");

      setFinalStatus(status === "APPROVED" ? "approved" : "rejected");
    } catch (e: unknown) {
      setError(
        e instanceof Error ? e.message : "An unexpected error occurred.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const stepContent = [
    <div key="personal" className="space-y-4">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-mono text-xs text-slate-400 mb-0.5">
              {app.amsCode}
            </p>
            <h2 className="text-2xl font-bold text-slate-900">
              {app.salutation} {app.firstName} {app.middleName} {app.lastName}
            </h2>
            <p className="text-slate-500 text-sm mt-0.5">
              {app.firstNameNepali} {app.middleNameNepali} {app.lastNameNepali}
            </p>
            <p className="text-sm text-slate-600 mt-2">
              {app.program} &mdash; {app.college}
            </p>
          </div>
          <span
            className={`px-3 py-1.5 rounded-lg text-xs font-bold border shrink-0 ${statusStyles[app.status]}`}
          >
            {app.status.replace("_", " ")}
          </span>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Section title="Personal Information">
          <dl className="grid grid-cols-2 gap-3.5">
            <Field label="Gender" value={app.gender} />
            <Field
              label="DOB (AD)"
              value={new Date(app.dobAD).toLocaleDateString("en-GB")}
            />
            <Field label="DOB (BS)" value={app.dobBS} />
            <Field label="Blood Group" value={app.bloodGroup} />
            <Field label="Mobile" value={app.mobileNumber} />
            <Field label="Email" value={app.email} />
            <Field label="Nationality Doc" value={app.nationalityDocType} />
          </dl>
        </Section>

        <Section title="Academic Info">
          <dl className="grid grid-cols-2 gap-3.5">
            <Field label="Category" value={app.category} />
            <Field label="Sub-Category" value={app.subCategory} />
            <Field label="MEC Roll No." value={app.mecRollNumber} />
            <Field label="MEC Rank" value={String(app.mecRank)} />
            <Field label="MEC Score" value={String(app.mecScore)} />
            <Field
              label="Qualification 1"
              value={app.qualification1?.qualificationName}
            />
            <Field label="School" value={app.qualification1?.schoolName} />
            <Field
              label="Passing Year"
              value={app.qualification1?.passingYearAD}
            />
          </dl>
        </Section>

        <Section title="Permanent Address">
          <dl className="grid grid-cols-2 gap-3.5">
            <Field label="Country" value={app.permanentAddress?.country} />
            <Field label="Province" value={app.permanentAddress?.province} />
            <Field label="District" value={app.permanentAddress?.district} />
            <Field
              label="Municipality"
              value={app.permanentAddress?.municipality}
            />
            <Field label="Ward" value={app.permanentAddress?.wardNumber} />
            <Field label="Locality" value={app.permanentAddress?.locality} />
          </dl>
        </Section>

        <Section title="Family">
          <div className="space-y-4">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                Father
              </p>
              <dl className="grid grid-cols-2 gap-3">
                <Field label="Name" value={app.father?.name} />
                <Field label="Phone" value={app.father?.phone} />
              </dl>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                Mother
              </p>
              <dl className="grid grid-cols-2 gap-3">
                <Field label="Name" value={app.mother?.name} />
                <Field label="Phone" value={app.mother?.phone} />
              </dl>
            </div>
            {app.grandfatherName && (
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
                  Grandfather
                </p>
                <dd className="text-sm text-slate-800">
                  {app.grandfatherName}
                </dd>
              </div>
            )}
            {app.guardian?.name && (
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                  Guardian
                </p>
                <dl className="grid grid-cols-2 gap-3">
                  <Field label="Name" value={app.guardian.name} />
                  <Field label="Phone" value={app.guardian.phone} />
                  <Field
                    label="Relation"
                    value={app.guardian.relationToStudent}
                  />
                </dl>
              </div>
            )}
          </div>
        </Section>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <label className="flex items-start gap-3 cursor-pointer select-none">
          <div
            onClick={() => setPersonalVerified((v) => !v)}
            className={`w-5 h-5 mt-0.5 rounded-md border-2 flex items-center justify-center shrink-0 transition-colors
              ${personalVerified ? "bg-blue-600 border-blue-600" : "border-slate-300"}`}
          >
            {personalVerified && <Check className="w-3 h-3 text-white" />}
          </div>
          <span className="text-sm text-slate-700">
            I have verified all personal details above are accurate and match
            the student&apos;s identification documents.
          </span>
        </label>
      </div>
    </div>,

    <div key="biometric1" className="max-w-xl mx-auto">
      <Section title="Biometric Photo Capture">
        <p className="text-sm text-slate-500 mb-2">
          Capture a live photo of the student. This will be stored permanently
          alongside their admission record.
        </p>
        <PhotoCapture
          onComplete={(img) => {
            setCapturedPhoto(img);
            setPhotoDone(true);
          }}
        />
      </Section>
    </div>,

    <div key="voucher" className="max-w-2xl mx-auto">
      <Section title="Fee Voucher Verification">
        <div className="space-y-4">
          <p className="text-sm text-slate-500">
            Verify the student has submitted the admission fee voucher and all
            payment details are correct.
          </p>
          <div className="bg-slate-50 rounded-xl border border-dashed border-slate-200 p-6">
            <FileText className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-sm text-slate-500 text-center mb-4">
              Collect and verify the physical fee voucher from the student
            </p>
            <div className="bg-white rounded-lg border border-slate-100 p-4 text-sm space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Student</span>
                <span className="font-medium text-slate-800">
                  {app.firstName} {app.lastName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">AMS Code</span>
                <span className="font-mono font-medium text-slate-800">
                  {app.amsCode}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Program</span>
                <span className="font-medium text-slate-800">
                  {app.program}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">College</span>
                <span className="font-medium text-slate-800">
                  {app.college}
                </span>
              </div>
            </div>
          </div>
          <label className="flex items-start gap-3 cursor-pointer select-none">
            <div
              onClick={() => setVoucherVerified((v) => !v)}
              className={`w-5 h-5 mt-0.5 rounded-md border-2 flex items-center justify-center shrink-0 transition-colors
                ${voucherVerified ? "bg-blue-600 border-blue-600" : "border-slate-300"}`}
            >
              {voucherVerified && <Check className="w-3 h-3 text-white" />}
            </div>
            <span className="text-sm text-slate-700">
              I have collected the original fee payment voucher and verified the
              payment details are correct.
            </span>
          </label>
        </div>
      </Section>
    </div>,

    <div key="documents" className="max-w-2xl mx-auto">
      <Section title="Document Verification">
        <p className="text-sm text-slate-500 mb-5">
          Review each uploaded document. Approve (✓) or reject (✗) each one. All
          documents must be marked before you can proceed.
        </p>
        <DocumentChecklist
          paths={paths}
          flags={flags}
          checks={docChecks}
          onChange={(key, val) =>
            setDocChecks((prev) => ({ ...prev, [key]: val }))
          }
        />
        {allDocsChecked && !allDocsValid && (
          <div className="mt-4 flex items-start gap-2 p-3.5 bg-red-50 border border-red-100 rounded-xl text-sm text-red-700">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            Some documents have been marked as invalid. You may still proceed
            but the application will be flagged.
          </div>
        )}
        {allDocsChecked && allDocsValid && (
          <div className="mt-4 flex items-center gap-2 p-3.5 bg-emerald-50 border border-emerald-100 rounded-xl text-sm text-emerald-700">
            <CheckCircle className="w-4 h-4 shrink-0" />
            All documents verified and approved.
          </div>
        )}
      </Section>
    </div>,

    <div key="biometric2" className="max-w-xl mx-auto">
      <Section title="Fingerprint Scan">
        <p className="text-sm text-slate-500 mb-6">
          Capture the student&apos;s biometric fingerprint. This is required to
          complete the admission process.
        </p>
        <FingerprintCapture onComplete={() => setFingerprintDone(true)} />
        {fingerprintDone && (
          <div className="mt-4 flex items-center gap-2 text-sm text-emerald-600 font-medium">
            <CheckCircle className="w-4 h-4" /> Fingerprint successfully scanned
            and saved
          </div>
        )}
      </Section>
    </div>,

    <div key="confirm" className="max-w-2xl mx-auto space-y-4">
      {finalStatus === "idle" ? (
        <>
          <Section title="Admission Summary">
            <div className="space-y-3 text-sm">
              {[
                { label: "Personal Details Verified", done: personalVerified },
                { label: "Biometric Photo Captured", done: photoDone },
                { label: "Fee Voucher Verified", done: voucherVerified },
                { label: "All Documents Verified", done: allDocsValid },
                { label: "Fingerprint Scanned", done: fingerprintDone },
              ].map(({ label, done }) => (
                <div
                  key={label}
                  className={`flex items-center justify-between p-3 rounded-xl border
                    ${
                      done
                        ? "border-emerald-100 bg-emerald-50/60"
                        : "border-amber-100 bg-amber-50/50"
                    }`}
                >
                  <span
                    className={
                      done ? "text-slate-700 font-medium" : "text-amber-700"
                    }
                  >
                    {label}
                  </span>
                  {done ? (
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <Clock className="w-4 h-4 text-amber-500" />
                  )}
                </div>
              ))}
            </div>
          </Section>

          {error && (
            <div className="flex items-center gap-2 p-3.5 bg-red-50 border border-red-100 rounded-xl text-sm text-red-700">
              <AlertCircle className="w-4 h-4 shrink-0" /> {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => updateStatus("REJECTED")}
              disabled={submitting}
              className="flex items-center justify-center gap-2 p-4 rounded-2xl border-2 border-red-100 bg-red-50 text-red-700 font-semibold text-sm hover:bg-red-100 disabled:opacity-50 transition-colors"
            >
              <X className="w-4 h-4" />
              {submitting ? "Processing…" : "Reject Admission"}
            </button>
            <button
              onClick={() => updateStatus("APPROVED")}
              disabled={
                submitting ||
                !personalVerified ||
                !photoDone ||
                !voucherVerified ||
                !fingerprintDone
              }
              className="flex items-center justify-center gap-2 p-4 rounded-2xl bg-emerald-600 text-white font-semibold text-sm hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm"
            >
              <ShieldCheck className="w-4 h-4" />
              {submitting ? "Processing…" : "Approve Admission"}
            </button>
          </div>

          {(!personalVerified ||
            !photoDone ||
            !voucherVerified ||
            !fingerprintDone) && (
            <p className="text-xs text-center text-amber-600">
              Complete all steps before final approval
            </p>
          )}
        </>
      ) : finalStatus === "approved" ? (
        <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm p-10 text-center">
          <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-5">
            <CheckCircle className="w-10 h-10 text-emerald-500" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-2">
            Admission Approved!
          </h3>
          <p className="text-slate-500 text-sm mb-1">
            {app.salutation} {app.firstName} {app.lastName}
          </p>
          <p className="font-mono text-xs text-slate-400 mb-6">{app.amsCode}</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => router.push("/admin/approved")}
              className="bg-emerald-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-emerald-700 transition-colors"
            >
              View Approved Students
            </button>
            <button
              onClick={() => router.push("/admin/requests")}
              className="border border-slate-200 text-slate-600 px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors"
            >
              Back to Requests
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-red-100 shadow-sm p-10 text-center">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-5">
            <X className="w-10 h-10 text-red-500" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-2">
            Admission Rejected
          </h3>
          <p className="text-slate-500 text-sm mb-6">
            The application for {app.firstName} {app.lastName} has been
            rejected.
          </p>
          <button
            onClick={() => router.push("/admin/requests")}
            className="bg-slate-800 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-slate-900 transition-colors"
          >
            Back to Requests
          </button>
        </div>
      )}
    </div>,
  ];

  const canProceed =
    (
      [
        personalVerified,
        photoDone,
        voucherVerified,
        allDocsChecked,
        fingerprintDone,
        true,
      ] as boolean[]
    )[step] ?? true;

  return (
    <div className="space-y-5 max-w-screen">
      {/* Stepper */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm px-5 py-4">
        <div className="flex items-center gap-1 overflow-x-auto">
          {STEPS.map((s, i) => {
            const isActive = i === step;
            const isComplete = i < step;
            return (
              <div key={s.id} className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => {
                    if (i < step) setStep(i);
                  }}
                  disabled={i > step}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors
                    ${
                      isActive
                        ? "bg-blue-50 text-blue-700"
                        : isComplete
                          ? "text-emerald-600 hover:bg-emerald-50 cursor-pointer"
                          : "text-slate-400 cursor-default"
                    }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold
                    ${
                      isActive
                        ? "bg-blue-600 text-white"
                        : isComplete
                          ? "bg-emerald-500 text-white"
                          : "bg-slate-100 text-slate-400"
                    }`}
                  >
                    {isComplete ? <Check className="w-3 h-3" /> : i + 1}
                  </div>
                  <span className="hidden sm:inline">{s.label}</span>
                </button>
                {i < STEPS.length - 1 && (
                  <ChevronRight
                    className={`w-3.5 h-3.5 shrink-0
                      ${i < step ? "text-emerald-400" : "text-slate-200"}`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="min-h-[400px]">{stepContent[step]}</div>

      {/* Navigation */}
      {finalStatus === "idle" && (
        <div className="flex items-center justify-between">
          <button
            onClick={() => setStep((s) => s - 1)}
            disabled={step === 0}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4" /> Previous
          </button>

          <span className="text-xs text-slate-400">
            Step {step + 1} of {STEPS.length}
          </span>

          {step < STEPS.length - 1 && (
            <button
              onClick={() => setStep((s) => s + 1)}
              disabled={!canProceed}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold bg-blue-700 text-white hover:bg-blue-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
