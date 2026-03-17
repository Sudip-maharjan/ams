import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Search } from "lucide-react";

const statusStyles: Record<string, string> = {
  SUBMITTED: "bg-blue-50 text-blue-700",
  UNDER_REVIEW: "bg-yellow-50 text-yellow-700",
  APPROVED: "bg-green-50 text-green-700",
  REJECTED: "bg-red-50 text-red-700",
  DRAFT: "bg-slate-100 text-slate-600",
};

export default async function RequestsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>;
}) {
  const { q, status } = await searchParams;

  const applications = await prisma.studentApplication.findMany({
    where: {
      status: status ? (status as any) : { in: ["SUBMITTED", "UNDER_REVIEW"] },
      OR: q
        ? [
            { firstName: { contains: q, mode: "insensitive" } },
            { lastName: { contains: q, mode: "insensitive" } },
            { amsCode: { contains: q, mode: "insensitive" } },
            { email: { contains: q, mode: "insensitive" } },
          ]
        : undefined,
    },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      amsCode: true,
      firstName: true,
      lastName: true,
      program: true,
      college: true,
      status: true,
      mobileNumber: true,
      createdAt: true,
    },
  });

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 flex flex-col sm:flex-row gap-3 shrink-0">
        <form method="GET" className="flex gap-3 flex-1">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              name="q"
              defaultValue={q}
              placeholder="Search by name, AMS code, email…"
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            name="status"
            defaultValue={status ?? ""}
            className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Pending</option>
            <option value="SUBMITTED">Submitted</option>
            <option value="UNDER_REVIEW">Under Review</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>
          <button
            type="submit"
            className="bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-800 transition-colors"
          >
            Search
          </button>
        </form>
      </div>

      {/* Table — fixed height, scrolls internally */}
      <div className="bg-white rounded-xl border border-slate-200 flex flex-col min-h-0">
        {/* Table header — sticky, never scrolls */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between shrink-0">
          <h2 className="font-semibold text-slate-800">Applications</h2>
          <span className="text-sm text-slate-500">
            {applications.length} result{applications.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Scrollable area — exactly 7 rows (each row ~53px + thead ~45px) */}
        <div
          className="overflow-auto"
          style={{ maxHeight: "calc(7 * 53px + 45px)" }}
        >
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-white z-10">
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
                <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {applications.map((app) => (
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
                  <td className="px-5 py-3">
                    <Link
                      href={`/admin/approve?id=${app.id}`}
                      className="text-blue-600 hover:underline text-xs font-medium"
                    >
                      Review
                    </Link>
                  </td>
                </tr>
              ))}
              {applications.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-8 text-center text-slate-400"
                  >
                    No applications found.
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
