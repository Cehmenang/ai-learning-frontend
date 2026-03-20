"use client"

import {
  Brain,
  ArrowLeft,
  BookOpen,
  Award,
  Trophy,
  Target,
  Zap,
  Play,
  History,
} from "lucide-react";
import { useEffect, useState } from "react";
import { getQuizzesByDocument } from "@/action/quiz";
import Link from "next/link";

export default function Quizzes({ params }: { params: { id: string } }) {
  const [ quizzes, setQuizzes ] = useState<any[]>([])
  const [ documentId, setDocumentId ] = useState<string | null>(null)

  useEffect(()=>{
    (async function(){
        const { id } = await params
        setDocumentId(id)
        
        const response = await getQuizzesByDocument(id) as any[] | null
        response && setQuizzes(response)
    })()
  },[])

  if (!documentId) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-white text-xl mb-2">Dokumen tidak ditemukan</h2>
          <Link
            href="/document"
            className="text-[#818cf8] hover:underline text-sm"
          >
            Kembali ke Dokumen
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      <div>
        <Link
          href="/document"
          className="inline-flex items-center gap-2 text-[#4a4a6a] hover:text-[#818cf8] transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          <span style={{ fontSize: "14px" }}>Kembali ke Dokumen</span>
        </Link>

        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] flex items-center justify-center flex-shrink-0 shadow-lg shadow-indigo-500/20">
            <Brain className="w-7 h-7 text-white" />
          </div>
          <div className="flex-1">
            <h1 className="text-white mb-1" style={{ fontSize: "24px", fontWeight: 700 }}>
              Quiz dari {document.title}
            </h1>
            <p className="text-[#4a4a6a]" style={{ fontSize: "14px" }}>
              {quizzes.length} quiz tersedia untuk dokumen ini
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-[#0e0e18] border border-[#1e1e2e]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#6366f1]/10 flex items-center justify-center">
              <Target className="w-5 h-5 text-[#818cf8]" />
            </div>
            <div>
              <p className="text-[#4a4a6a]" style={{ fontSize: "12px" }}>
                Total Quiz
              </p>
              <p className="text-white" style={{ fontSize: "20px", fontWeight: 600 }}>
                {quizzes.length}
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#0e0e18] border border-[#1e1e2e]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
              <Trophy className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-[#4a4a6a]" style={{ fontSize: "12px" }}>
                Quiz Selesai
              </p>
              <p className="text-white" style={{ fontSize: "20px", fontWeight: 600 }}>
                {quizzes.filter((q) => q.attempts.length > 0).length}
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#0e0e18] border border-[#1e1e2e]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center">
              <Zap className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <p className="text-[#4a4a6a]" style={{ fontSize: "12px" }}>
                Avg. Score
              </p>
              <p className="text-white" style={{ fontSize: "20px", fontWeight: 600 }}>
                {Math.round(quizzes.filter(q=>q.attempts.length > 0).map(q=>{
                  const scoring = q.attempts.map((attempt: any)=>attempt.score)
                  const resultPerAttempt = scoring.reduce((total: number, curr: number)=>total + curr, 0)
                  return resultPerAttempt
                }).reduce((total, curr)=>total + curr, 0)/quizzes.filter((q=>q.attempts.length > 0)).map(q=>
                  q.attempts.length
                ).reduce((total, curr)=>total + curr, 0))}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quizzes List */}
      <div className="space-y-4">
        <h2 className="text-white" style={{ fontSize: "18px", fontWeight: 600 }}>
          Semua Quiz
        </h2>

        {quizzes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center rounded-xl bg-[#0e0e18] border border-[#1e1e2e]">
            <div className="w-16 h-16 rounded-2xl bg-[#13131f] border border-[#1e1e2e] flex items-center justify-center mb-4">
              <Brain className="w-8 h-8 text-[#3a3a5a]" />
            </div>
            <h3 className="text-white mb-2" style={{ fontSize: "16px", fontWeight: 600 }}>
              Belum ada quiz
            </h3>
            <p className="text-[#4a4a6a]" style={{ fontSize: "14px" }}>
              Quiz untuk dokumen ini akan muncul di sini
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {quizzes.map((quiz) => {
              return (
                <div
                  key={quiz.id}
                  className="group p-4 sm:p-5 rounded-xl bg-[#0e0e18] border border-[#1e1e2e] hover:border-[#6366f1]/30 transition-all duration-200"
                >
                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* Left Side */}
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <h3 className="text-white mb-1.5 group-hover:text-[#818cf8] transition-colors" style={{ fontSize: "16px", fontWeight: 600 }}>
                            {quiz.title}
                          </h3>
                          <p className="text-[#4a4a6a] line-clamp-2" style={{ fontSize: "13px", lineHeight: "1.6" }}>
                            {quiz.description}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-4">
                        <div className="flex items-center gap-1.5 text-[#4a4a6a]">
                          <BookOpen className="w-3.5 h-3.5" />
                          <span style={{ fontSize: "12px" }}>
                            {quiz.questions.length} pertanyaan
                          </span>
                        </div>
                        {/* <div className="flex items-center gap-1.5 text-[#4a4a6a]">
                          <Clock className="w-3.5 h-3.5" />
                          <span style={{ fontSize: "12px" }}>
                            {quiz.duration} menit
                          </span>
                        </div> */}
                        <div className="flex items-center gap-1.5 text-[#4a4a6a]">
                          <History className="w-3.5 h-3.5" />
                          <span style={{ fontSize: "12px" }}>
                            { quiz.attempts && quiz.attempts.length > 0 ? quiz.attempts.length : 0 } percobaan
                          </span>
                        </div>
                        {quiz.attempts.length > 0 && (
                          <div className="flex items-center gap-1.5 text-green-400">
                            <Trophy className="w-3.5 h-3.5" />
                            <span style={{ fontSize: "12px", fontWeight: 500 }}>
                              Best: {Math.round((quiz.attempts.reduce((total: number, current: { score: number })=>total + current.score, 0) / quiz.attempts.length))}%
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex sm:flex-col gap-2 sm:justify-center">
                      <a
                        href={`/document/${documentId}/quizzes/${quiz.id}/start`}
                        className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#6366f1] hover:bg-[#5558e8] text-white transition-all duration-200 shadow-lg shadow-indigo-500/20"
                      >
                        <Play className="w-4 h-4" />
                      </a>
                      {quiz.attempts.length > 0 && (
                        <Link
                          href={`/document/${documentId}/quizzes/${quiz.id}/attempts`}
                          className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#13131f] hover:bg-[#1a1a2a] border border-[#1e1e2e] hover:border-[#6366f1]/30 text-[#818cf8] transition-all duration-200"
                        >
                          <Award className="w-4 h-4" />
                          <span style={{ fontSize: "13px", fontWeight: 500 }}>
                            Lihat Hasil
                          </span>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
