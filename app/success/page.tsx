import Link from "next/link";
import Header from "../components/Header";
import { CheckCircle, Copy, ArrowLeft } from "lucide-react";

type Props = {
  searchParams: Promise<{ amsCode?: string }>;
};

export default async function SuccessPage({ searchParams }: Props) {
  const { amsCode } = await searchParams;

  // Guard: if someone lands here without a code, redirect back
  if (!amsCode) {
    return (
      <div className="min-h-screen font-sans">
        <Header />
        <main className="max-w-4xl mx-auto px-4 mt-10 text-center">
          <p className="text-slate-500 text-lg">
            No submission code found.{" "}
            <Link href="/students" className="text-blue-600 underline">
              Return to the application form
            </Link>
            .
          </p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-sans pb-20">
      <Header />
      <main className="max-w-2xl mx-auto px-4 mt-10 space-y-6">
        {/* Success card */}
        <div className="bg-white rounded-2xl border border-emerald-200 shadow-sm overflow-hidden">
          <div className="p-10 flex flex-col items-center text-center gap-5">
            {/* Icon */}
            <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center">
              <CheckCircle
                className="w-10 h-10 text-emerald-500"
                strokeWidth={1.8}
              />
            </div>

            <div className="space-y-1">
              <h2 className="text-2xl font-bold text-slate-800">
                Application Submitted!
              </h2>
              <p className="text-slate-500 max-w-sm mx-auto">
                Your application has been received successfully. Please save the
                code below — you will need it for future reference and status
                checks.
              </p>
            </div>

            {/* AMS Code box */}
            <div className="w-full max-w-sm mt-2 px-8 py-5 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-2">
              <p className="text-xs font-semibold uppercase tracking-widest text-emerald-600">
                Your AMS Code
              </p>
              <p className="text-4xl font-bold tracking-widest text-emerald-700">
                {amsCode}
              </p>
            </div>

            {/* Copy hint */}
            <p className="text-xs text-slate-400 flex items-center gap-1.5">
              <Copy className="w-3.5 h-3.5" />
              Screenshot or note this code for your records
            </p>

            <p className="text-sm text-slate-400">
              A confirmation has been sent to your registered email and mobile
              number.
            </p>
          </div>
        </div>

        {/* What's next */}
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 space-y-3">
          <h3 className="text-sm font-bold text-blue-800 uppercase tracking-widest">
            What happens next?
          </h3>
          <ol className="list-decimal list-inside space-y-2 text-sm text-blue-700 font-medium">
            <li>IOM will verify your submitted documents.</li>
            <li>
              You will be notified via email and SMS about your admission
              status.
            </li>
            <li>
              Keep your AMS Code handy to track your application at any time.
            </li>
          </ol>
        </div>

        {/* Back link */}
        <div className="text-center pt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Return to Home
          </Link>
        </div>
      </main>
    </div>
  );
}
