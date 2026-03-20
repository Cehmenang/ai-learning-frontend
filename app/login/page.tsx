"use client"
import { googleLoginHandler } from "@/action/user";
import { GoogleLogin } from "@react-oauth/google";
import { redirect } from "next/navigation";
import { Brain, Upload, Bot, Sparkles, ClipboardList } from "lucide-react";

const features = [
  {
    icon: Upload,
    title: "Upload Document",
    description: "Chunk otomatis & disimpan sebagai vector embedding",
    color: "text-blue-400",
    bg: "bg-blue-400/10",
    border: "border-blue-400/20",
  },
  {
    icon: Bot,
    title: "AI Assistant",
    description: "RAG dari dokumen kamu dengan similarity search",
    color: "text-purple-400",
    bg: "bg-purple-400/10",
    border: "border-purple-400/20",
  },
  {
    icon: Sparkles,
    title: "Generate Quiz",
    description: "Randomized window sampling dengan bobot konteks",
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
    border: "border-emerald-400/20",
  },
  {
    icon: ClipboardList,
    title: "Kerjain & Review",
    description: "Scoring otomatis dan review jawaban kamu",
    color: "text-amber-400",
    bg: "bg-amber-400/10",
    border: "border-amber-400/20",
  },
]

export default function Login() {
  return (
    <div className="min-h-svh bg-[#080810] flex flex-col lg:flex-row">

      {/* Left Panel - Features */}
      <div className="lg:flex-1 flex flex-col justify-center px-8 py-12 lg:px-16 lg:py-20">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-white font-bold text-lg">Belajar Aja</span>
            <p className="text-[#4a4a6a] text-xs">Smart Learning with Smart Platform</p>
          </div>
        </div>

        {/* Headline */}
        <div className="mb-10">
          <h1 className="text-white font-extrabold text-3xl lg:text-4xl leading-tight mb-3">
            Belajar lebih cerdas<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6366f1] to-[#a855f7]">
              dengan bantuan AI
            </span>
          </h1>
          <p className="text-[#4a4a6a] text-sm leading-relaxed max-w-md">
            Upload dokumen kamu, tanya apapun, dan generate kuis otomatis — semua didukung teknologi RAG.
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <div
                key={feature.title}
                className={`flex items-start gap-3 p-4 rounded-2xl border ${feature.border} ${feature.bg}`}
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 bg-black/20`}>
                  <Icon className={`w-4 h-4 ${feature.color}`} />
                </div>
                <div>
                  <p className={`text-sm font-semibold ${feature.color}`}>{feature.title}</p>
                  <p className="text-[#4a4a6a] text-xs mt-0.5 leading-relaxed">{feature.description}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Right Panel - Login */}
      <div className="lg:w-[440px] flex items-center justify-center px-8 py-12 lg:py-20 lg:border-l lg:border-[#1e1e2e]">
        <div className="w-full max-w-sm">
          {/* Card */}
          <div className="bg-[#0e0e18] border border-[#1e1e2e] rounded-3xl p-8">
            <div className="mb-8">
              <h2 className="text-white font-bold text-2xl mb-1">Masuk</h2>
              <p className="text-[#4a4a6a] text-sm">Gunakan akun Google kamu untuk masuk</p>
            </div>

            {/* Google Login */}
            <div className="flex flex-col gap-4">
              <GoogleLogin
                onSuccess={async (credential) => {
                  const response = await googleLoginHandler(credential)
                  response.status == 200 && redirect('/')
                }}
                theme="filled_black"
                shape="pill"
                width="100%"
                text="signin_with"
              />
              <p className="text-center text-[#3a3a5a] text-xs">
                Dengan masuk, kamu menyetujui syarat & ketentuan penggunaan StudyAI
              </p>
            </div>
          </div>

          {/* Footer */}
          <p className="text-center text-[#3a3a5a] text-xs mt-6">
            © 2026 StudyAI. All rights reserved.
          </p>
        </div>
      </div>

    </div>
  )
}