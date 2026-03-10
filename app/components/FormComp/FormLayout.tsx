"use client";
import { useState } from "react";
import Header from "../Header";
import StudentDetails from "./StudentDetails";

type SubmissionState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; amsCode: string }
  | { status: "error"; message: string };

export default function FormLayout() {
  const [submission, setSubmission] = useState<SubmissionState>({
    status: "idle",
  });

  const handleSubmit = async (formData: Record<string, string>) => {
    setSubmission({ status: "loading" });

    try {
      const res = await fetch("/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const json = await res.json().catch(() => null);

      if (!res.ok) {
        setSubmission({
          status: "error",
          message: json?.error ?? "Something went wrong. Please try again.",
        });
        return;
      }

      setSubmission({ status: "success", amsCode: json.amsCode });
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
        {submission.status === "success" ? (
          <div className="bg-white rounded-xl border border-emerald-200 shadow-sm overflow-hidden">
            <div className="p-10 flex flex-col items-center text-center gap-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-emerald-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-slate-800">
                Application Submitted!
              </h2>
              <p className="text-slate-500 max-w-sm">
                Your application has been received. Please save your submission
                code — you will need it for future reference.
              </p>
              <div className="mt-2 px-8 py-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                <p className="text-xs font-semibold uppercase tracking-widest text-emerald-600 mb-1">
                  Your AMS Code
                </p>
                <p className="text-3xl font-bold tracking-widest text-emerald-700">
                  {submission.amsCode}
                </p>
              </div>
              <p className="text-sm text-slate-400 mt-2">
                A confirmation has been sent to your email and mobile number.
              </p>
            </div>
          </div>
        ) : (
          <>
            {submission.status === "error" && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-5 py-4 text-sm text-red-700 font-medium">
                ⚠️ {submission.message}
              </div>
            )}
            <StudentDetails
              onSubmit={handleSubmit}
              isLoading={submission.status === "loading"}
            />
          </>
        )}
      </main>
    </div>
  );
}
