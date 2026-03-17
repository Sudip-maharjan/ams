import { prisma } from "@/lib/prisma";
import Image from "next/image";
import { UserCircle } from "lucide-react";

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
      biometricPhotoUrl: true,
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
                  Photo
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
                  {/* AMS Code */}
                  <td className="px-5 py-3 font-mono text-xs text-slate-600 align-middle">
                    {app.amsCode}
                  </td>

                  {/* Biometric photo */}
                  <td className="px-5 py-3 align-middle">
                    {app.biometricPhotoUrl ? (
                      <Image
                        src={app.biometricPhotoUrl}
                        alt={`${app.firstName} ${app.lastName}`}
                        width={36}
                        height={36}
                        className="w-9 h-9 rounded-full object-cover border border-slate-200"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center">
                        <UserCircle className="w-5 h-5 text-slate-400" />
                      </div>
                    )}
                  </td>

                  {/* Name */}
                  <td className="px-5 py-3 font-medium text-slate-800 align-middle">
                    {app.firstName} {app.lastName}
                  </td>

                  {/* Program */}
                  <td className="px-5 py-3 text-slate-600 hidden md:table-cell align-middle">
                    {app.program}
                  </td>

                  {/* College */}
                  <td className="px-5 py-3 text-slate-600 hidden lg:table-cell align-middle">
                    {app.college}
                  </td>

                  {/* Contact */}
                  <td className="px-5 py-3 text-slate-600 hidden lg:table-cell align-middle">
                    <div>{app.email}</div>
                    <div className="text-xs text-slate-400">
                      {app.mobileNumber}
                    </div>
                  </td>

                  {/* Date */}
                  <td className="px-5 py-3 text-slate-500 hidden md:table-cell align-middle">
                    {new Date(app.createdAt).toLocaleDateString("en-GB")}
                  </td>
                </tr>
              ))}
              {applications.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
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
