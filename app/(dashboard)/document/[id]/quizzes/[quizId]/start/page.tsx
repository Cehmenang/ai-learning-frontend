"use client"

import { useState, useEffect, useRef } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
  Timer,
  AlertCircle,
} from "lucide-react";
import { createAttempt, getQuizByDocument } from "@/action/quiz";
import Link from "next/link";
import { O } from "ollama/dist/shared/ollama.1bfa89da.js";

// ---- Types sesuai Prisma schema ----
type Option = {
  id: string;
  text: string;
  isCorrect: boolean;
  questionId: string;
};

type Question = {
  id: string;
  text: string;
  answer: string;       // ID of correct option
  explanation: string;
  difficulty: string;
  options: Option[];
};

type Quiz = {
  id: string;
  title: string;
  description: string;
  documentId: string;
  questions: Question[];
};

// ---- Inner Component ----
function QuizContent({ id, quizId }: { id: string; quizId: string }) {
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // answers: { [questionId]: optionId }
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const QUIZ_DURATION = 30 * 60; // default 30 menit (sesuaikan jika ada field duration)
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [userScore, setScore ] = useState<number | null>(null)
  const [ attemptId, setAttemptId ] = useState<string | null>(null)

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch quiz
  useEffect(() => {
    (async () => {
      try {
        const result = await getQuizByDocument(id, quizId);
        if (result?.quiz) {
          setQuiz(result.quiz);
          setQuestions(result.quiz.questions ?? []);
          setTimeLeft(QUIZ_DURATION);
        }
      } finally {
        setIsLoading(false);
      }
    })();
  }, [id, quizId]);

  // Timer
  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0 || showResult) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(timerRef.current!);
          setShowResult(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timeLeft !== null && !showResult]);

  const currentQuestion = questions[currentQuestionIndex] ?? null;
  const progress = questions.length > 0
    ? ((currentQuestionIndex + 1) / questions.length) * 100
    : 0;

  const handleSelectAnswer = (optionId: string) => {
    if (!currentQuestion) return;
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: optionId }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1)
      setCurrentQuestionIndex((prev) => prev + 1);
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0)
      setCurrentQuestionIndex((prev) => prev - 1);
  };

  const handleSubmit = async() => {
    if (timerRef.current) clearInterval(timerRef.current);

    const correctAnswers = calculateScore()

    const score = questions.length > 0
    ? Math.round((correctAnswers / questions.length) * 100)
    : 0;

    const questionsId = Object.keys(answers);
    const optionsId = Object.values(answers);

    const result = await createAttempt(questionsId, optionsId, score, quizId);
    result && setAttemptId(result.id)
    setShowResult(true);
  };

  // Hitung score berdasarkan option.isCorrect
  const calculateScore = () => {
    return questions.filter((q) => {
      const selectedOptionId = answers[q.id];
      if (!selectedOptionId) return false;
      const selectedOption = q.options.find((o) => o.id === selectedOptionId);
      return selectedOption?.isCorrect === true;
    }).length;
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const allAnswered = Object.keys(answers).length === questions.length;

  // ---- Loading ----
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-[#818cf8] animate-pulse">Memuat quiz...</p>
      </div>
    );
  }

  // ---- Not Found ----
  if (!quiz) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-white text-xl mb-2">Quiz tidak ditemukan</h2>
          <Link
            href={`/documents/${id}/quizzes`}
            className="text-[#818cf8] hover:underline text-sm"
          >
            Kembali ke Quizzes
          </Link>
        </div>
      </div>
    );
  }

  // ---- Result Screen ----
  if (showResult) {
    const correctAnswers = calculateScore();
    const score = questions.length > 0
      ? Math.round((correctAnswers / questions.length) * 100)
      : 0 as number
    const timeUsed = QUIZ_DURATION - (timeLeft ?? 0);

    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-2xl">
          <div className="p-8 rounded-2xl bg-[#0e0e18] border border-[#1e1e2e] text-center">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] flex items-center justify-center mx-auto mb-6 shadow-lg shadow-indigo-500/30">
              <CheckCircle2 className="w-10 h-10 text-white" />
            </div>

            <h2 className="text-white mb-2" style={{ fontSize: "28px", fontWeight: 700 }}>
              Quiz Selesai!
            </h2>
            <p className="text-[#4a4a6a] mb-8" style={{ fontSize: "14px" }}>
              {quiz.title}
            </p>

            <div className="mb-8">
              <div
                className="text-[#818cf8] mb-2"
                style={{ fontSize: "64px", fontWeight: 700, lineHeight: "1" }}
              >
                {score}%
              </div>
              <p className="text-[#4a4a6a]" style={{ fontSize: "16px" }}>
                {correctAnswers} dari {questions.length} jawaban benar
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="p-4 rounded-xl bg-[#13131f] border border-[#1e1e2e]">
                <p className="text-[#4a4a6a] mb-1" style={{ fontSize: "12px" }}>Benar</p>
                <p className="text-green-400" style={{ fontSize: "24px", fontWeight: 600 }}>
                  {correctAnswers}
                </p>
              </div>
              <div className="p-4 rounded-xl bg-[#13131f] border border-[#1e1e2e]">
                <p className="text-[#4a4a6a] mb-1" style={{ fontSize: "12px" }}>Salah</p>
                <p className="text-red-400" style={{ fontSize: "24px", fontWeight: 600 }}>
                  {questions.length - correctAnswers}
                </p>
              </div>
              <div className="p-4 rounded-xl bg-[#13131f] border border-[#1e1e2e]">
                <p className="text-[#4a4a6a] mb-1" style={{ fontSize: "12px" }}>Waktu</p>
                <p className="text-[#818cf8]" style={{ fontSize: "24px", fontWeight: 600 }}>
                  {formatTime(timeUsed)}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              {attemptId && <Link
                href={`/document/${id}/quizzes/${quizId}/review/${attemptId}`}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#6366f1] hover:bg-[#5558e8] text-white transition-all duration-200"
              >
                <span style={{ fontSize: "14px", fontWeight: 500 }}>Review Jawaban</span>
                <ChevronRight className="w-4 h-4" />
              </Link>}
              <Link
                href={`/document/${id}/quizzes`}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#13131f] hover:bg-[#1a1a2a] border border-[#1e1e2e] hover:border-[#6366f1]/30 text-[#818cf8] transition-all duration-200"
              >
                <span style={{ fontSize: "14px", fontWeight: 500 }}>Kembali ke Quiz</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ---- Quiz Screen ----
  if (!currentQuestion) return null;

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => setShowExitConfirm(true)}
            className="flex items-center gap-2 text-[#4a4a6a] hover:text-[#818cf8] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span style={{ fontSize: "14px" }}>Keluar</span>
          </button>

          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0e0e18] border border-[#1e1e2e]">
            <Timer
              className={`w-4 h-4 ${(timeLeft ?? 0) < 60 ? "text-red-400" : "text-[#818cf8]"}`}
            />
            <span
              className={(timeLeft ?? 0) < 60 ? "text-red-400" : "text-white"}
              style={{ fontSize: "14px", fontWeight: 500 }}
            >
              {formatTime(timeLeft ?? 0)}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[#4a4a6a]" style={{ fontSize: "13px" }}>
              Pertanyaan {currentQuestionIndex + 1} dari {questions.length}
            </span>
            <span className="text-[#818cf8]" style={{ fontSize: "13px", fontWeight: 500 }}>
              {Math.round(progress)}%
            </span>
          </div>
          <div className="h-2 bg-[#1e1e2e] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="mb-6 p-6 sm:p-8 rounded-2xl bg-[#0e0e18] border border-[#1e1e2e]">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-10 h-10 rounded-xl bg-[#6366f1]/10 flex items-center justify-center flex-shrink-0">
              <span className="text-[#818cf8]" style={{ fontSize: "16px", fontWeight: 600 }}>
                {currentQuestionIndex + 1}
              </span>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    currentQuestion.difficulty === "MUDAH"
                      ? "bg-green-500/10 text-green-400"
                      : currentQuestion.difficulty === "MENENGAH"
                      ? "bg-yellow-500/10 text-yellow-400"
                      : "bg-red-500/10 text-red-400"
                  }`}
                >
                  {currentQuestion.difficulty}
                </span>
              </div>
              <h3
                className="text-white"
                style={{ fontSize: "18px", fontWeight: 500, lineHeight: "1.6" }}
              >
                {currentQuestion.text}
              </h3>
            </div>
          </div>

          {/* Options — pakai option.id sebagai value */}
          <div className="space-y-3">
            {currentQuestion.options.map((option) => {
              const isSelected = answers[currentQuestion.id] === option.id;
              return (
                <button
                  key={option.id}
                  onClick={() => handleSelectAnswer(option.id)}
                  className={`w-full p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                    isSelected
                      ? "bg-[#6366f1]/10 border-[#6366f1] shadow-lg shadow-indigo-500/10"
                      : "bg-[#13131f] border-[#1e1e2e] hover:border-[#6366f1]/30 hover:bg-[#1a1a2a]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
                        isSelected
                          ? "bg-[#6366f1] border-[#6366f1]"
                          : "border-[#3a3a5a]"
                      }`}
                    >
                      {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                    <span
                      className={isSelected ? "text-white" : "text-[#8a8aaa]"}
                      style={{ fontSize: "14px", lineHeight: "1.6" }}
                    >
                      {option.text}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between gap-4">
          <button
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className="px-6 py-3 rounded-xl bg-[#13131f] border border-[#1e1e2e] hover:border-[#6366f1]/30 text-[#818cf8] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ fontSize: "14px", fontWeight: 500 }}
          >
            Sebelumnya
          </button>

          {/* Question number dots */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            {questions.map((q, index) => (
              <button
                key={q.id}
                onClick={() => setCurrentQuestionIndex(index)}
                className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
                  index === currentQuestionIndex
                    ? "bg-[#6366f1] text-white"
                    : answers[q.id] !== undefined
                    ? "bg-[#6366f1]/20 text-[#818cf8] border border-[#6366f1]/30"
                    : "bg-[#13131f] text-[#4a4a6a] border border-[#1e1e2e]"
                }`}
                style={{ fontSize: "12px", fontWeight: 500 }}
              >
                {index + 1}
              </button>
            ))}
          </div>

          {currentQuestionIndex === questions.length - 1 ? (
            <button
              onClick={handleSubmit}
              disabled={!allAnswered}
              className="px-6 py-3 rounded-xl bg-[#6366f1] hover:bg-[#5558e8] text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/20"
              style={{ fontSize: "14px", fontWeight: 500 }}
            >
              Selesai
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="px-6 py-3 rounded-xl bg-[#6366f1] hover:bg-[#5558e8] text-white transition-all duration-200 shadow-lg shadow-indigo-500/20"
              style={{ fontSize: "14px", fontWeight: 500 }}
            >
              Selanjutnya
            </button>
          )}
        </div>

        {/* Incomplete Warning */}
        {currentQuestionIndex === questions.length - 1 && !allAnswered && (
          <div className="mt-4 p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/30 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-yellow-400 mb-1" style={{ fontSize: "13px", fontWeight: 500 }}>
                Ada pertanyaan yang belum dijawab
              </p>
              <p className="text-yellow-400/70" style={{ fontSize: "12px" }}>
                {questions.length - Object.keys(answers).length} pertanyaan belum dijawab
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Exit Confirmation Dialog */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md p-6 rounded-2xl bg-[#0e0e18] border border-[#1e1e2e]">
            <h3 className="text-white mb-2" style={{ fontSize: "20px", fontWeight: 600 }}>
              Keluar dari Quiz?
            </h3>
            <p className="text-[#4a4a6a] mb-6" style={{ fontSize: "14px" }}>
              Progres quiz kamu akan hilang jika keluar sekarang
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowExitConfirm(false)}
                className="flex-1 px-4 py-2.5 rounded-xl bg-[#13131f] hover:bg-[#1a1a2a] border border-[#1e1e2e] hover:border-[#6366f1]/30 text-[#818cf8] transition-all duration-200"
                style={{ fontSize: "14px", fontWeight: 500 }}
              >
                Batal
              </button>
              <Link
                href={`/documents/${id}/quizzes`}
                className="flex-1 px-4 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 transition-all duration-200 text-center"
                style={{ fontSize: "14px", fontWeight: 500 }}
              >
                Ya, Keluar
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ---- Outer Component (handle async params Next.js 15) ----
export default function StartQuiz({
  params,
}: {
  params: Promise<{ id: string; quizId: string }>;
}) {
  const [resolvedParams, setResolvedParams] = useState<{
    id: string;
    quizId: string;
  } | null>(null);

  useEffect(() => {
    params.then(setResolvedParams);
  }, []);

  if (!resolvedParams) return null;

  return <QuizContent id={resolvedParams.id} quizId={resolvedParams.quizId} />;
}