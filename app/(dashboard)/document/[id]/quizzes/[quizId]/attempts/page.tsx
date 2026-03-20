"use client"

import { getAttemptsByQuiz } from "@/action/attempt";
import {
  ArrowLeft,
  Trophy,
  Clock,
  CheckCircle2,
  XCircle,
  Calendar,
  TrendingUp,
  Award,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function QuizAttemptsPage() {
    const [ attempts, setAttempts ] = useState<any[] | null>(null)
    const [ bestScore, setBestScore ] = useState<number | null>(null)
    const [ averageScore, setAverageScore ] = useState<number | null>(null)
    const [ topScore, setTopScore ] = useState<any | null>(null)
  const { id, quizId } = useParams<{
    id: string;
    quizId: string;
  }>();

    useEffect(()=>{
        (async function(){
            const response = await getAttemptsByQuiz(quizId)
            return setAttempts(response!)
        })()
    }, [])

    useEffect(()=>{
        if(attempts && attempts.length > 0){
            const best = Math.max(...attempts.map((a) => a.score))
            setBestScore(best)

            const average = Math.round(attempts.reduce((acc, a) => acc + a.score, 0)/attempts.length)
            setAverageScore(average)

            const top = attempts.find(att=>att.score == best)
            setTopScore(top)
        }else { 
            setBestScore(0)
            setAverageScore(0)
        }
    }, [attempts])

  if (!attempts || attempts.length == 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-white text-xl mb-2">Quiz tidak ditemukan</h2>
          <Link
            href={`/document/${id}/quizzes`}
            className="text-[#818cf8] hover:underline text-sm"
          >
            Kembali ke Quizzes
          </Link>
        </div>
      </div>
    );
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <Link
          href={`/document/${id}/quizzes`}
          className="inline-flex items-center gap-2 text-[#4a4a6a] hover:text-[#818cf8] transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          <span style={{ fontSize: "14px" }}>Kembali ke Quizzes</span>
        </Link>

        <h1 className="text-white mb-2" style={{ fontSize: "24px", fontWeight: 700 }}>
          Riwayat Percobaan
        </h1>
        <p className="text-[#4a4a6a]" style={{ fontSize: "14px" }}>
          {attempts[0].quiz.title}
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-xl bg-[#0e0e18] border border-[#1e1e2e]">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-[#6366f1]/10 flex items-center justify-center">
              <Trophy className="w-5 h-5 text-[#818cf8]" />
            </div>
            <div>
              <p className="text-[#4a4a6a]" style={{ fontSize: "12px" }}>
                Best Score
              </p>
              <p className="text-white" style={{ fontSize: "24px", fontWeight: 600 }}>
                {bestScore && bestScore}%
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-green-400">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span style={{ fontSize: "12px" }}>
              {topScore && topScore.userAnswers.filter((answer: any)=>answer.selectedOption.isCorrect == true).length} benar
            </span>
          </div>
        </div>

        <div className="p-5 rounded-xl bg-[#0e0e18] border border-[#1e1e2e]">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <p className="text-[#4a4a6a]" style={{ fontSize: "12px" }}>
                Average Score
              </p>
              <p className="text-white" style={{ fontSize: "24px", fontWeight: 600 }}>
                {averageScore && averageScore}%
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-[#4a4a6a]">
            <Award className="w-3.5 h-3.5" />
            <span style={{ fontSize: "12px" }}>
              dari {attempts.length} percobaan
            </span>
          </div>
        </div>

        <div className="p-5 rounded-xl bg-[#0e0e18] border border-[#1e1e2e]">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-[#4a4a6a]" style={{ fontSize: "12px" }}>
                Total Attempts
              </p>
              <p className="text-white" style={{ fontSize: "24px", fontWeight: 600 }}>
                {attempts.length}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-[#4a4a6a]">
            <Calendar className="w-3.5 h-3.5" />
            <span style={{ fontSize: "12px" }}>
              {attempts.length > 0 ? formatDate(attempts[0].createdAt) : "-"}
            </span>
          </div>
        </div>
      </div>

      {/* Attempts List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-white" style={{ fontSize: "18px", fontWeight: 600 }}>
            Semua Percobaan
          </h2>
          <Link
            href={`/document/${id}/quizzes/${quizId}/start`}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#6366f1] hover:bg-[#5558e8] text-white transition-all duration-200 shadow-lg shadow-indigo-500/20"
          >
            <span style={{ fontSize: "13px", fontWeight: 500 }}>
              Coba Lagi
            </span>
          </Link>
        </div>

        {attempts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center rounded-xl bg-[#0e0e18] border border-[#1e1e2e]">
            <div className="w-16 h-16 rounded-2xl bg-[#13131f] border border-[#1e1e2e] flex items-center justify-center mb-4">
              <Award className="w-8 h-8 text-[#3a3a5a]" />
            </div>
            <h3 className="text-white mb-2" style={{ fontSize: "16px", fontWeight: 600 }}>
              Belum ada percobaan
            </h3>
            <p className="text-[#4a4a6a] mb-6" style={{ fontSize: "14px" }}>
              Mulai quiz untuk melihat riwayat percobaan
            </p>
            <Link
              href={`/document/${id}/quizzes/${quizId}/start`}
              className="px-6 py-2.5 rounded-xl bg-[#6366f1] hover:bg-[#5558e8] text-white transition-all duration-200 shadow-lg shadow-indigo-500/20"
              style={{ fontSize: "14px", fontWeight: 500 }}
            >
              Mulai Quiz
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {attempts.map((attempt, index) => {
              const percentage = Math.round(
                (attempt.correctAnswers / attempt.totalQuestions) * 100
              );
              const isPerfect = attempt.score === 100;
              const isBest = attempt.score === 100;

              return (
                <div
                  key={attempt.id}
                  className={`p-5 rounded-xl border transition-all duration-200 ${
                    isBest
                      ? "bg-[#6366f1]/5 border-[#6366f1]/30"
                      : "bg-[#0e0e18] border-[#1e1e2e] hover:border-[#6366f1]/20"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* Left Side */}
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-[#13131f] border border-[#1e1e2e] flex items-center justify-center">
                            <span className="text-[#818cf8]" style={{ fontSize: "16px", fontWeight: 600 }}>
                              #{attempts.length - index}
                            </span>
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <p className="text-white" style={{ fontSize: "16px", fontWeight: 600 }}>
                                {attempt.score}%
                              </p>
                              {isBest && (
                                <div className="px-2 py-0.5 rounded-md bg-yellow-500/10 border border-yellow-500/30">
                                  <span className="text-yellow-400" style={{ fontSize: "10px", fontWeight: 600 }}>
                                    BEST
                                  </span>
                                </div>
                              )}
                              {isPerfect && (
                                <div className="px-2 py-0.5 rounded-md bg-green-500/10 border border-green-500/30">
                                  <span className="text-green-400" style={{ fontSize: "10px", fontWeight: 600 }}>
                                    PERFECT
                                  </span>
                                </div>
                              )}
                            </div>
                            <p className="text-[#4a4a6a]" style={{ fontSize: "12px" }}>
                              {formatDate(attempt.createdAt)}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-4">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-400" />
                          <span className="text-[#4a4a6a]" style={{ fontSize: "13px" }}>
                            {attempt.userAnswers.filter((answer: any)=>
                                answer.selectedOption.isCorrect == true
                            ).length} benar
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <XCircle className="w-4 h-4 text-red-400" />
                          <span className="text-[#4a4a6a]" style={{ fontSize: "13px" }}>
                            {attempt.userAnswers.filter((answer: any)=>
                                answer.selectedOption.isCorrect == false
                            ).length} salah
                          </span>
                        </div>
                        {/* <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-[#818cf8]" />
                          <span className="text-[#4a4a6a]" style={{ fontSize: "13px" }}>
                            {formatTime(attempt.createdAt)}
                          </span>
                        </div> */}
                      </div>

                      {/* Progress Bar */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[#4a4a6a]" style={{ fontSize: "11px" }}>
                            Akurasi
                          </span>
                          <span className="text-[#818cf8]" style={{ fontSize: "11px", fontWeight: 500 }}>
                            {attempt.score}%
                          </span>
                        </div>
                        <div className="h-2 bg-[#1e1e2e] rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all duration-300 ${
                              attempt.score >= 80
                                ? "bg-gradient-to-r from-green-500 to-emerald-500"
                                : attempt.score >= 60
                                ? "bg-gradient-to-r from-yellow-500 to-orange-500"
                                : "bg-gradient-to-r from-red-500 to-rose-500"
                            }`}
                            style={{ width: `${attempt.score}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Right Side - Actions */}
                    <div className="flex sm:flex-col gap-2 sm:justify-center">
                      <Link
                        href={`/document/${id}/quizzes/${quizId}/review/${attempt.id}`}
                        className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#13131f] hover:bg-[#1a1a2a] border border-[#1e1e2e] hover:border-[#6366f1]/30 text-[#818cf8] transition-all duration-200"
                      >
                        <span style={{ fontSize: "13px", fontWeight: 500 }}>
                          Review
                        </span>
                      </Link>
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