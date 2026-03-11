import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-white border-b border-slate-200 py-6 px-4">
      <div className="p-2">
        <Link
          href="/admin"
          className="absolute top-4 right-4 text-blue-600 hover:underline text-s font-medium"
        >
          admin
        </Link>
      </div>
      <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
        <Link href="/">
          <Image
            src="/logo.svg"
            loading="eager"
            width={286}
            height={48}
            alt="Tribhuvan University Logo"
          />
        </Link>

        <h2 className="mt-2 text-s font-semibold text-red-700 tracking-wider uppercase">
          Tribhuvan University
        </h2>

        <div className="mt-1 space-y-2">
          <h3 className="text-2xl font-bold text-slate-800">
            IOM Bachelor Program Online Admission 2082/2025
          </h3>
          <div className="inline-block bg-blue-50 text-blue-700 px-4 py-1 rounded-full text-s font-medium border border-blue-100">
            Admission Application Form
          </div>
        </div>
      </div>
    </header>
  );
}
