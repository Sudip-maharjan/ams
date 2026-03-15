import { prisma } from "@/lib/prisma";

export default async function ApprovedPage() {
  const applications = await prisma.studentApplication.findMany({
    where: { status: "APPROVED" },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      amsCode: true,
      firstName: true,
      lastName: true,
      program: true,
      college: true,
      email: true,
      mobileNumber: true,
      createdAt: true,
    },
  });

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl border border-slate-200">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-semibold text-slate-800">Approved Students</h2>
          <span className="text-sm text-slate-500">
            {applications.length} student{applications.length !== 1 ? "s" : ""}
          </span>
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
                <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden lg:table-cell">
                  Contact
                </th>
                <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden md:table-cell">
                  Date
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
                  <td className="px-5 py-3 text-slate-600 hidden lg:table-cell">
                    <div>{app.email}</div>
                    <div className="text-xs text-slate-400">
                      {app.mobileNumber}
                    </div>
                  </td>
                  <td className="px-5 py-3 text-slate-500 hidden md:table-cell">
                    {new Date(app.createdAt).toLocaleDateString("en-GB")}
                  </td>
                </tr>
              ))}
              {applications.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-8 text-center text-slate-400"
                  >
                    No approved students yet.
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
