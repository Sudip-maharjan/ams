import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ApprovalWizard from "./ApprovalWizard";

function isObjectId(value: string) {
  return /^[a-f\d]{24}$/i.test(value);
}

export default async function ApprovePage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id } = await searchParams;

  if (!id) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-10 w-full max-w-md">
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-50 mb-4">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-slate-800">
              Find Application
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Enter the AMS code to begin the admission process
            </p>
          </div>
          <form method="GET" className="space-y-3">
            <input
              name="id"
              placeholder="e.g. AMS-A1B2C3D4"
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono tracking-wide"
            />
            <button
              type="submit"
              className="w-full bg-blue-700 text-white px-4 py-3 rounded-xl text-sm font-semibold hover:bg-blue-800 transition-colors"
            >
              Load Application →
            </button>
          </form>
        </div>
      </div>
    );
  }

  const app = await prisma.studentApplication.findFirst({
    where: isObjectId(id) ? { OR: [{ id }, { amsCode: id }] } : { amsCode: id },
  });

  if (!app) notFound();

  // Serialize dates and cast Prisma JsonValue fields for client component
  const serialized = {
    ...app,
    dobAD: app.dobAD.toISOString(),
    createdAt: app.createdAt.toISOString(),
    documentFlags: app.documentFlags as {
      requiresEquivalence?: boolean;
      requiresCouncilCertificate?: boolean;
      requiresBridgeCourse?: boolean;
    } | null,
    documentPaths: app.documentPaths as Record<string, string> | null,
  };

  return <ApprovalWizard application={serialized} />;
}
