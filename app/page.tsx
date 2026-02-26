import Image from "next/image";
import Link from "next/link";
import MotionSection from "./components/MotionSection";

import {
  BookOpen,
  HelpCircle,
  FileText,
  CheckSquare,
  AlertCircle,
  ArrowRight,
  User,
  CreditCard,
  GraduationCap,
  PenTool,
  FileCheck,
  ShieldAlert,
} from "lucide-react";
export default function Home() {
  return (
    <div className="min-h-screen font-sans pb-20">
      <header className="bg-white border-b border-slate-200 py-8 px-4">
        <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
          <Image
            src="/logo.svg"
            width={400}
            height={70}
            alt="Tribhuvan University Logo"
          />
          <Link
            href="/admin"
            className="absolute top-4 right-4 text-blue-600 hover:underline text-sm font-medium"
          >
            admin
          </Link>
          <h2 className="text-sm font-semibold text-red-700 tracking-wider uppercase">
            Tribhuvan University
          </h2>
          <h1 className="text-xl font-bold text-slate-900 mt-1 uppercase">
            Institute of Medicine
          </h1>
          <div className="mt-6 space-y-2">
            <h3 className="text-2xl font-bold text-slate-800">
              IOM Bachelor Program Online Admission 2082/2025
            </h3>
            <div className="inline-block bg-blue-50 text-blue-700 px-4 py-1 rounded-full text-sm font-medium border border-blue-100">
              Admission Application Form
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 mt-8 space-y-6">
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
                <h4 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  Welcome & Instructions
                </h4>
                <p className="text-slate-600 mt-2 leading-relaxed">
                  Welcome to the IOM Online Student Admission Application
                  Portal. Ensure all provided information is accurate and
                  matches your documents.
                </p>
              </div>
            </div>

            <div className="mt-6 bg-amber-50 border border-amber-100 rounded-lg p-4 flex items-center gap-3">
              <HelpCircle className="w-5 h-5 text-amber-600 shrink-0" />
              <p className="text-sm text-amber-800">
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
            <h4 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-6">
              <FileText className="w-6 h-6 text-blue-600" />
              Required Documents Specification
            </h4>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-y border-slate-200">
                    <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Document Type
                    </th>
                    <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Max Dimension
                    </th>
                    <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Max Size
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="px-4 py-4 text-sm text-slate-700 font-medium">
                      Passport Size Photo
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-600">
                      350x450 px
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-600 font-medium">
                      200 KB
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-4 text-sm text-slate-700 font-medium">
                      Citizenship/Passport
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-600">
                      800x600 px
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-600 font-medium">
                      500 KB
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-4 text-sm text-slate-700 font-medium">
                      Academic Transcripts
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-600">
                      A4 Scan
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-600 font-medium">
                      1 MB
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-4 text-sm text-slate-700 font-medium">
                      Bank Voucher
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-600">
                      Clear Scan
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-600 font-medium">
                      500 KB
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mt-8">
              <div>
                <h5 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
                  Mandatory Documents
                </h5>
                <ul className="space-y-3">
                  {[
                    { icon: User, text: "Recent Passport Size Photograph" },
                    {
                      icon: CreditCard,
                      text: "Citizenship Certificate or Passport",
                    },
                    {
                      icon: GraduationCap,
                      text: "SLC/SEE Marksheet & Character Certificate",
                    },
                    {
                      icon: GraduationCap,
                      text: "Plus Two/PCL Transcript & Character Certificate",
                    },
                    {
                      icon: FileCheck,
                      text: "Bank Deposit Voucher / Payment Proof",
                    },
                    { icon: PenTool, text: "Scanned Signature" },
                  ].map((item, idx) => (
                    <li
                      key={idx}
                      className="flex items-center gap-3 text-sm text-slate-700 group"
                    >
                      <div className="w-6 h-6 rounded-full bg-pink-50 flex items-center justify-center shrink-0 group-hover:bg-pink-100 transition-colors">
                        <item.icon className="w-3.5 h-3.5 text-pink-500" />
                      </div>
                      {item.text}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h5 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
                  Conditional Documents
                </h5>
                <ul className="space-y-3">
                  {[
                    {
                      icon: FileText,
                      text: "Equivalence Certificate (if studied abroad)",
                    },
                    {
                      icon: FileText,
                      text: "Reservation Category Certificate (if applicable)",
                    },
                    {
                      icon: FileText,
                      text: "Professional Council Registration (if applicable)",
                    },
                    { icon: User, text: "Identification Document of Guardian" },
                  ].map((item, idx) => (
                    <li
                      key={idx}
                      className="flex items-center gap-3 text-sm text-slate-700 group"
                    >
                      <div className="w-6 h-6 rounded-full bg-orange-50 flex items-center justify-center shrink-0 group-hover:bg-orange-100 transition-colors">
                        <item.icon className="w-3.5 h-3.5 text-orange-500" />
                      </div>
                      {item.text}
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
                <h4 className="text-lg font-bold text-slate-800">
                  Submission CODE:
                </h4>
                <p className="text-slate-600 mt-1 text-sm">
                  Generated after final submission and sent to your email and
                  mobile number immediately. Keep this safe.
                </p>
              </div>
            </div>
          </div>
        </MotionSection>

        <MotionSection
          delay={0.4}
          className="bg-red-50 border border-red-200 rounded-xl overflow-hidden"
        >
          <div className="p-6">
            <h4 className="text-lg font-bold text-red-800 flex items-center gap-2 mb-4">
              <ShieldAlert className="w-6 h-6" />
              IMPORTANT ADMISSION NOTICE
            </h4>
            <ol className="list-decimal list-inside space-y-3 text-sm text-red-900 font-medium">
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
          <p className="text-sm text-slate-500">
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
