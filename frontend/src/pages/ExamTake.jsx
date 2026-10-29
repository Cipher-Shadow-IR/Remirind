import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { fetchExamForTaking, submitExam } from '../services/examService';
import { useToast } from '../context/ToastContext.jsx';
import LoadingSpinner from '../components/LoadingSpinner';
import ConfirmDialog from '../components/ConfirmDialog';
import Button from '../components/ui/Button';
import {
  Clock,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Send,
  ArrowLeft,
  CheckCircle,
  RotateCcw,
} from 'lucide-react';

export default function ExamTake() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const timerRef = useRef(null);
  const totalDurationRef = useRef(0);

  useEffect(() => {
    let isMounted = true;
    const loadExam = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetchExamForTaking(id);
        const examData = res.data.data;
        if (!isMounted) return;

        setExam(examData);
        const durationSec = (examData.durationMinutes || 20) * 60;
        setTimeLeft(durationSec);
        totalDurationRef.current = durationSec;
      } catch (err) {
        console.error(err);
        if (isMounted) {
          setError(
            err.response?.data?.message || 'Failed to load assessment. It may have expired or been deactivated.'
          );
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadExam();
    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleSubmit = useCallback(async () => {
    if (submitting || !exam) return;
    try {
      setSubmitting(true);
      if (timerRef.current) clearInterval(timerRef.current);

      const timeSpentSeconds = Math.max(0, totalDurationRef.current - timeLeft);

      const answersPayload = exam.questions.map((q) => ({
        questionId: q._id,
        selectedOption: answers[q._id] !== undefined ? answers[q._id] : null,
      }));

      const res = await submitExam(exam._id, {
        answers: answersPayload,
        timeSpentSeconds,
      });

      addToast('Assessment submitted successfully', 'success');
      const resultData = res.data.data;
      navigate(`/exams/results/${resultData._id}`, { replace: true });
    } catch (err) {
      console.error(err);
      addToast(
        err.response?.data?.message || 'Failed to submit assessment.',
        'error'
      );
      setSubmitting(false);
    }
  }, [submitting, exam, timeLeft, answers, addToast, navigate]);

  useEffect(() => {
    if (!exam || timeLeft <= 0 || loading) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          addToast('Examination time concluded. Transmitting answers...', 'info');
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [exam, loading, handleSubmit, addToast]);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (exam && !submitting) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [exam, submitting]);

  const handleSelectOption = (questionId, optionIndex) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const handleClearOption = (questionId) => {
    setAnswers((prev) => {
      const next = { ...prev };
      delete next[questionId];
      return next;
    });
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f7f4ec]">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !exam) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f7f4ec] p-4">
        <div className="max-w-md w-full rounded-[3px] border border-[#d4ccbd] bg-[#fcfaf5] p-6 text-center shadow-sm">
          <AlertTriangle className="mx-auto h-8 w-8 text-[#8b2b2b]" />
          <h2 className="mt-4 font-serif text-2xl font-normal text-[#29271f]">Unable to Load Assessment</h2>
          <p className="mt-2 text-xs text-[#514d44] font-sans leading-relaxed">{error}</p>
          <div className="mt-6 flex justify-center">
            <Link to="/exams">
              <Button variant="outline" size="sm">Return to Assessments</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = exam.questions[currentIndex];
  const totalQuestions = exam.questions.length;
  const answeredCount = Object.keys(answers).length;
  const unansweredCount = totalQuestions - answeredCount;
  const progressPercent = Math.round((answeredCount / totalQuestions) * 100);
  const isUrgentTime = timeLeft > 0 && timeLeft <= 180;

  return (
    <div className="min-h-screen bg-[#f7f4ec] text-[#29271f] flex flex-col font-sans">
      {/* Editorial Sticky Examination Header */}
      <header className="sticky top-0 z-40 w-full border-b border-[#d4ccbd] bg-[#f7f4ec]/95 backdrop-blur shadow-[0_1px_2px_rgba(41,39,31,0.03)]">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-4">
            <Link
              to="/exams"
              className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider text-[#514d44] hover:text-[#29271f] transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Exit Exam</span>
            </Link>
            <div className="h-4 w-px bg-[#d4ccbd]" />
            <div>
              <h1 className="font-serif text-lg sm:text-xl font-normal text-[#29271f] truncate max-w-[200px] sm:max-w-md">
                {exam.title}
              </h1>
              <span className="text-[10px] uppercase tracking-widest text-[#8b713a] hidden sm:block">
                {exam.category} &bull; {exam.totalMarks} Total Marks
              </span>
            </div>
          </div>

          {/* Countdown Clock Display */}
          <div className="flex items-center gap-4">
            <div
              className={`flex items-center gap-2 rounded-[2px] border px-3 py-1 font-mono text-xs sm:text-sm tracking-wider font-semibold ${
                isUrgentTime
                  ? 'border-[#8b2b2b]/50 bg-[#8b2b2b]/10 text-[#8b2b2b] animate-pulse'
                  : 'border-[#d4ccbd] bg-[#fcfaf5] text-[#29271f]'
              }`}
            >
              <Clock className={`h-3.5 w-3.5 ${isUrgentTime ? 'text-[#8b2b2b]' : 'text-[#8b713a]'}`} />
              <span>{formatTime(timeLeft)}</span>
            </div>

            <Button
              variant="primary"
              size="sm"
              onClick={() => setShowConfirmModal(true)}
              loading={submitting}
            >
              <Send className="h-3 w-3" />
              <span>Submit</span>
            </Button>
          </div>
        </div>

        {/* Fine Gold Progress Hairline */}
        <div className="w-full bg-[#e7e0d3] h-[2px]">
          <div
            className="bg-[#8b713a] h-[2px] transition-all duration-200"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </header>

      {/* Main Examination View */}
      <main className="mx-auto flex-1 w-full max-w-6xl px-4 py-8 sm:px-6 grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Column: Active Question Prompt */}
        <div className="lg:col-span-3 space-y-6">
          <div className="rounded-[3px] border border-[#d4ccbd] bg-[#fcfaf5] p-6 sm:p-8 shadow-[0_1px_3px_rgba(41,39,31,0.04)]">
            <div className="flex items-center justify-between border-b border-[#e7e0d3] pb-4">
              <span className="text-[11px] font-sans font-medium uppercase tracking-widest text-[#8b713a]">
                Question {currentIndex + 1} of {totalQuestions}
              </span>
              <div className="flex items-center gap-4">
                <span className="text-[11px] uppercase tracking-wider text-[#514d44] font-medium">
                  {currentQuestion.marks || 10} Marks
                </span>
                {answers[currentQuestion._id] !== undefined ? (
                  <button
                    onClick={() => handleClearOption(currentQuestion._id)}
                    className="inline-flex items-center gap-1 text-[11px] uppercase tracking-wider text-[#514d44] hover:text-[#8b2b2b] transition-colors"
                    title="Clear current selection"
                  >
                    <RotateCcw className="h-3 w-3" />
                    <span>Clear</span>
                  </button>
                ) : null}
              </div>
            </div>

            {/* Question Text */}
            <div className="py-6 border-b border-[#e7e0d3]/60 mb-6">
              <h2 className="font-serif text-xl sm:text-2xl font-normal leading-relaxed text-[#29271f] select-none">
                {currentQuestion.questionText}
              </h2>
            </div>

            {/* Options Selection */}
            <div className="space-y-3">
              {currentQuestion.options.map((optionText, optIndex) => {
                const isSelected = answers[currentQuestion._id] === optIndex;
                const optionLetters = ['A', 'B', 'C', 'D', 'E', 'F'];
                const letter = optionLetters[optIndex] || String(optIndex + 1);

                return (
                  <div
                    key={optIndex}
                    onClick={() => handleSelectOption(currentQuestion._id, optIndex)}
                    className={`flex items-center gap-4 rounded-[3px] border p-4 cursor-pointer transition-colors select-none ${
                      isSelected
                        ? 'border-[#8b713a] bg-[#8b713a]/5 text-[#29271f] shadow-sm'
                        : 'border-[#d4ccbd] bg-[#f7f4ec] hover:border-[#8b713a]/60 text-[#29271f]'
                    }`}
                  >
                    <div
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-[2px] font-serif text-xs font-semibold transition-colors ${
                        isSelected
                          ? 'bg-[#29271f] text-[#f7f4ec]'
                          : 'border border-[#d4ccbd] bg-[#fcfaf5] text-[#514d44]'
                      }`}
                    >
                      {letter}
                    </div>
                    <span className="flex-1 font-sans text-xs sm:text-sm font-normal text-[#29271f]">
                      {optionText}
                    </span>
                    <div
                      className={`h-3.5 w-3.5 rounded-full border flex items-center justify-center transition-colors ${
                        isSelected
                          ? 'border-[#8b713a] bg-[#8b713a]'
                          : 'border-[#d4ccbd]'
                      }`}
                    >
                      {isSelected ? (
                        <div className="h-1 w-1 rounded-full bg-[#f7f4ec]" />
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Paging Buttons */}
            <div className="mt-8 flex items-center justify-between border-t border-[#e7e0d3] pt-5">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                disabled={currentIndex === 0}
              >
                <ChevronLeft className="h-3.5 w-3.5" />
                <span>Previous</span>
              </Button>

              <div className="text-[11px] font-sans uppercase tracking-wider text-[#514d44] hidden sm:block">
                {answeredCount} of {totalQuestions} Answered
              </div>

              {currentIndex < totalQuestions - 1 ? (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setCurrentIndex((prev) => Math.min(totalQuestions - 1, prev + 1))}
                >
                  <span>Next Question</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </Button>
              ) : (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setShowConfirmModal(true)}
                  className="bg-[#29271f] hover:bg-[#454034]"
                >
                  <span>Finish & Submit</span>
                  <CheckCircle className="h-3.5 w-3.5" />
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Question Palette Matrix */}
        <div className="space-y-6">
          <div className="rounded-[3px] border border-[#d4ccbd] bg-[#fcfaf5] p-5 shadow-[0_1px_3px_rgba(41,39,31,0.04)]">
            <h3 className="font-serif text-lg font-normal text-[#29271f]">
              Question Navigation
            </h3>
            <p className="mt-1 text-[11px] text-[#514d44] font-sans">
              Select any index to jump directly.
            </p>

            {/* Palette Buttons */}
            <div className="mt-4 grid grid-cols-5 gap-1.5">
              {exam.questions.map((q, idx) => {
                const isAnswered = answers[q._id] !== undefined;
                const isCurrent = currentIndex === idx;

                let btnStyle = 'border-[#d4ccbd] bg-[#f7f4ec] text-[#514d44] hover:border-[#8b713a]';
                if (isAnswered) {
                  btnStyle = 'bg-[#29271f] text-[#f7f4ec] border-[#29271f] font-semibold';
                }
                if (isCurrent) {
                  btnStyle += ' ring-2 ring-[#8b713a] ring-offset-1';
                }

                return (
                  <button
                    key={q._id}
                    onClick={() => setCurrentIndex(idx)}
                    className={`flex h-8 w-full items-center justify-center rounded-[2px] border text-xs font-serif transition-colors ${btnStyle}`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            <div className="mt-5 space-y-2 border-t border-[#e7e0d3] pt-4 text-[11px] uppercase tracking-wider font-sans text-[#514d44]">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-[2px] bg-[#29271f]" />
                <span>Answered ({answeredCount})</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-[2px] border border-[#d4ccbd] bg-[#f7f4ec]" />
                <span>Unanswered ({unansweredCount})</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-[2px] border-2 border-[#8b713a]" />
                <span>Current Question</span>
              </div>
            </div>
          </div>

          {/* Assessment Protocol Summary */}
          <div className="rounded-[3px] border border-[#d4ccbd] bg-[#fcfaf5] p-5 shadow-[0_1px_3px_rgba(41,39,31,0.04)] space-y-3">
            <h4 className="font-serif text-base font-normal text-[#29271f] border-b border-[#e7e0d3] pb-2">
              Parameters
            </h4>
            <div className="flex justify-between text-xs font-sans">
              <span className="text-[#514d44]">Total Questions</span>
              <span className="font-medium text-[#29271f]">{totalQuestions}</span>
            </div>
            <div className="flex justify-between text-xs font-sans">
              <span className="text-[#514d44]">Maximum Marks</span>
              <span className="font-medium text-[#29271f]">{exam.totalMarks}</span>
            </div>
            <div className="flex justify-between text-xs font-sans">
              <span className="text-[#514d44]">Threshold</span>
              <span className="font-medium text-[#29271f]">{exam.passingPercentage}%</span>
            </div>
            <div className="pt-2 border-t border-[#e7e0d3]">
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => setShowConfirmModal(true)}
              >
                Submit Assessment
              </Button>
            </div>
          </div>
        </div>
      </main>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        open={showConfirmModal}
        isOpen={showConfirmModal}
        title="Confirm Examination Submission"
        message={`You have answered ${answeredCount} of ${totalQuestions} questions. ${
          unansweredCount > 0
            ? `Notice: ${unansweredCount} question${
                unansweredCount > 1 ? 's remain' : ' remains'
              } unanswered and will receive 0 marks.`
            : 'All test questions have been completed.'
        } Are you prepared to conclude your examination and view your evaluation report?`}
        confirmText="Confirm & Submit"
        cancelText="Continue Review"
        variant="primary"
        onConfirm={() => {
          setShowConfirmModal(false);
          handleSubmit();
        }}
        onCancel={() => setShowConfirmModal(false)}
        loading={submitting}
      />
    </div>
  );
}
