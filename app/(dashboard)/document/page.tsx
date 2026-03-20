"use client"

import { useEffect, useState } from "react";
import {
  FileText,
  Search,
  Upload,
  Clock,
  ArrowUpRight,
  Grid2x2,
  List,
  File,
} from "lucide-react";
import Link from "next/link";
import { getDocumentsByUser } from "@/action/document";

const typeColors: Record<string, { text: string; bg: string; dot: string }> = {
  PDF: { text: "text-red-400", bg: "bg-red-400/10", dot: "bg-red-400" },
  DOCX: { text: "text-blue-400", bg: "bg-blue-400/10", dot: "bg-blue-400" },
  TXT: { text: "text-green-400", bg: "bg-green-400/10", dot: "bg-green-400" },
  PPTX: { text: "text-orange-400", bg: "bg-orange-400/10", dot: "bg-orange-400" },
};

function getDocType(title: string): string {
  if (title?.toLowerCase().endsWith('.pdf')) return 'PDF';
  if (title?.toLowerCase().endsWith('.docx')) return 'DOCX';
  if (title?.toLowerCase().endsWith('.txt')) return 'TXT';
  if (title?.toLowerCase().endsWith('.pptx')) return 'PPTX';
  return 'PDF';
}

function DocumentCard({ doc }: { doc: any }) {
  const docType = getDocType(doc.title);
  const colors = typeColors[docType] || typeColors.PDF;

  return (
    <div
      className="group rounded-2xl border border-[#1e1e2e] hover:border-[#6366f1]/30 transition-all duration-200 hover:-translate-y-0.5 flex flex-col overflow-hidden"
      style={{ background: "#0e0e18" }}
    >
      <div className="p-4 pb-3 flex-1">
        <div className="flex items-start justify-between mb-3">
          <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-md ${colors.bg}`}>
            <div className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />
            <span className={`${colors.text}`} style={{ fontSize: "11px", fontWeight: 600 }}>
              {docType}
            </span>
          </div>
          <ArrowUpRight className="w-4 h-4 text-[#3a3a5a] group-hover:text-[#6366f1] transition-colors" />
        </div>
        <h3
          className="text-white mb-3 line-clamp-2 group-hover:text-[#818cf8] transition-colors"
          style={{ fontSize: "14px", fontWeight: 500 }}
        >
          {doc.title}
        </h3>
        <div className="flex gap-x-2 items-center flex-wrap gap-y-2">
          <Link
            href={`document/${doc.id}`}
            className="border border-slate-700 px-3 py-1 rounded-lg text-slate-400 hover:text-slate-200 hover:border-slate-500 transition text-xs"
          >
            Lihat
          </Link>
          <Link
            href={`document/${doc.id}/quizzes`}
            className="border border-slate-700 px-3 py-1 rounded-lg text-slate-400 hover:text-slate-200 hover:border-slate-500 transition text-xs"
          >
            Kuis
          </Link>
        </div>
      </div>

      <div className="px-4 py-3 border-t border-[#1e1e2e] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-[#3a3a5a]">
            <FileText className="w-3 h-3" />
            <span style={{ fontSize: "11px" }}>{doc.pages ?? '-'} hal</span>
          </div>
          <div className="flex items-center gap-1 text-[#3a3a5a]">
            <File className="w-3 h-3" />
            <span style={{ fontSize: "11px" }}>{doc.size ?? '-'}</span>
          </div>
        </div>
        <div className="flex items-center gap-1 text-[#3a3a5a]">
          <Clock className="w-3 h-3" />
          <span style={{ fontSize: "11px" }}>
            {doc.createdAt ? new Date(doc.createdAt).toLocaleDateString('id-ID') : '-'}
          </span>
        </div>
      </div>
    </div>
  );
}

function DocumentRow({ doc }: { doc: any }) {
  const docType = getDocType(doc.title);
  const colors = typeColors[docType] || typeColors.PDF;

  return (
    <Link
      href={`/document/${doc.id}`}
      className="group flex items-center gap-3 p-3 sm:p-4 rounded-xl border border-[#1e1e2e] hover:border-[#6366f1]/30 hover:bg-[#0e0e18] transition-all duration-200"
    >
      <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${colors.bg}`}>
        <FileText className={`w-4 h-4 sm:w-5 sm:h-5 ${colors.text}`} />
      </div>
      <div className="flex-1 min-w-0">
        <p
          className="text-white truncate group-hover:text-[#818cf8] transition-colors"
          style={{ fontSize: "14px", fontWeight: 500 }}
        >
          {doc.title}
        </p>
        <p className="text-[#4a4a6a] truncate" style={{ fontSize: "12px" }}>
          {doc.summary ?? 'Tidak ada ringkasan'}
        </p>
      </div>
      <div className="hidden sm:flex items-center gap-6 flex-shrink-0">
        <p className="text-[#4a4a6a]" style={{ fontSize: "12px" }}>{doc.pages ?? '-'} hal</p>
        <p className="text-[#4a4a6a]" style={{ fontSize: "12px" }}>{doc.size ?? '-'}</p>
        <p className="text-[#4a4a6a]" style={{ fontSize: "12px" }}>
          {doc.createdAt ? new Date(doc.createdAt).toLocaleDateString('id-ID') : '-'}
        </p>
      </div>
      <div className={`hidden sm:flex items-center gap-1 px-2 py-0.5 rounded-md ${colors.bg} flex-shrink-0`}>
        <span className={`${colors.text}`} style={{ fontSize: "11px", fontWeight: 600 }}>
          {docType}
        </span>
      </div>
      <ArrowUpRight className="w-4 h-4 text-[#3a3a5a] group-hover:text-[#6366f1] flex-shrink-0 transition-colors" />
    </Link>
  );
}

export default function DocumentsPage() {
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filter, setFilter] = useState<string>("all");
  const [documents, setDocuments] = useState<any[]>([]);

  useEffect(() => {
    (async function () {
      const response = await getDocumentsByUser() as any[] | null;
      if (response && response.length > 0) setDocuments(response);
    })();
  }, []);

  const types = ["all", "PDF", "DOCX", "TXT", "PPTX"];

  const filtered = documents.filter((doc) => {
    const docType = getDocType(doc.title);
    const matchSearch =
      doc.title?.toLowerCase().includes(search.toLowerCase()) ||
      doc.summary?.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || docType === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-5 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-row items-center justify-between gap-3">
        <div>
          <h1 className="text-white" style={{ fontSize: "22px", fontWeight: 700 }}>
            Dokumen
          </h1>
          <p className="text-[#4a4a6a] mt-0.5" style={{ fontSize: "13px" }}>
            {documents.length} dokumen tersimpan
          </p>
        </div>
        <Link
          href="/upload"
          className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-[#6366f1] hover:bg-[#5558e8] text-white transition-all duration-200 shadow-lg shadow-indigo-500/20 flex-shrink-0"
        >
          <Upload className="w-4 h-4" />
          <span className="hidden sm:inline" style={{ fontSize: "14px", fontWeight: 500 }}>
            Upload Dokumen
          </span>
          <span className="sm:hidden" style={{ fontSize: "13px", fontWeight: 500 }}>
            Upload
          </span>
        </Link>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-3">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#3a3a5a]" />
          <input
            type="text"
            placeholder="Cari dokumen..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0e0e18] border border-[#1e1e2e] text-white placeholder-[#3a3a5a] focus:outline-none focus:border-[#6366f1]/50 transition-colors"
            style={{ fontSize: "14px" }}
          />
        </div>

        {/* Filter + View Toggle */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 flex-1 no-scrollbar">
            {types.map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-2.5 py-1.5 rounded-lg whitespace-nowrap transition-all duration-200 flex-shrink-0 ${
                  filter === type
                    ? "bg-[#6366f1]/15 text-[#818cf8] border border-[#6366f1]/30"
                    : "bg-[#0e0e18] text-[#4a4a6a] border border-[#1e1e2e] hover:text-[#8a8aaa]"
                }`}
                style={{ fontSize: "12px" }}
              >
                {type === "all" ? "Semua" : type}
              </button>
            ))}
          </div>

          {/* View Toggle */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-[#0e0e18] border border-[#1e1e2e] flex-shrink-0">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === "grid" ? "bg-[#6366f1]/15 text-[#818cf8]" : "text-[#3a3a5a] hover:text-[#6a6a8a]"
              }`}
            >
              <Grid2x2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === "list" ? "bg-[#6366f1]/15 text-[#818cf8]" : "text-[#3a3a5a] hover:text-[#6a6a8a]"
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Results Count */}
      {search && (
        <p className="text-[#4a4a6a]" style={{ fontSize: "13px" }}>
          Menampilkan <span className="text-white">{filtered.length}</span> hasil untuk "
          <span className="text-[#818cf8]">{search}</span>"
        </p>
      )}

      {/* Documents */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-14 h-14 rounded-2xl bg-[#0e0e18] border border-[#1e1e2e] flex items-center justify-center mb-4">
            <FileText className="w-7 h-7 text-[#3a3a5a]" />
          </div>
          <h3 className="text-white mb-2" style={{ fontSize: "16px", fontWeight: 600 }}>
            Tidak ada dokumen
          </h3>
          <p className="text-[#4a4a6a]" style={{ fontSize: "14px" }}>
            {search ? "Coba kata kunci lain" : "Upload dokumen pertama kamu"}
          </p>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {filtered.map((doc) => (
            <DocumentCard key={doc.id} doc={doc} />
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((doc) => (
            <DocumentRow key={doc.id} doc={doc} />
          ))}
        </div>
      )}
    </div>
  );
}