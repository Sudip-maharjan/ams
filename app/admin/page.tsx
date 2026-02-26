"use client";
import { useState } from "react";
import {
  Users,
  FileCheck,
  Clock,
  XCircle,
  LogOut,
  Search,
  Eye,
  Download,
  Filter,
} from "lucide-react";

// Mock data — replace with real DB fetch
const mockApplications = [
  {
    id: "IOM-001",
    name: "Aarav Sharma",
    program: "MBBS",
    status: "Pending",
    date: "2082-03-10",
    email: "aarav@gmail.com",
  },
  {
    id: "IOM-002",
    name: "Sita Thapa",
    program: "BNS",
    status: "Approved",
    date: "2082-03-09",
    email: "sita@gmail.com",
  },
  {
    id: "IOM-003",
    name: "Bikash KC",
    program: "BPH",
    status: "Rejected",
    date: "2082-03-08",
    email: "bikash@gmail.com",
  },
  {
    id: "IOM-004",
    name: "Priya Rai",
    program: "MBBS",
    status: "Pending",
    date: "2082-03-11",
    email: "priya@gmail.com",
  },
];

const statusColors: Record<string, string> = {
  Pending: "bg-amber-100 text-amber-700",
  Approved: "bg-emerald-100 text-emerald-700",
  Rejected: "bg-red-100 text-red-700",
};

export default function AdminDashboard() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const stats = [
    {
      label: "Total Applications",
      value: mockApplications.length,
      icon: Users,
      color: "bg-blue-500",
    },
    {
      label: "Approved",
      value: mockApplications.filter((a) => a.status === "Approved").length,
      icon: FileCheck,
      color: "bg-emerald-500",
    },
    {
      label: "Pending",
      value: mockApplications.filter((a) => a.status === "Pending").length,
      icon: Clock,
      color: "bg-amber-500",
    },
    {
      label: "Rejected",
      value: mockApplications.filter((a) => a.status === "Rejected").length,
      icon: XCircle,
      color: "bg-red-500",
    },
  ];

  const filtered = mockApplications.filter((a) => {
    const matchSearch =
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.id.includes(search);
    const matchFilter = filter === "All" || a.status === filter;
    return matchSearch && matchFilter;
  });

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "/admin/login";
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Nav */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-slate-900">
            IOM Admin Dashboard
          </h1>
          <p className="text-xs text-slate-500">
            Admission Management 2082/2025
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-sm text-slate-600 hover:text-red-600 transition-colors font-medium"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s) => (
            <div
              key={s.label}
              className="bg-white rounded-xl border border-slate-200 p-5 flex items-center gap-4"
            >
              <div className={`${s.color} p-2.5 rounded-lg`}>
                <s.icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{s.value}</p>
                <p className="text-xs text-slate-500">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Applications Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
            <h2 className="font-bold text-slate-800">Applications</h2>
            <div className="flex gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-56">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search name or ID..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {["All", "Pending", "Approved", "Rejected"].map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  {[
                    "App. ID",
                    "Name",
                    "Program",
                    "Date",
                    "Status",
                    "Actions",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-5 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map((app) => (
                  <tr
                    key={app.id}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-5 py-4 text-sm font-mono text-blue-600 font-medium">
                      {app.id}
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-sm font-semibold text-slate-800">
                        {app.name}
                      </p>
                      <p className="text-xs text-slate-400">{app.email}</p>
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-600">
                      {app.program}
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-500">
                      {app.date}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColors[app.status]}`}
                      >
                        {app.status}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          className="p-1.5 hover:bg-blue-50 rounded-lg text-blue-600 transition-colors"
                          title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          className="p-1.5 hover:bg-emerald-50 rounded-lg text-emerald-600 transition-colors"
                          title="Download"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="text-center py-12 text-slate-400 text-sm">
                No applications found.
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
