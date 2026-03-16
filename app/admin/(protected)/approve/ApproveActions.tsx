// app/admin/approve/ApproveActions.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, XCircle, Eye } from "lucide-react";

const statusStyles: Record<string, string> = {
  SUBMITTED: "bg-blue-50 text-blue-700",
  UNDER_REVIEW: "bg-yellow-50 text-yellow-700",
  APPROVED: "bg-green-50 text-green-700",
  REJECTED: "bg-red-50 text-red-700",
  DRAFT: "bg-slate-100 text-slate-600",
};

export default function ApproveActions({
  id,
  currentStatus,
}: {
  id: string;
  currentStatus: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  const updateStatus = async (status: string) => {
    setLoading(status);
    await fetch("/api/admin/applications/status", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    router.refresh();
    setLoading(null);
  };

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <span
        className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${statusStyles[currentStatus]}`}
      >
        {currentStatus.replace("_", " ")}
      </span>

      {currentStatus !== "UNDER_REVIEW" && (
        <button
          onClick={() => updateStatus("UNDER_REVIEW")}
          disabled={!!loading}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-yellow-50 text-yellow-700 hover:bg-yellow-100 disabled:opacity-50 transition-colors"
        >
          <Eye className="w-3.5 h-3.5" />
          {loading === "UNDER_REVIEW" ? "Updating…" : "Mark Under Review"}
        </button>
      )}

      {currentStatus !== "APPROVED" && (
        <button
          onClick={() => updateStatus("APPROVED")}
          disabled={!!loading}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-green-50 text-green-700 hover:bg-green-100 disabled:opacity-50 transition-colors"
        >
          <CheckCircle className="w-3.5 h-3.5" />
          {loading === "APPROVED" ? "Updating…" : "Approve"}
        </button>
      )}

      {currentStatus !== "REJECTED" && (
        <button
          onClick={() => updateStatus("REJECTED")}
          disabled={!!loading}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-red-50 text-red-700 hover:bg-red-100 disabled:opacity-50 transition-colors"
        >
          <XCircle className="w-3.5 h-3.5" />
          {loading === "REJECTED" ? "Updating…" : "Reject"}
        </button>
      )}
    </div>
  );
}
