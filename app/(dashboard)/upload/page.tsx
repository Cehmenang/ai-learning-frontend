"use client"

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Upload,
  FileText,
  X,
  Check,
  AlertCircle,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import { uploadDocument } from "@/action/document";

interface UploadedFile {
  file: File;
  id: string;
}

const allowedTypes: Record<string, string> = {
  "application/pdf": "PDF",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "DOCX",
  "text/plain": "TXT",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation": "PPTX",
};

const typeColors: Record<string, { text: string; bg: string; dot: string }> = {
  PDF: { text: "text-red-400", bg: "bg-red-400/10", dot: "bg-red-400" },
  DOCX: { text: "text-blue-400", bg: "bg-blue-400/10", dot: "bg-blue-400" },
  TXT: { text: "text-green-400", bg: "bg-green-400/10", dot: "bg-green-400" },
  PPTX: { text: "text-orange-400", bg: "bg-orange-400/10", dot: "bg-orange-400" },
};

export default function UploadDocument() {
  const router = useRouter();
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [error, setError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getFileType = (mimeType: string): string | undefined => {
    return allowedTypes[mimeType];
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  const validateFile = (file: File): boolean => {
    if (!getFileType(file.type)) {
      setError(`Tipe file ${file.name} tidak didukung. Gunakan PDF, DOCX, TXT, atau PPTX.`);
      return false;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError(`File ${file.name} terlalu besar. Maksimal 10MB.`);
      return false;
    }
    return true;
  };

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    setError("");
    const newFiles: UploadedFile[] = [];
    Array.from(files).forEach((file) => {
      if (validateFile(file)) {
        newFiles.push({ file, id: Math.random().toString(36).substring(7) });
      }
    });
    setUploadedFiles((prev) => [...prev, ...newFiles]);
  };

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(false); };
  const handleDrop = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(false); handleFiles(e.dataTransfer.files); };
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => handleFiles(e.target.files);
  const removeFile = (id: string) => { setUploadedFiles((prev) => prev.filter((f) => f.id !== id)); setError(""); };

  // Logic upload kamu, diintegrasikan ke UI template
  const handleUpload = async () => {
    if (uploadedFiles.length === 0) {
      setError("Pilih minimal satu file untuk diupload");
      return;
    }

    setIsUploading(true);
    setError("");

    try {
      // Upload satu per satu karena backend kamu terima single file
      for (const uploadedFile of uploadedFiles) {
        const form = new FormData();
        form.append("document", uploadedFile.file);

        try{
            await uploadDocument(form)
        }catch(err){
            throw new Error(`Gagal upload ${uploadedFile.file.name}`);
        }
      }

      setUploadSuccess(true);
      setTimeout(() => router.push("/document"), 2000);
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan saat upload");
    } finally {
      setIsUploading(false);
    }
  };

  if (uploadSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center mx-auto">
            <Check className="w-10 h-10 text-green-400" />
          </div>
          <div>
            <h2 className="text-white mb-2" style={{ fontSize: "20px", fontWeight: 600 }}>
              Upload Berhasil!
            </h2>
            <p className="text-[#4a4a6a]" style={{ fontSize: "14px" }}>
              {uploadedFiles.length} dokumen berhasil diupload
            </p>
          </div>
          <div className="flex items-center gap-1 text-[#4a4a6a] justify-center">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span style={{ fontSize: "13px" }}>Mengalihkan ke halaman dokumen...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.push("/document")}
          className="w-10 h-10 rounded-xl bg-[#0e0e18] border border-[#1e1e2e] hover:border-[#6366f1]/30 flex items-center justify-center text-[#4a4a6a] hover:text-[#818cf8] transition-all duration-200"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-white" style={{ fontSize: "24px", fontWeight: 700 }}>Upload Dokumen</h1>
          <p className="text-[#4a4a6a] mt-1" style={{ fontSize: "14px" }}>
            Upload dokumen untuk di-generate AI quiz dan flashcards
          </p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-red-400 flex-1" style={{ fontSize: "14px", fontWeight: 500 }}>{error}</p>
          <button onClick={() => setError("")} className="text-red-400 hover:text-red-300 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Upload Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`rounded-2xl border-2 border-dashed transition-all duration-200 ${
          isDragging ? "border-[#6366f1] bg-[#6366f1]/5" : "border-[#1e1e2e] bg-[#0e0e18]"
        }`}
      >
        <div className="p-12 text-center">
          <div className={`w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center border transition-all duration-200 ${
            isDragging ? "bg-[#6366f1]/20 border-[#6366f1]/40" : "bg-[#1e1e2e] border-[#2e2e3e]"
          }`}>
            <Upload className={`w-8 h-8 transition-colors ${isDragging ? "text-[#818cf8]" : "text-[#4a4a6a]"}`} />
          </div>
          <h3 className="text-white mb-2" style={{ fontSize: "16px", fontWeight: 600 }}>Drag & drop file di sini</h3>
          <p className="text-[#4a4a6a] mb-4" style={{ fontSize: "14px" }}>atau klik tombol di bawah untuk memilih file</p>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-6 py-2.5 rounded-xl bg-[#6366f1] hover:bg-[#5558e8] text-white transition-all duration-200 shadow-lg shadow-indigo-500/20"
            style={{ fontSize: "14px", fontWeight: 500 }}
          >
            Pilih File
          </button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf,.docx,.txt,.pptx"
            onChange={handleFileInput}
            className="hidden"
          />
          <p className="text-[#3a3a5a] mt-4" style={{ fontSize: "12px" }}>
            Mendukung: PDF, DOCX, TXT, PPTX (Maks. 10MB per file)
          </p>
        </div>
      </div>

      {/* Uploaded Files List */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-white" style={{ fontSize: "16px", fontWeight: 600 }}>
              File yang dipilih ({uploadedFiles.length})
            </h2>
            <button onClick={() => setUploadedFiles([])} className="text-[#4a4a6a] hover:text-red-400 transition-colors" style={{ fontSize: "13px" }}>
              Hapus semua
            </button>
          </div>
          <div className="space-y-2">
            {uploadedFiles.map((uploadedFile) => {
              const fileType = getFileType(uploadedFile.file.type);
              const colors = fileType ? typeColors[fileType] : typeColors.TXT;
              return (
                <div key={uploadedFile.id} className="rounded-xl border border-[#1e1e2e] bg-[#0e0e18] p-4 flex items-center gap-4 group hover:border-[#6366f1]/30 transition-all duration-200">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${colors.bg}`}>
                    <FileText className={`w-6 h-6 ${colors.text}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white truncate" style={{ fontSize: "14px", fontWeight: 500 }}>{uploadedFile.file.name}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <div className={`flex items-center gap-1 px-2 py-0.5 rounded-md ${colors.bg}`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />
                        <span className={colors.text} style={{ fontSize: "11px", fontWeight: 600 }}>{fileType}</span>
                      </div>
                      <span className="text-[#4a4a6a]" style={{ fontSize: "12px" }}>{formatFileSize(uploadedFile.file.size)}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFile(uploadedFile.id)}
                    className="w-8 h-8 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/40 flex items-center justify-center text-red-400 transition-all duration-200 opacity-0 group-hover:opacity-100"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center gap-3 pt-4 border-t border-[#1e1e2e]">
        <button
          onClick={() => router.push("/documents")}
          className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-[#0e0e18] border border-[#1e1e2e] hover:border-[#2e2e3e] text-[#4a4a6a] hover:text-white transition-all duration-200"
          style={{ fontSize: "14px", fontWeight: 500 }}
        >
          Batal
        </button>
        <button
          onClick={handleUpload}
          disabled={uploadedFiles.length === 0 || isUploading}
          className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-[#6366f1] hover:bg-[#5558e8] text-white transition-all duration-200 shadow-lg shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#6366f1] flex items-center justify-center gap-2"
          style={{ fontSize: "14px", fontWeight: 500 }}
        >
          {isUploading ? (
            <><Loader2 className="w-4 h-4 animate-spin" /><span>Mengupload...</span></>
          ) : (
            <><Upload className="w-4 h-4" /><span>Upload {uploadedFiles.length > 0 && `(${uploadedFiles.length})`}</span></>
          )}
        </button>
      </div>

      {/* Info Card */}
      <div className="rounded-xl border border-[#1e1e2e] bg-[#0e0e18] p-5">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#6366f1]/10 flex items-center justify-center flex-shrink-0">
            <AlertCircle className="w-5 h-5 text-[#818cf8]" />
          </div>
          <div className="flex-1 space-y-2">
            <h3 className="text-white" style={{ fontSize: "14px", fontWeight: 600 }}>Tips Upload Dokumen</h3>
            <ul className="space-y-1.5 text-[#4a4a6a]" style={{ fontSize: "13px" }}>
              <li className="flex items-start gap-2"><span className="text-[#818cf8] mt-0.5">•</span><span>Pastikan dokumen berisi konten yang jelas untuk hasil AI terbaik</span></li>
              <li className="flex items-start gap-2"><span className="text-[#818cf8] mt-0.5">•</span><span>File PDF dan DOCX menghasilkan quiz yang lebih akurat</span></li>
              <li className="flex items-start gap-2"><span className="text-[#818cf8] mt-0.5">•</span><span>Proses AI akan otomatis dimulai setelah upload selesai</span></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}