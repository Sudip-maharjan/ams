"use client";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "../Header";
import StudentDetails, {
  StudentDetailsHandle,
  FormFields,
} from "./StudentDetails";
import Address, { AddressFields, AddressHandle } from "./StudemtAddress";
import FormActions from "./FormActions";
import AcademicInfo, {
  AcademicFields,
  AcademicInfoHandle,
} from "./AcademicInfo";
import GuardianInfo, {
  GuardianFields,
  GuardianInfoHandle,
} from "./GuardianInfo";

type SubmissionState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "error"; message: string };

export default function FormLayout() {
  const router = useRouter();
  const studentRef = useRef<StudentDetailsHandle>(null);
  const addressRef = useRef<AddressHandle>(null);

  const academicRef = useRef<AcademicInfoHandle>(null);
  const [academicData, setAcademicData] = useState<AcademicFields | null>(null);

  const guardianRef = useRef<GuardianInfoHandle>(null);
  const [guardianData, setGuardianData] = useState<GuardianFields | null>(null);

  const [submission, setSubmission] = useState<SubmissionState>({
    status: "idle",
  });
  const [addressData, setAddressData] = useState<AddressFields | null>(null);

  const handleReset = () => {
    studentRef.current?.reset();
    addressRef.current?.reset();
    academicRef.current?.reset();
    guardianRef.current?.reset();

    setAddressData(null);
    setSubmission({ status: "idle" });
    setAcademicData(null);
  };

  const handleSubmit = async () => {
    const studentData: FormFields | null =
      studentRef.current?.validate() ?? null;

    const addressOk = addressRef.current?.validate() ?? false;

    if (!studentData || !addressOk) return;

    const academicData: AcademicFields | null =
      academicRef.current?.validate() ?? null;
    if (!studentData || !addressOk || !academicData) return;

    const guardianData: GuardianFields | null =
      guardianRef.current?.validate() ?? null;
    if (!studentData || !addressOk || !academicData || !guardianData) return;

    setSubmission({ status: "loading" });

    try {
      const res = await fetch("/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...studentData,
          address: addressData,
          academic: academicData,
          guardian: guardianData,
        }),
      });

      const json = await res.json().catch(() => null);

      if (!res.ok) {
        setSubmission({
          status: "error",
          message: json?.error ?? "Something went wrong. Please try again.",
        });
        return;
      }

      router.push(`/success?amsCode=${encodeURIComponent(json.amsCode)}`);
    } catch {
      setSubmission({
        status: "error",
        message: "Network error. Please check your connection and try again.",
      });
    }
  };

  return (
    <div className="min-h-screen font-sans pb-20">
      <Header />
      <main className="max-w-4xl mx-auto px-2 mt-2 space-y-6">
        {submission.status === "error" && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-5 py-4 text-sm text-red-700 font-medium">
            ⚠️ {submission.message}
          </div>
        )}

        <StudentDetails ref={studentRef} />

        <Address ref={addressRef} onChange={setAddressData} />

        <AcademicInfo ref={academicRef} onChange={setAcademicData} />

        <GuardianInfo ref={guardianRef} onChange={setGuardianData} />

        <FormActions
          isLoading={submission.status === "loading"}
          onReset={handleReset}
          onSubmit={handleSubmit}
        />
      </main>
    </div>
  );
}
