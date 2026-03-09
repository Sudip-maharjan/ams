"use client";

import { useState } from "react";

export default function StudentsPage() {
  const [fullName, setFullName] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [amsCode, setAmsCode] = useState<string | null>(null);

  const handleSubmit = async (formData: any) => {
    const res = await fetch("/api/students", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (!res.ok) {
      const json = await res.json().catch(() => null); // parse JSON if available
      console.error("Server response:", json || "(empty)");
      alert("Something went wrong. Check console.");
      return;
    }

    const data = await res.json();
    console.log("Student created:", data);
  };

  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <h1 className="text-2xl font-bold mb-4">Student Application</h1>

      <div className="bg-white p-6 rounded shadow max-w-md">
        <input
          className="border p-2 w-full mb-4"
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />

        <input
          type="date"
          className="border p-2 w-full mb-4"
          value={dob}
          onChange={(e) => setDob(e.target.value)}
        />

        <select
          className="border p-2 w-full mb-4"
          value={gender}
          onChange={(e) => setGender(e.target.value)}
        >
          <option value="">Select Gender</option>
          <option>Male</option>
          <option>Female</option>
          <option>Other</option>
        </select>

        <button
          onClick={handleSubmit}
          className="bg-green-600 text-white px-4 py-2 rounded w-full"
        >
          Submit Application
        </button>

        {amsCode && (
          <p className="mt-4 text-green-700 font-semibold">
            ✅ Application Submitted! Your AMS Code: {amsCode}
          </p>
        )}
      </div>
    </main>
  );
}
