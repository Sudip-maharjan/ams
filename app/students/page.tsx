"use client";

import { useState } from "react";

export default function StudentsPage() {
  const [fullName, setFullName] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [amsCode, setAmsCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    // Client-side validation
    if (!fullName || !dob || !gender) {
      alert("Please fill in all fields.");
      return;
    }

    setLoading(true);
    setAmsCode(null); // clear previous result

    try {
      const res = await fetch("/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, dob, gender }),
      });

      const json = await res.json().catch(() => null);

      if (!res.ok) {
        console.error("Server response:", json);
        alert(json?.error || "Something went wrong. Check console.");
        return;
      }

      console.log("Student created:", json);
      setAmsCode(json.amsCode); // show the server-generated AMS code

      // Reset form
      setFullName("");
      setDob("");
      setGender("");
    } catch (err) {
      console.error("Network error:", err);
      alert("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
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
          <option value="MALE">Male</option>
          <option value="FEMALE">Female</option>
          <option value="OTHER">Other</option>
        </select>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-green-600 text-white px-4 py-2 rounded w-full disabled:opacity-50"
        >
          {loading ? "Submitting..." : "Submit Application"}
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
