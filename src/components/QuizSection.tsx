import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ChevronDown, ChevronUp, RotateCcw, ArrowRight, ArrowLeft } from 'lucide-react';
import {
  ArchiveData,
  NavigationTab,
  QuizQuestion,
  QuizRoastBand,
} from '../types/archive';
import {
  INITIAL_QUIZ_QUESTIONS,
  INITIAL_QUIZ_ROAST_BANDS,
  getRoastForScore,
} from '../data/quizData';

interface QuizSectionProps {
  archive: ArchiveData;
  authorMode?: boolean;
  onNavigate?: (tab: NavigationTab) => void;
  onUpdateArchive: (updater: (prev: ArchiveData) => ArchiveData) => void;
  defaultExpanded?: boolean;
}

export const QuizSection: React.FC<QuizSectionProps> = ({
  archive,
  defaultExpanded = false,
}) => {
  const questions = useMemo<QuizQuestion[]>(() => {
    if (archive.quiz && archive.quiz.length >= 10) {
      return archive.quiz;
    }
    return INITIAL_QUIZ_QUESTIONS;
  }, [archive.quiz]);

  const roastBands = useMemo<QuizRoastBand[]>(() => {
    if (archive.quizRoasts && archive.quizRoasts.length > 0) {
      return archive.quizRoasts;
    }
    return INITIAL_QUIZ_ROAST_BANDS;
  }, [archive.quizRoasts]);

  const [isExpanded, setIsExpanded] = useState<boolean>(defaultExpanded);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [showAnswerBreakdown, setShowAnswerBreakdown] = useState<boolean>(false);

  const totalQuestions = questions.length;
  const currentQuestion = questions[currentIndex] || questions[0];

  const handleSelectOption = (optionIndex: number) => {
    if (!currentQuestion) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: optionIndex,
    }));
  };

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleRestart = () => {
    setSelectedAnswers({});
    setCurrentIndex(0);
    setIsCompleted(false);
    setShowAnswerBreakdown(false);
  };

  const finalScore = useMemo(() => {
    let score = 0;
    questions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctIndex) {
        score += q.points || 10;
      }
    });
    return score;
  }, [questions, selectedAnswers]);

  const matchedRoast = useMemo(
    () => getRoastForScore(finalScore, roastBands),
    [finalScore, roastBands]
  );

  const isCurrentAnswered =
    currentQuestion && selectedAnswers[currentQuestion.id] !== undefined;

  const progressPercentage = Math.round(((currentIndex + 1) / totalQuestions) * 100);

  return (
    <div className="w-full">
      <div className="rounded-2xl overflow-hidden border border-[var(--border-hairline)] bg-[var(--bg-elevated)] tactile-card-shadow transition-colors">
        {/* Symmetrical Responsive Trigger Header */}
        <button
          type="button"
          onClick={() => setIsExpanded((prev) => !prev)}
          className="w-full px-5 sm:px-7 py-4 sm:py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 text-left hover:bg-[var(--bg-canvas)]/50 transition-colors cursor-pointer"
        >
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3.5 min-w-0">
            <span className="inline-flex items-center gap-1.5 font-mono-meta text-[10px] uppercase tracking-wider text-[var(--accent-crimson)] px-2.5 py-1 rounded border border-[var(--border-hairline)] bg-[var(--bg-canvas)]">
              <Sparkles className="w-3 h-3" />
              EASTER EGG
            </span>
            <span className="font-serif-editorial text-lg sm:text-xl md:text-2xl text-[var(--text-primary)] leading-snug">
              For friends who claim they know my taste — 10 quick questions
            </span>
          </div>

          <div className="inline-flex items-center justify-between sm:justify-end gap-2 shrink-0 font-mono-meta text-[11px] uppercase tracking-wider text-[var(--text-secondary)] px-3 py-1.5 rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-canvas)]/70 w-full sm:w-auto">
            <span>{isExpanded ? 'HIDE QUIZ' : 'TRY IT · 2 MIN'}</span>
            {isExpanded ? (
              <ChevronUp className="w-3.5 h-3.5 text-[var(--accent-crimson)]" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 text-[var(--accent-crimson)]" />
            )}
          </div>
        </button>

        {/* Collapsible Quiz Body */}
        <AnimatePresence initial={false}>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22 }}
              className="overflow-hidden border-t border-[var(--border-hairline)]"
            >
              {!isCompleted ? (
                <div className="p-5 sm:p-6 space-y-5">
                  {/* Top Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between font-mono-meta text-[10px] text-[var(--text-muted)]">
                      <span>
                        QUESTION {currentIndex + 1} OF {totalQuestions} ·{' '}
                        <span className="text-[var(--accent-crimson)]">
                          {currentQuestion.category}
                        </span>
                      </span>
                      <span>10 PTS EACH</span>
                    </div>
                    <div className="w-full h-0.5 bg-[var(--border-hairline)] overflow-hidden">
                      <div
                        className="h-full bg-[var(--accent-crimson)] transition-all duration-300"
                        style={{ width: `${progressPercentage}%` }}
                      />
                    </div>
                  </div>

                  {/* Question Text */}
                  <h3 className="font-serif-editorial text-xl sm:text-2xl text-[var(--text-primary)] leading-snug">
                    {currentQuestion.question}
                  </h3>

                  {/* Compact 2-Column Options Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {currentQuestion.options.map((opt, idx) => {
                      const isSelected = selectedAnswers[currentQuestion.id] === idx;
                      const optionLabel = ['A', 'B', 'C', 'D'][idx] || String(idx + 1);
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleSelectOption(idx)}
                          className={`p-3 text-left border transition-all flex items-start gap-2.5 ${
                            isSelected
                              ? 'border-[var(--accent-crimson)] bg-[var(--bg-primary)] text-[var(--text-primary)]'
                              : 'border-[var(--border-hairline)] bg-[var(--bg-primary)]/40 text-[var(--text-secondary)] hover:border-[var(--text-muted)]'
                          }`}
                        >
                          <span
                            className={`font-mono-meta text-[10px] px-1.5 py-0.5 border shrink-0 mt-0.5 ${
                              isSelected
                                ? 'border-[var(--accent-crimson)] text-[var(--accent-crimson)]'
                                : 'border-[var(--border-hairline)] text-[var(--text-muted)]'
                            }`}
                          >
                            {optionLabel}
                          </span>
                          <span className="text-xs sm:text-sm leading-relaxed">{opt}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Compact Footer Controls */}
                  <div className="flex items-center justify-between pt-2 border-t border-[var(--border-hairline)]">
                    <button
                      type="button"
                      onClick={handleBack}
                      disabled={currentIndex === 0}
                      className="inline-flex items-center gap-1.5 font-mono-meta text-[11px] text-[var(--text-muted)] hover:text-[var(--text-primary)] disabled:opacity-30"
                    >
                      <ArrowLeft className="w-3 h-3" />
                      Back
                    </button>

                    <button
                      type="button"
                      onClick={handleNext}
                      disabled={!isCurrentAnswered}
                      className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-[var(--text-primary)] text-[var(--bg-primary)] font-mono-meta text-[11px] disabled:opacity-30 transition-opacity"
                    >
                      <span>
                        {currentIndex === totalQuestions - 1 ? 'See Score' : 'Next'}
                      </span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-5 sm:p-6 space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border-hairline)] pb-4">
                    <div>
                      <div className="font-mono-meta text-[10px] text-[var(--accent-crimson)]">
                        VERDICT · {matchedRoast.rangeLabel}
                      </div>
                      <h3 className="font-serif-editorial text-2xl text-[var(--text-primary)] mt-0.5">
                        {matchedRoast.shortLabel}
                      </h3>
                    </div>
                    <div className="font-serif-editorial text-3xl sm:text-4xl text-[var(--accent-crimson)] shrink-0">
                      {finalScore}
                      <span className="text-lg text-[var(--text-muted)]">/100</span>
                    </div>
                  </div>

                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                    {matchedRoast.roastMessage}
                  </p>

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowAnswerBreakdown((prev) => !prev)}
                      className="font-mono-meta text-[11px] text-[var(--text-secondary)] underline underline-offset-4 hover:text-[var(--text-primary)]"
                    >
                      {showAnswerBreakdown ? 'Hide Answers' : 'Check Answer Key'}
                    </button>

                    <button
                      type="button"
                      onClick={handleRestart}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-[var(--border-hairline)] font-mono-meta text-[11px] text-[var(--text-primary)] hover:border-[var(--accent-crimson)]"
                    >
                      <RotateCcw className="w-3 h-3" />
                      Restart
                    </button>
                  </div>

                  {showAnswerBreakdown && (
                    <div className="pt-3 border-t border-[var(--border-hairline)] space-y-2 max-h-60 overflow-y-auto pr-1">
                      {questions.map((q, i) => {
                        const picked = selectedAnswers[q.id];
                        const isRight = picked === q.correctIndex;
                        return (
                          <div
                            key={q.id}
                            className="text-xs py-2 border-b border-[var(--border-hairline)] last:border-b-0 flex items-start justify-between gap-3"
                          >
                            <div className="space-y-0.5">
                              <div className="text-[var(--text-primary)] font-medium">
                                {i + 1}. {q.question}
                              </div>
                              <div className="text-[var(--text-muted)]">
                                Correct: {q.options[q.correctIndex]}
                              </div>
                            </div>
                            <span
                              className={`font-mono-meta text-[10px] shrink-0 ${
                                isRight
                                  ? 'text-emerald-600'
                                  : 'text-[var(--accent-crimson)]'
                              }`}
                            >
                              {isRight ? '+10' : '0'}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
