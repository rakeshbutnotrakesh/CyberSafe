import React, { useState, useEffect } from 'react';
import {
  HelpCircle,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Award,
  ChevronRight,
  ChevronLeft,
  Clock,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  ShieldAlert,
} from 'lucide-react';
import { QUIZ_QUESTIONS } from '../services/quizData';
import { QuizQuestion, QuizResult } from '../types/security';

interface SecurityQuizProps {
  onQuizCompleted: (result: QuizResult) => void;
  bestScore: number;
}

export const SecurityQuiz: React.FC<SecurityQuizProps> = ({
  onQuizCompleted,
  bestScore,
}) => {
  const [examMode, setExamMode] = useState<'sprint' | 'full'>('full');
  const [activeQuestions, setActiveQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);

  // Initialize questions
  const startQuiz = (mode: 'sprint' | 'full') => {
    setExamMode(mode);
    const count = mode === 'sprint' ? 10 : 30;
    // Shuffle questions safely
    const copy = [...QUIZ_QUESTIONS];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    setActiveQuestions(copy.slice(0, count));
    setCurrentIndex(0);
    setUserAnswers({});
    setIsFinished(false);
    setStartTime(Date.now());
    setElapsedSeconds(0);
  };

  useEffect(() => {
    startQuiz('full');
  }, []);

  // Timer
  useEffect(() => {
    if (isFinished) return;
    const interval = setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [startTime, isFinished]);

  const currentQuestion = activeQuestions[currentIndex];

  const handleSelectAnswer = (optionIndex: number) => {
    setUserAnswers((prev) => ({
      ...prev,
      [currentIndex]: optionIndex,
    }));
  };

  const handleNext = () => {
    if (currentIndex < activeQuestions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      finishQuiz();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const finishQuiz = () => {
    setIsFinished(true);
    let correct = 0;
    activeQuestions.forEach((q, idx) => {
      if (userAnswers[idx] === q.correctIndex) {
        correct++;
      }
    });

    const percentage = Math.round((correct / activeQuestions.length) * 100);
    const result: QuizResult = {
      totalQuestions: activeQuestions.length,
      correctAnswers: correct,
      scorePercentage: percentage,
      timestamp: new Date().toISOString(),
      timeSpentSeconds: elapsedSeconds,
    };

    onQuizCompleted(result);
  };

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins}:${remainder.toString().padStart(2, '0')}`;
  };

  if (!currentQuestion && !isFinished) {
    return null;
  }

  // Final Results Screen
  if (isFinished) {
    let correctCount = 0;
    activeQuestions.forEach((q, idx) => {
      if (userAnswers[idx] === q.correctIndex) {
        correctCount++;
      }
    });
    const finalScore = Math.round((correctCount / activeQuestions.length) * 100);

    let grade = { title: 'Security Apprentice', color: 'text-amber-400', desc: 'Good baseline, but several fundamental risks need attention.' };
    if (finalScore >= 90) {
      grade = { title: 'Cyber Defense Master', color: 'text-emerald-400', desc: 'Outstanding understanding of modern cyber threats and defense architecture!' };
    } else if (finalScore >= 75) {
      grade = { title: 'Proficient Guardian', color: 'text-cyan-400', desc: 'Solid defensive instincts with strong threat awareness.' };
    } else if (finalScore < 50) {
      grade = { title: 'High Threat Exposure', color: 'text-rose-400', desc: 'Significant security misconceptions identified. Review the learning center topics.' };
    }

    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-8 text-center space-y-6 shadow-xl">
          <div className="mx-auto w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Award className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <span className="text-xs font-mono uppercase tracking-widest text-slate-400">
              Assessment Completed
            </span>
            <h3 className={`text-2xl md:text-3xl font-extrabold ${grade.color}`}>
              {grade.title}
            </h3>
            <p className="text-xs text-slate-300 max-w-md mx-auto">{grade.desc}</p>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-3 max-w-md mx-auto text-xs font-mono">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-slate-400 text-[11px]">Final Score</div>
              <div className="text-xl font-bold text-white tabular-nums mt-0.5">{finalScore}%</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-slate-400 text-[11px]">Correct</div>
              <div className="text-xl font-bold text-emerald-400 tabular-nums mt-0.5">
                {correctCount}/{activeQuestions.length}
              </div>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-slate-400 text-[11px]">Time Spent</div>
              <div className="text-xl font-bold text-cyan-400 tabular-nums mt-0.5">
                {formatTimer(elapsedSeconds)}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => startQuiz(examMode)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors shadow-sm cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retry Quiz</span>
            </button>
            <button
              type="button"
              onClick={() => startQuiz(examMode === 'full' ? 'sprint' : 'full')}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition-colors"
            >
              Switch to {examMode === 'full' ? '10-Question Sprint' : 'Full 30-Question Exam'}
            </button>
          </div>
        </div>

        {/* Detailed Question Review */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold uppercase font-mono tracking-wider text-slate-300">
            Comprehensive Answer Review & Threat Breakdown
          </h4>

          <div className="space-y-4">
            {activeQuestions.map((q, idx) => {
              const userAns = userAnswers[idx];
              const isCorrect = userAns === q.correctIndex;

              return (
                <div
                  key={q.id}
                  className={`p-5 rounded-xl border text-xs space-y-3 ${
                    isCorrect
                      ? 'border-emerald-900/60 bg-emerald-950/10'
                      : 'border-rose-900/60 bg-rose-950/10'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      {isCorrect ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      ) : (
                        <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                      )}
                      <span className="font-semibold text-slate-100">
                        {idx + 1}. {q.question}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 shrink-0">
                      {q.category}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono pl-6">
                    <div className="p-2 rounded bg-slate-950/60 border border-slate-800">
                      <span className="text-slate-400">Your Answer: </span>
                      <span className={isCorrect ? 'text-emerald-300' : 'text-rose-300'}>
                        {userAns !== undefined ? q.options[userAns] : 'Skipped'}
                      </span>
                    </div>

                    {!isCorrect && (
                      <div className="p-2 rounded bg-slate-950/60 border border-emerald-900/40">
                        <span className="text-slate-400">Correct Answer: </span>
                        <span className="text-emerald-400 font-semibold">{q.options[q.correctIndex]}</span>
                      </div>
                    )}
                  </div>

                  <div className="pl-6 pt-1 text-slate-300 leading-relaxed text-xs">
                    <strong className="text-cyan-400 font-mono">Explanation: </strong>
                    {q.explanation}
                  </div>

                  <div className="pl-6 text-[11px] text-slate-400">
                    <strong className="text-emerald-400 font-mono">Pro Tip: </strong>
                    {q.tip}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  const answeredCount = Object.keys(userAnswers).length;
  const isAnswered = userAnswers[currentIndex] !== undefined;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-purple-400" />
            <span>Cybersecurity Knowledge Quiz</span>
          </h2>
          <p className="text-xs text-slate-400">
            30 verified questions covering social engineering, malware, cryptography, and network defense.
          </p>
        </div>

        {/* Mode Selector */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
            <button
              type="button"
              onClick={() => startQuiz('full')}
              className={`px-2.5 py-1 rounded font-mono ${
                examMode === 'full' ? 'bg-purple-900/50 text-purple-300 font-bold' : 'text-slate-400'
              }`}
            >
              Full (30Q)
            </button>
            <button
              type="button"
              onClick={() => startQuiz('sprint')}
              className={`px-2.5 py-1 rounded font-mono ${
                examMode === 'sprint' ? 'bg-purple-900/50 text-purple-300 font-bold' : 'text-slate-400'
              }`}
            >
              Sprint (10Q)
            </button>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 font-mono text-xs text-cyan-400">
            <Clock className="w-3.5 h-3.5" />
            <span>{formatTimer(elapsedSeconds)}</span>
          </div>
        </div>
      </div>

      {/* Progress Bar & Header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-mono text-slate-400">
          <span>
            Question <strong className="text-white">{currentIndex + 1}</strong> of{' '}
            <strong className="text-white">{activeQuestions.length}</strong>
          </span>
          <span>{answeredCount} Answered</span>
        </div>
        <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
          <div
            className="bg-purple-500 h-full rounded-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / activeQuestions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 md:p-8 space-y-6">
        <div className="space-y-2">
          <div className="inline-block px-2.5 py-0.5 rounded text-[11px] font-mono uppercase bg-slate-800 text-purple-300 border border-slate-700">
            Category: {currentQuestion.category}
          </div>
          <h3 className="text-base md:text-lg font-semibold text-white leading-relaxed">
            {currentQuestion.question}
          </h3>
        </div>

        {/* 4 Answer Options */}
        <div className="space-y-2.5">
          {currentQuestion.options.map((option, optIdx) => {
            const isSelected = userAnswers[currentIndex] === optIdx;
            return (
              <button
                key={optIdx}
                type="button"
                onClick={() => handleSelectAnswer(optIdx)}
                className={`w-full text-left p-4 rounded-xl border text-xs md:text-sm transition-all duration-150 flex items-center justify-between ${
                  isSelected
                    ? 'border-purple-500 bg-purple-950/40 text-white font-medium shadow-md shadow-purple-500/10'
                    : 'border-slate-800 bg-slate-950/60 text-slate-300 hover:bg-slate-900 hover:text-white hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center font-mono text-xs border ${
                      isSelected
                        ? 'border-purple-400 bg-purple-500 text-white font-bold'
                        : 'border-slate-700 bg-slate-900 text-slate-400'
                    }`}
                  >
                    {String.fromCharCode(65 + optIdx)}
                  </span>
                  <span>{option}</span>
                </div>

                {isSelected && <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />}
              </button>
            );
          })}
        </div>

        {/* Bottom Navigation */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800/80">
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-xs font-semibold text-slate-200 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <button
            type="button"
            onClick={handleNext}
            disabled={!isAnswered}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white font-semibold text-xs transition-colors shadow-sm cursor-pointer"
          >
            <span>{currentIndex === activeQuestions.length - 1 ? 'Finish & View Score' : 'Next Question'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
