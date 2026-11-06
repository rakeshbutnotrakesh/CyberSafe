import React, { useState } from 'react';
import {
  GraduationCap,
  Shield,
  MailWarning,
  Key,
  UserX,
  Bug,
  Lock,
  Wifi,
  Globe,
  Fingerprint,
  EyeOff,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowLeft,
  ChevronRight,
} from 'lucide-react';
import { LEARNING_TOPICS } from '../services/learningData';
import { LearningTopic } from '../types/security';

interface LearningCenterProps {
  readTopics: string[];
  onMarkRead: (topicId: string) => void;
}

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Shield,
  MailWarning,
  Key,
  UserX,
  Bug,
  Lock,
  Wifi,
  Globe,
  Fingerprint,
  EyeOff,
};

export const LearningCenter: React.FC<LearningCenterProps> = ({
  readTopics,
  onMarkRead,
}) => {
  const [selectedTopicId, setSelectedTopicId] = useState<string>(LEARNING_TOPICS[0].id);

  // Mini quiz state per topic: { [questionIndex]: selectedOptionIndex }
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [showQuizResults, setShowQuizResults] = useState(false);

  const selectedTopic = LEARNING_TOPICS.find((t) => t.id === selectedTopicId) || LEARNING_TOPICS[0];
  const isRead = readTopics.includes(selectedTopic.id);

  const handleSelectTopic = (topic: LearningTopic) => {
    setSelectedTopicId(topic.id);
    setQuizAnswers({});
    setShowQuizResults(false);
    onMarkRead(topic.id);
  };

  const handleSelectOption = (questionIdx: number, optionIdx: number) => {
    setQuizAnswers((prev) => ({ ...prev, [questionIdx]: optionIdx }));
  };

  const calculateMiniQuizScore = () => {
    let score = 0;
    selectedTopic.miniQuiz.forEach((q, idx) => {
      if (quizAnswers[idx] === q.correctIndex) {
        score++;
      }
    });
    return score;
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-cyan-400" />
            <span>Cybersecurity Learning Center</span>
          </h2>
          <p className="text-xs text-slate-400">
            Core security disciplines explained with practical case studies, terminology, and interactive micro-quizzes.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-300 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
          <BookOpen className="w-4 h-4 text-cyan-400" />
          <span>Progress: {readTopics.length}/10 Topics Read</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Topic Selector List */}
        <div className="lg:col-span-4 space-y-2">
          <div className="text-xs font-semibold uppercase font-mono tracking-wider text-slate-400 px-1">
            Curriculum Modules
          </div>
          <div className="space-y-1.5">
            {LEARNING_TOPICS.map((topic, index) => {
              const Icon = ICON_MAP[topic.iconName] || Shield;
              const isSelected = selectedTopic.id === topic.id;
              const isCompleted = readTopics.includes(topic.id);

              return (
                <button
                  key={topic.id}
                  type="button"
                  onClick={() => handleSelectTopic(topic)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'border-cyan-500/60 bg-cyan-950/20 text-white shadow-sm'
                      : 'border-slate-800/80 bg-slate-900/40 text-slate-300 hover:bg-slate-900/80 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg border ${
                        isSelected
                          ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                          : 'bg-slate-800 text-slate-400 border-slate-700/60'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold leading-snug line-clamp-1">
                        {index + 1}. {topic.title}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                        {topic.readTime} read
                      </div>
                    </div>
                  </div>

                  {isCompleted && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Topic Content */}
        <div className="lg:col-span-8 space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 md:p-8 space-y-6">
            {/* Title & Badge */}
            <div className="space-y-2 border-b border-slate-800/80 pb-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase text-cyan-400 font-semibold">
                  Module Guide
                </span>
                <span className="text-xs font-mono text-slate-400">{selectedTopic.readTime} reading time</span>
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-white">{selectedTopic.title}</h3>
              <p className="text-xs text-slate-400">{selectedTopic.summary}</p>
            </div>

            {/* Overview prose */}
            <div className="space-y-2 text-xs md:text-sm text-slate-300 leading-relaxed">
              <h4 className="text-xs uppercase font-mono tracking-wider font-semibold text-slate-200">
                Concepts & Architecture
              </h4>
              <p>{selectedTopic.overview}</p>
            </div>

            {/* Real-World Scenario */}
            <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-5 space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-amber-400">
                <AlertCircle className="w-4 h-4" />
                <span>Case Study: {selectedTopic.realWorldScenario.title}</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {selectedTopic.realWorldScenario.narrative}
              </p>
              <div className="pt-2 border-t border-slate-800/60 text-xs text-slate-400">
                <strong className="text-emerald-400 font-mono">Key Takeaway: </strong>
                {selectedTopic.realWorldScenario.lesson}
              </div>
            </div>

            {/* Prevention Checklist */}
            <div className="space-y-3">
              <h4 className="text-xs uppercase font-mono tracking-wider font-semibold text-slate-200">
                Defense & Prevention Best Practices
              </h4>
              <div className="space-y-2">
                {selectedTopic.preventionRules.map((rule, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2.5 p-2.5 rounded-lg bg-slate-950/50 border border-slate-800/80 text-xs text-slate-300"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{rule}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Key Terminology */}
            <div className="space-y-3">
              <h4 className="text-xs uppercase font-mono tracking-wider font-semibold text-slate-200">
                Essential Glossary & Vocabulary
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {selectedTopic.keyTerms.map((term, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg bg-slate-950/50 border border-slate-800/80 space-y-1 text-xs"
                  >
                    <div className="font-semibold text-cyan-300 font-mono">{term.term}</div>
                    <div className="text-slate-400 text-[11px] leading-relaxed">{term.definition}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Interactive Mini-Quiz */}
            <div className="rounded-xl border border-cyan-900/40 bg-cyan-950/10 p-5 space-y-5">
              <div className="flex items-center justify-between border-b border-cyan-900/40 pb-3">
                <div className="flex items-center gap-2 text-xs font-mono font-semibold uppercase text-cyan-300">
                  <HelpCircle className="w-4 h-4" />
                  <span>Module Knowledge Check ({selectedTopic.miniQuiz.length} Questions)</span>
                </div>
                {showQuizResults && (
                  <span className="text-xs font-mono font-bold text-emerald-400">
                    Score: {calculateMiniQuizScore()}/{selectedTopic.miniQuiz.length}
                  </span>
                )}
              </div>

              <div className="space-y-5">
                {selectedTopic.miniQuiz.map((q, qIdx) => {
                  const userAnswer = quizAnswers[qIdx];
                  const hasAnswered = userAnswer !== undefined;
                  const isCorrect = userAnswer === q.correctIndex;

                  return (
                    <div key={qIdx} className="space-y-2.5 text-xs">
                      <div className="font-semibold text-slate-200">
                        {qIdx + 1}. {q.question}
                      </div>

                      <div className="space-y-1.5">
                        {q.options.map((option, optIdx) => {
                          const isSelected = userAnswer === optIdx;
                          let btnStyle = 'border-slate-800 bg-slate-950/60 text-slate-300 hover:bg-slate-900';

                          if (showQuizResults) {
                            if (optIdx === q.correctIndex) {
                              btnStyle = 'border-emerald-700 bg-emerald-950/60 text-emerald-200 font-semibold';
                            } else if (isSelected) {
                              btnStyle = 'border-rose-700 bg-rose-950/60 text-rose-200 font-semibold';
                            }
                          } else if (isSelected) {
                            btnStyle = 'border-cyan-500 bg-cyan-950/60 text-white font-semibold';
                          }

                          return (
                            <button
                              key={optIdx}
                              type="button"
                              onClick={() => handleSelectOption(qIdx, optIdx)}
                              className={`w-full text-left p-2.5 rounded-lg border text-xs transition-colors flex items-center justify-between ${btnStyle}`}
                            >
                              <span>{option}</span>
                              {showQuizResults && optIdx === q.correctIndex && (
                                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {showQuizResults && (
                        <div
                          className={`p-2.5 rounded-lg text-xs leading-relaxed ${
                            isCorrect
                              ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-900/60'
                              : 'bg-rose-950/40 text-rose-300 border border-rose-900/60'
                          }`}
                        >
                          <strong className="font-mono">{isCorrect ? 'Correct! ' : 'Explanation: '}</strong>
                          {q.explanation}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-cyan-900/40">
                <button
                  type="button"
                  onClick={() => setShowQuizResults(!showQuizResults)}
                  disabled={Object.keys(quizAnswers).length < selectedTopic.miniQuiz.length}
                  className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 text-white font-semibold text-xs transition-colors"
                >
                  {showQuizResults ? 'Hide Explanations' : 'Check Answers'}
                </button>

                {!isRead && (
                  <button
                    type="button"
                    onClick={() => onMarkRead(selectedTopic.id)}
                    className="flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 font-medium font-mono"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Mark as Completed</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
