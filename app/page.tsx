import Link from "next/link";
import MotionSection from "./components/MotionSection";
import {
  documentRequirements,
  mandatoryDocuments,
  conditionalDocuments,
} from "@/lib/data/requirements";

import {
  BookOpen,
  HelpCircle,
  FileText,
  CheckSquare,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";
import Header from "./components/Header";
export default function Home() {
  const docReqs = documentRequirements;
  const mandatory = mandatoryDocuments;
  const conditional = conditionalDocuments;
  return (
    <div className="min-h-screen font-sans pb-20">
      <Header />
      <main className="max-w-4xl mx-auto px-4 mt-6 space-y-6">
        <MotionSection
          delay={0.1}
          className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden"
        >
          <div className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h4 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                  Welcome & Instructions
                </h4>
                <p className="text-slate-600 mt-2 leading-relaxed text-lg">
                  Welcome to the IOM Online Student Admission Application
                  Portal. Ensure all provided information is accurate and
                  matches your documents.
                </p>
              </div>
            </div>

            <div className="mt-6 bg-amber-50 border border-amber-100 rounded-lg p-4 flex items-center gap-3">
              <HelpCircle className="w-5 h-5 text-amber-600 shrink-0" />
              <p className="text-s text-amber-800">
                <span className="font-bold">Need Help?</span> Contact IOM
                Academic Section at{" "}
                <a
                  href="tel:014513163"
                  className="font-bold underline hover:text-amber-900"
                >
                  01-4513163
                </a>{" "}
                during office hours.
              </p>
            </div>
          </div>
        </MotionSection>

        <MotionSection
          delay={0.2}
          className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden"
        >
          <div className="p-6">
            <h4 className="text-2xl font-bold text-slate-800 flex items-center gap-2 mb-6">
              <FileText className="w-6 h-6 text-blue-600" />
              Required Documents Specification
            </h4>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-y border-slate-200">
                    <th className="px-4 py-3 text-s font-bold text-slate-500 uppercase tracking-wider">
                      Document Type
                    </th>
                    <th className="px-4 py-3 text-s font-bold text-slate-500 uppercase tracking-wider">
                      Max Dimension
                    </th>
                    <th className="px-4 py-3 text-s font-bold text-slate-500 uppercase tracking-wider">
                      Max Size
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-300">
                  {docReqs.map((doc) => (
                    <tr key={doc.id}>
                      <td className="px-4 py-4 text-s text-slate-700 font-medium">
                        {doc.type}
                      </td>
                      <td className="px-4 py-4 text-s text-slate-600">
                        {doc.dimension}
                      </td>
                      <td className="px-4 py-4 text-s text-slate-600 font-medium">
                        {doc.maxSize}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mt-8">
              <div>
                <h5 className="text-lg font-bold text-slate-600 uppercase tracking-widest mb-4">
                  Mandatory Documents
                </h5>
                <ul className="space-y-3">
                  {mandatory.map((item, idx) => (
                    <li
                      key={idx}
                      className="flex items-center gap-3 text-s text-slate-700 group"
                    >
                      <div className="w-6 h-6 rounded-full bg-pink-50 flex items-center justify-center shrink-0 group-hover:bg-pink-100 transition-colors">
                        <item.icon className="w-5 h-5 text-pink-500" />
                      </div>
                      <p className="font-semibold">{item.text}</p>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h5 className="text-lg font-bold text-slate-600 uppercase tracking-widest mb-4">
                  Conditional Documents
                </h5>
                <ul className="space-y-3">
                  {conditionalDocuments.map((item, idx) => (
                    <li
                      key={idx}
                      className="flex items-center gap-3 text-s text-slate-700 group"
                    >
                      <div className="w-6 h-6 rounded-full bg-orange-50 flex items-center justify-center shrink-0 group-hover:bg-orange-100 transition-colors">
                        <item.icon className="w-5 h-5 text-orange-500" />
                      </div>
                      <p className="font-semibold">{item.text}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </MotionSection>

        <MotionSection
          delay={0.3}
          className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden"
        >
          <div className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <CheckSquare className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <h4 className="text-2xl font-bold text-slate-800">
                  Submission CODE:
                </h4>
                <p className="text-slate-600 mt-1 text-lg">
                  Generated after final submission and sent to your email and
                  mobile number immediately. Keep this safe.
                </p>
              </div>
            </div>
          </div>
        </MotionSection>

        <MotionSection
          delay={0.4}
          className="bg-red-50 border-2 border-red-900 rounded-xl overflow-hidden"
        >
          <div className="p-7">
            <h4 className="text-2xl font-bold text-red-800 flex items-center gap-2 mb-4">
              <ShieldAlert className="w-6 h-6" />
              IMPORTANT ADMISSION NOTICE
            </h4>
            <ol className="list-decimal list-inside space-y-3 text-lg text-red-700  font-medium">
              <li className="leading-relaxed">
                Candidates must follow the University/Academy's code of conduct
                and academic policies immediately after admission.
              </li>
              <li className="leading-relaxed">
                Candidates who submit fake documents will be rusticated at any
                time (even after admission) and will be liable for legal actions
                as per Nepal law.
              </li>
            </ol>
          </div>
        </MotionSection>

        <div className="pt-8 text-center space-y-6">
          <p className="text-lg text-slate-500">
            By continuing, you agree to the terms above.
          </p>
          <Link
            href="/students"
            className="inline-flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white px-10 py-4 rounded-lg font-bold text-lg shadow-lg shadow-blue-200 transition-all active:scale-95"
          >
            Accept and Start Application
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </main>
    </div>
  );
}
