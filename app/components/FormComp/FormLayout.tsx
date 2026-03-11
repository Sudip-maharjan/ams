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

type SubmissionState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "error"; message: string };

export default function FormLayout() {
  const router = useRouter();
  const studentRef = useRef<StudentDetailsHandle>(null);
  const addressRef = useRef<AddressHandle>(null);

  const [submission, setSubmission] = useState<SubmissionState>({
    status: "idle",
  });
  const [addressData, setAddressData] = useState<AddressFields | null>(null);

  const handleReset = () => {
    studentRef.current?.reset();
    addressRef.current?.reset();
    setAddressData(null);
    setSubmission({ status: "idle" });
  };

  const handleSubmit = async () => {
    // 1. Validate StudentDetails — returns data or null if invalid
    const studentData: FormFields | null =
      studentRef.current?.validate() ?? null;

    // 2. Validate address — returns true/false and sets inline errors
    const addressOk = addressRef.current?.validate() ?? false;

    if (!studentData || !addressOk) return; // inline errors shown in each section

    setSubmission({ status: "loading" });

    try {
      const res = await fetch("/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...studentData, address: addressData }),
      });

      const json = await res.json().catch(() => null);

      if (!res.ok) {
        setSubmission({
          status: "error",
          message: json?.error ?? "Something went wrong. Please try again.",
        });
        return;
      }

      // 3. Navigate to the dedicated success page with the AMS code in the URL
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

        {/* Student Details section — controlled via ref */}
        <StudentDetails ref={studentRef} />

        {/* Address section */}
        <Address ref={addressRef} onChange={setAddressData} />

        {/* Add more form sections here in the future — they just need to expose
            a ref with validate() + reset(), same pattern as StudentDetails     */}

        {/* Shared submit / reset buttons */}
        <FormActions
          isLoading={submission.status === "loading"}
          onReset={handleReset}
          onSubmit={handleSubmit}
        />
      </main>
    </div>
  );
}
