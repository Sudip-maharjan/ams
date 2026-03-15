import { prisma } from "@/lib/prisma";
import { ClipboardList, UserCheck, Clock, XCircle } from "lucide-react";

async function getStats() {
  const [total, submitted, approved, rejected, underReview] = await Promise.all(
    [
      prisma.studentApplication.count(),
      prisma.studentApplication.count({ where: { status: "SUBMITTED" } }),
      prisma.studentApplication.count({ where: { status: "APPROVED" } }),
      prisma.studentApplication.count({ where: { status: "REJECTED" } }),
      prisma.studentApplication.count({ where: { status: "UNDER_REVIEW" } }),
    ],
  );
  return { total, submitted, approved, rejected, underReview };
}

async function getRecent() {
  return prisma.studentApplication.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    select: {
      id: true,
      amsCode: true,
      firstName: true,
      lastName: true,
      program: true,
      college: true,
      status: true,
      createdAt: true,
    },
  });
}

const statusStyles: Record<string, string> = {
  SUBMITTED: "bg-blue-50 text-blue-700",
  UNDER_REVIEW: "bg-yellow-50 text-yellow-700",
  APPROVED: "bg-green-50 text-green-700",
  REJECTED: "bg-red-50 text-red-700",
  DRAFT: "bg-slate-100 text-slate-600",
};

export default async function AdminDashboard() {
  const [stats, recent] = await Promise.all([getStats(), getRecent()]);

  const cards = [
    {
      label: "Total Applications",
      value: stats.total,
      icon: ClipboardList,
      color: "text-blue-600 bg-blue-50",
    },
    {
      label: "Pending Review",
      value: stats.submitted + stats.underReview,
      icon: Clock,
      color: "text-yellow-600 bg-yellow-50",
    },
    {
      label: "Approved",
      value: stats.approved,
      icon: UserCheck,
      color: "text-green-600 bg-green-50",
    },
    {
      label: "Rejected",
      value: stats.rejected,
      icon: XCircle,
      color: "text-red-600 bg-red-50",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map(({ label, value, icon: Icon, color }) => (
          <div
            key={label}
            className="bg-white rounded-xl border border-slate-200 p-5"
          >
            <div className={`inline-flex p-2 rounded-lg ${color} mb-3`}>
              <Icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold text-slate-800">{value}</p>
            <p className="text-sm text-slate-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-slate-200">
        <div className="px-5 py-4 border-b border-slate-100">
          <h2 className="font-semibold text-slate-800">Recent Applications</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-left">
                <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  AMS Code
                </th>
                <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Name
                </th>
                <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden md:table-cell">
                  Program
                </th>
                <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden lg:table-cell">
                  College
                </th>
                <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {recent.map((app) => (
                <tr
                  key={app.id}
                  className="hover:bg-slate-50 transition-colors"
                >
                  <td className="px-5 py-3 font-mono text-xs text-slate-600">
                    {app.amsCode}
                  </td>
                  <td className="px-5 py-3 font-medium text-slate-800">
                    {app.firstName} {app.lastName}
                  </td>
                  <td className="px-5 py-3 text-slate-600 hidden md:table-cell">
                    {app.program}
                  </td>
                  <td className="px-5 py-3 text-slate-600 hidden lg:table-cell">
                    {app.college}
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={`px-2 py-1 rounded-md text-xs font-medium ${statusStyles[app.status]}`}
                    >
                      {app.status.replace("_", " ")}
                    </span>
                  </td>
                </tr>
              ))}
              {recent.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-8 text-center text-slate-400"
                  >
                    No applications yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
