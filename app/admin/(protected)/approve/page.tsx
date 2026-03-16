import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

function isObjectId(value: string) {
  return /^[a-f\d]{24}$/i.test(value);
}
import ApproveActions from "./ApproveActions";

export default async function ApprovePage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id } = await searchParams;

  if (!id) {
    return (
      <div className="bg-white rounded-xl mx-auto mt-10 border border-slate-200 p-8 max-w-md">
        <h2 className="font-semibold text-slate-800 mb-4">Find Application</h2>
        <form method="GET" className="flex gap-3">
          <input
            name="id"
            placeholder="Paste application ID or AMS code…"
            className="flex-1 border border-slate-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-800"
          >
            Load
          </button>
        </form>
      </div>
    );
  }

  const app = await prisma.studentApplication.findFirst({
    where: isObjectId(id) ? { OR: [{ id }, { amsCode: id }] } : { amsCode: id },
  });

  if (!app) notFound();

  const field = (label: string, value: string | null | undefined) =>
    value ? (
      <div key={label}>
        <dt className="text-xs text-slate-400 uppercase tracking-wide">
          {label}
        </dt>
        <dd className="text-sm text-slate-800 font-medium mt-0.5">{value}</dd>
      </div>
    ) : null;

  return (
    <div className="space-y-5 max-w-4xl">
      <div className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="font-mono text-xs text-slate-400">{app.amsCode}</p>
          <h2 className="text-xl font-bold text-slate-800 mt-0.5">
            {app.salutation} {app.firstName} {app.middleName} {app.lastName}
          </h2>
          <p className="text-sm text-slate-500">
            {app.program} — {app.college}
          </p>
        </div>
        <ApproveActions id={app.id} currentStatus={app.status} />
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="font-semibold text-slate-700 mb-4 text-sm uppercase tracking-wide">
            Personal Details
          </h3>
          <dl className="grid grid-cols-2 gap-4">
            {field("First Name (NP)", app.firstNameNepali)}
            {field("Last Name (NP)", app.lastNameNepali)}
            {field("Gender", app.gender)}
            {field(
              "Date of Birth",
              app.dobAD
                ? new Date(app.dobAD).toLocaleDateString("en-GB")
                : null,
            )}
            {field("Mobile", app.mobileNumber)}
            {field("Email", app.email)}
            {field("Blood Group", app.bloodGroup)}
            {field("Nationality Doc", app.nationalityDocType)}
          </dl>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="font-semibold text-slate-700 mb-4 text-sm uppercase tracking-wide">
            Academic Info
          </h3>
          <dl className="grid grid-cols-2 gap-4">
            {field("Category", app.category)}
            {field("Sub Category", app.subCategory)}
            {field("MEC Roll No.", app.mecRollNumber)}
            {field(
              "MEC Rank",
              app.mecRank != null ? String(app.mecRank) : null,
            )}
            {field(
              "MEC Score",
              app.mecScore != null ? String(app.mecScore) : null,
            )}
            {field("Qualification 1", app.qualification1?.qualificationName)}
            {field("School", app.qualification1?.schoolName)}
            {field("Passing Year", app.qualification1?.passingYearAD)}
          </dl>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="font-semibold text-slate-700 mb-4 text-sm uppercase tracking-wide">
            Address
          </h3>
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wide mb-2">
              Permanent
            </p>
            <dl className="grid grid-cols-2 gap-3">
              {field("Province", app.permanentAddress?.province)}
              {field("District", app.permanentAddress?.district)}
              {field("Municipality", app.permanentAddress?.municipality)}
              {field("Ward", app.permanentAddress?.wardNumber)}
            </dl>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="font-semibold text-slate-700 mb-4 text-sm uppercase tracking-wide">
            Parents
          </h3>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-slate-400 mb-1">Father</p>
              <dl className="grid grid-cols-2 gap-3">
                {field("Name", app.father?.name)}
                {field("Phone", app.father?.phone)}
              </dl>
            </div>
            <div>
              <p className="text-xs text-slate-400 mb-1">Mother</p>
              <dl className="grid grid-cols-2 gap-3">
                {field("Name", app.mother?.name)}
                {field("Phone", app.mother?.phone)}
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
