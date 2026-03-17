"use client";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  ClipboardList,
  UserCheck,
  UserPlus,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import ShinyLogo from "@/app/components/LogoComp";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  {
    href: "/admin/requests",
    label: "Requests",
    icon: ClipboardList,
    exact: true,
  },
  {
    href: "/admin/approved",
    label: "Approved Students",
    icon: UserCheck,
    exact: true,
  },
  {
    href: "/admin/approve",
    label: "Approve Student",
    icon: UserPlus,
    exact: true,
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
    <div className="h-screen bg-slate-50 flex overflow-hidden">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar — fixed, never scrolls */}
      <aside
        className={`
          fixed top-0 left-0 h-screen w-64 bg-white border-r border-slate-200 z-30
          flex flex-col transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        <div className="p-5 border-b border-slate-100 flex items-center justify-between shrink-0">
          <Link href="/admin">
            <ShinyLogo src="/logo.svg" width={200} height={36} alt="TU Logo" />
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-slate-400 hover:text-slate-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map(({ href, label, icon: Icon, exact }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setSidebarOpen(false)}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                ${
                  isActive(href, exact)
                    ? "bg-blue-50 text-blue-700"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }
              `}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </Link>
          ))}
        </nav>

        <div className="p-3 border-t border-slate-100 shrink-0">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            Logout
          </button>
        </div>
      </aside>

      {/* Content area — offset by sidebar width, fills remaining space */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-64">
        {/* Header — sticky at top of content area */}
        <header className="sticky top-0 z-10 h-14 bg-white border-b border-slate-200 flex items-center px-4 gap-4 lg:px-6 shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-slate-500 hover:text-slate-700"
          >
            <Menu className="w-5 h-5" />
          </button>
          <h1 className="text-sm font-semibold text-slate-700 capitalize">
            {navItems.find((n) => isActive(n.href, n.exact))?.label ?? "Admin"}
          </h1>
        </header>

        {/* Main — scrolls independently of sidebar */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
