"use client"

import {
  FileText,
  BookOpen,
  TrendingUp,
  ArrowUpRight,
  Zap,
  Target,
} from "lucide-react";
import Link from "next/link";
import { getAllCount } from "@/action/dashboard";
import { useEffect, useState } from "react";
import { getUserInfo } from "@/action/user";

const typeColors: Record<string, string> = {
  PDF: "text-red-400 bg-red-400/10",
  DOCX: "text-blue-400 bg-blue-400/10",
  TXT: "text-green-400 bg-green-400/10",
  PPTX: "text-orange-400 bg-orange-400/10",
};

function StatCard({
  icon: Icon,
  label,
  value,
  trend,
  color,
  bgColor,
  borderColor,
}: {
  icon: React.ElementType;
  label: string;
  value: number | string;
  trend?: string;
  color: string;
  bgColor: string;
  borderColor: string;
}) {
  return (
    <div
      className="relative rounded-2xl p-6 border overflow-hidden transition-transform duration-200 hover:-translate-y-0.5"
      style={{ background: "#0e0e18", borderColor }}
    >
      <div
        className="absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-10 blur-2xl"
        style={{ backgroundColor: color }}
      />
      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-[#5a5a7a] mb-1" style={{ fontSize: "13px" }}>{label}</p>
          <p className="text-white" style={{ fontSize: "36px", fontWeight: 700, lineHeight: 1.1 }}>{value}</p>
          {trend && (
            <div className="flex items-center gap-1 mt-2">
              <TrendingUp className="w-3 h-3 text-emerald-400" />
              <span className="text-emerald-400" style={{ fontSize: "12px" }}>{trend}</span>
            </div>
          )}
        </div>
        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: bgColor }}>
          <Icon className="w-6 h-6" style={{ color }} />
        </div>
      </div>
    </div>
  );
}

type TypeCount = { documents: number; quizzes: number; attempts: number }
type TypeUser = { username: string; email: string }

export default function Main({ token }: { token: string }) {
  const [count, setCount] = useState<TypeCount | null>(null)
  const [user, setUser] = useState<TypeUser | null>(null)

  useEffect(() => {
    (async function () {
      const result = await getAllCount()
      const getUser = await getUserInfo(token)
      setUser(getUser)
      setCount(result!)
    })()
  }, [])

  if (!user) return null

  return (
    <div className="p-6 lg:p-8 space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-white" style={{ fontSize: "24px", fontWeight: 700 }}>
            Good morning, {user.username}! 👋
          </h1>
          <p className="text-[#4a4a6a] mt-1" style={{ fontSize: "14px" }}>
            Selamat datang kembali. Yuk lanjut belajar hari ini!
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0e0e18] border border-[#1e1e2e]">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[#4a4a6a]" style={{ fontSize: "13px" }}>Online</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          icon={FileText}
          label="Total Dokumen"
          value={count?.documents ?? 0}
          trend="+2 minggu ini"
          color="#6366f1"
          bgColor="rgba(99,102,241,0.15)"
          borderColor="rgba(99,102,241,0.15)"
        />
        <StatCard
          icon={Target}
          label="Total Quiz"
          value={count?.quizzes ?? 0}
          trend="+5 minggu ini"
          color="#f59e0b"
          bgColor="rgba(245,158,11,0.15)"
          borderColor="rgba(245,158,11,0.15)"
        />
        <StatCard
          icon={BookOpen}
          label="Total Attempts"
          value={count?.attempts ?? 0}
          trend="+12 minggu ini"
          color="#10b981"
          bgColor="rgba(16,185,129,0.15)"
          borderColor="rgba(16,185,129,0.15)"
        />
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-white mb-4" style={{ fontSize: "17px", fontWeight: 600 }}>
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              icon: FileText,
              label: "Upload Dokumen",
              desc: "Tambah dokumen baru untuk dipelajari",
              color: "#6366f1",
              url: "/upload",
            },
            {
              icon: Zap,
              label: "Start Quiz",
              desc: "Mulai quiz dari dokumen kamu",
              color: "#f59e0b",
              url: "/document",
            },
            {
              icon: BookOpen,
              label: "Review Hasil",
              desc: "Evaluasi hasil quiz sebelumnya",
              color: "#10b981",
              url: "/document",
            },
          ].map((action) => {
            const Icon = action.icon;
            return (
              <Link
                href={action.url}
                key={action.label}
                className="flex items-center gap-4 p-5 rounded-2xl border border-[#1e1e2e] hover:border-[#2e2e4e] hover:bg-[#13131f] transition-all duration-200 group"
                style={{ background: "#0e0e18" }}
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${action.color}20` }}
                >
                  <Icon className="w-5 h-5" style={{ color: action.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white" style={{ fontSize: "14px", fontWeight: 500 }}>{action.label}</p>
                  <p className="text-[#4a4a6a] mt-0.5" style={{ fontSize: "12px" }}>{action.desc}</p>
                </div>
                <ArrowUpRight className="w-4 h-4 text-[#3a3a5a] group-hover:text-[#5a5a7a] transition-colors flex-shrink-0" />
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}