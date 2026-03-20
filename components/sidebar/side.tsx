import { logoutHandler } from "@/action/user";
import {
  LayoutDashboard,
  FileText,
  Brain,
  LogOut,
  X,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";

const navItems = [
  { label: "Dashboard", path: "/", icon: LayoutDashboard },
  { label: "Documents", path: "/document", icon: FileText },
];

interface SidebarProps {
  mobileOpen: boolean;
  onMobileClose: () => void;
  user: { username: string, email: string };
}

export default function Sidebar({ mobileOpen, onMobileClose, user }: SidebarProps) {
  return (
    <>
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={onMobileClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-64 flex flex-col
          bg-[#0e0e16] border-r border-[#1e1e2e]
          transform transition-transform duration-300 ease-in-out
          lg:relative lg:translate-x-0 lg:z-auto lg:flex-shrink-0
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-[#1e1e2e]">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-white" style={{ fontWeight: 600, fontSize: "15px" }}>
              Belajar Aja
            </span>
            <p className="text-[#4a4a6a]" style={{ fontSize: "11px" }}>
              Smart Learning with Smart Platform
            </p>
          </div>
          <button
            onClick={onMobileClose}
            className="ml-auto lg:hidden text-[#4a4a6a] hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Info */}
        <div className="px-4 py-4 border-b border-[#1e1e2e]">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-[#13131f]">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#6366f1] to-[#a855f7] flex items-center justify-center flex-shrink-0">
              <span className="text-white" style={{ fontSize: "13px", fontWeight: 600 }}>
                {user?.username && user.username.split(' ').map((name: string) => name[0])}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white truncate" style={{ fontSize: "13px", fontWeight: 500 }}>
                {user?.username}
              </p>
              <p className="text-[#4a4a6a] truncate" style={{ fontSize: "11px" }}>
                {user?.email}
              </p>
            </div>
            <ChevronRight className="w-4 h-4 text-[#4a4a6a] flex-shrink-0" />
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <p className="px-3 mb-3 text-[#3a3a5a] uppercase" style={{ fontSize: "10px", letterSpacing: "0.1em", fontWeight: 600 }}>
            Menu
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                href={item.path}
                onClick={onMobileClose}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-[#5a5a7a] hover:text-white hover:bg-[#13131f]"
              >
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4 h-4" />
                </div>
                <span style={{ fontSize: "14px", fontWeight: 400 }}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="px-3 py-4 border-t border-[#1e1e2e]">
          <button
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[#5a5a7a] hover:text-red-400 hover:bg-red-500/5 transition-all duration-200"
            onClick={logoutHandler}
          >
            <div className="w-8 h-8 rounded-lg flex items-center justify-center">
              <LogOut className="w-4 h-4" />
            </div>
            <span style={{ fontSize: "14px" }}>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}