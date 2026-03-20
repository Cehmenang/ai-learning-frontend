"use client"

import { useEffect, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Info,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getAttemptById } from "@/action/attempt";

export default function ReviewAttempt() {
  const { attemptId, documentId, quizId } = useParams<{attemptId: string, documentId: string, quizId: string}>()
  const [attempt, setAttempt] = useState<any | null>(null)
  const [questions, setQuestions] = useState<any[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  useEffect(() => {
    (async function () {
      const result = await getAttemptById(attemptId)
      setQuestions(result.userAnswers.map((answer: any) => answer.question))
      setAttempt(result)
    })()
  }, [])

  if (!attempt) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-white text-xl mb-2">Loading...</h2>
        </div>
      </div>
    );
  }

  if (attempt.userAnswers.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-white text-xl mb-2">Data tidak ditemukan</h2>
          <Link
            href={`/document/${documentId}/quizzes`}
            className="text-[#818cf8] hover:underline text-sm"
          >
            Kembali ke Quizzes
          </Link>
        </div>
      </div>
    );
  }

  const currentQuestion = attempt.userAnswers[currentQuestionIndex].question
  const currentUserAnswer = attempt.userAnswers[currentQuestionIndex]
  const isCorrect = currentUserAnswer.selectedOption.isCorrect

  const handleNext = () => {
    if (currentQuestionIndex < attempt.userAnswers.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link
            href={`/document/${documentId}/quizzes/${quizId}/attempts`}
            className="inline-flex items-center gap-2 text-[#4a4a6a] hover:text-[#818cf8] transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span style={{ fontSize: "14px" }}>Kembali ke Riwayat</span>
          </Link>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-white mb-1" style={{ fontSize: "24px", fontWeight: 700 }}>
                Review Jawaban
              </h1>
            </div>

            <div className="p-3 rounded-xl bg-[#0e0e18] border border-[#1e1e2e]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-400" />
                {/* Score langsung dari attempt.score */}
                <span className="text-white" style={{ fontSize: "16px", fontWeight: 600 }}>
                  {attempt.score}/{attempt.userAnswers.length}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[#4a4a6a]" style={{ fontSize: "13px" }}>
              Pertanyaan {currentQuestionIndex + 1} dari {questions.length}
            </span>
          </div>
          <div className="flex gap-1.5 overflow-x-auto pb-2">
            {attempt.userAnswers.map((userAnswer: any, index: number) => {
              const correct = userAnswer.selectedOption.isCorrect
              return (
                <button
                  key={index}
                  onClick={() => setCurrentQuestionIndex(index)}
                  className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
                    index === currentQuestionIndex
                      ? correct
                        ? "bg-green-500 text-white"
                        : "bg-red-500 text-white"
                      : correct
                      ? "bg-green-500/20 text-green-400 border border-green-500/30"
                      : "bg-red-500/20 text-red-400 border border-red-500/30"
                  }`}
                  style={{ fontSize: "12px", fontWeight: 500 }}
                >
                  {index + 1}
                </button>
              );
            })}
          </div>
        </div>

        {/* Question Card */}
        <div className="mb-6 p-6 sm:p-8 rounded-2xl bg-[#0e0e18] border border-[#1e1e2e]">
          {/* Status Badge */}
          <div className="mb-6">
            <div
              className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl ${
                isCorrect
                  ? "bg-green-500/10 border border-green-500/30"
                  : "bg-red-500/10 border border-red-500/30"
              }`}
            >
              {isCorrect ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                  <span className="text-green-400" style={{ fontSize: "13px", fontWeight: 500 }}>
                    Jawaban Benar
                  </span>
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4 text-red-400" />
                  <span className="text-red-400" style={{ fontSize: "13px", fontWeight: 500 }}>
                    Jawaban Salah
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Question */}
          <div className="flex items-start gap-4 mb-6">
            <div className="w-10 h-10 rounded-xl bg-[#6366f1]/10 flex items-center justify-center flex-shrink-0">
              <span className="text-[#818cf8]" style={{ fontSize: "16px", fontWeight: 600 }}>
                {currentQuestionIndex + 1}
              </span>
            </div>
            <div className="flex-1">
              <h3 className="text-white" style={{ fontSize: "18px", fontWeight: 500, lineHeight: "1.6" }}>
                {/* Fix: field Question adalah 'text' bukan 'question' */}
                {currentQuestion.text}
              </h3>
            </div>
          </div>

          {/* Options */}
          <div className="space-y-3 mb-6">
            {currentQuestion.options.map((option: any, index: number) => {
              const isUserAnswer = currentUserAnswer.selectedOptionId === option.id
              const isCorrectAnswer = option.isCorrect === true

              let optionStyle = "bg-[#13131f] border-[#1e1e2e]";
              let iconColor = "text-[#3a3a5a]";
              let textColor = "text-[#8a8aaa]";

              if (isCorrectAnswer) {
                optionStyle = "bg-green-500/10 border-green-500/30";
                iconColor = "text-green-400";
                textColor = "text-white";
              } else if (isUserAnswer && !isCorrect) {
                optionStyle = "bg-red-500/10 border-red-500/30";
                iconColor = "text-red-400";
                textColor = "text-white";
              }

              return (
                <div
                  key={option.id}
                  className={`p-4 rounded-xl border-2 ${optionStyle}`}
                >
                  <div className="flex items-center gap-3">
                    {isCorrectAnswer ? (
                      <CheckCircle2 className={`w-5 h-5 ${iconColor} flex-shrink-0`} />
                    ) : isUserAnswer && !isCorrect ? (
                      <XCircle className={`w-5 h-5 ${iconColor} flex-shrink-0`} />
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-[#3a3a5a] flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <p className={textColor} style={{ fontSize: "14px", lineHeight: "1.6" }}>
                        {option.text}
                      </p>
                      {isCorrectAnswer && (
                        <p className="text-green-400 mt-1" style={{ fontSize: "12px" }}>
                          Jawaban yang benar
                        </p>
                      )}
                      {isUserAnswer && !isCorrect && (
                        <p className="text-red-400 mt-1" style={{ fontSize: "12px" }}>
                          Jawaban kamu
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Explanation */}
          <div className="p-4 rounded-xl bg-[#6366f1]/5 border border-[#6366f1]/20">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-[#818cf8] flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-[#818cf8] mb-1" style={{ fontSize: "13px", fontWeight: 500 }}>
                  Penjelasan
                </p>
                <p className="text-[#a0a0c0]" style={{ fontSize: "13px", lineHeight: "1.6" }}>
                  {currentQuestion.explanation}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between gap-4">
          <button
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#13131f] border border-[#1e1e2e] hover:border-[#6366f1]/30 text-[#818cf8] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ fontSize: "14px", fontWeight: 500 }}
          >
            <ChevronLeft className="w-4 h-4" />
            Sebelumnya
          </button>

          <div className="text-center">
            <p className="text-[#4a4a6a]" style={{ fontSize: "12px" }}>
              {currentQuestionIndex + 1} dari {questions.length}
            </p>
          </div>

          {currentQuestionIndex === questions.length - 1 ? (
            <Link
              href={`/document/${documentId}/quizzes/${quizId}/attempts`}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#6366f1] hover:bg-[#5558e8] text-white transition-all duration-200 shadow-lg shadow-indigo-500/20"
              style={{ fontSize: "14px", fontWeight: 500 }}
            >
              Selesai
            </Link>
          ) : (
            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#6366f1] hover:bg-[#5558e8] text-white transition-all duration-200 shadow-lg shadow-indigo-500/20"
              style={{ fontSize: "14px", fontWeight: 500 }}
            >
              Selanjutnya
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}