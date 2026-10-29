import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../components/Layout';
import LoadingSpinner from '../components/LoadingSpinner';
import Button from '../components/ui/Button';
import { fetchResultById } from '../services/examService';
import {
  Trophy,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
  Award,
  ArrowLeft,
  RotateCcw,
  BookOpen,
  Printer,
  HelpCircle,
} from 'lucide-react';

export default function ExamReport() {
  const { id } = useParams();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    const loadReport = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetchResultById(id);
        setResult(res.data.data);
      } catch (err) {
        console.error(err);
        setError(
          err.response?.data?.message || 'Failed to load assessment report.'
        );
      } finally {
        setLoading(false);
      }
    };

    loadReport();
  }, [id]);

  if (loading) {
    return (
      <Layout>
        <div className="py-24">
          <LoadingSpinner />
        </div>
      </Layout>
    );
  }

  if (error || !result) {
    return (
      <Layout>
        <div className="rounded-[3px] border border-[#d4ccbd] bg-[#fcfaf5] p-12 text-center max-w-lg mx-auto shadow-sm">
          <AlertCircle className="mx-auto h-8 w-8 text-[#8b2b2b]" />
          <h2 className="mt-4 font-serif text-2xl font-normal text-[#29271f]">Report Unavailable</h2>
          <p className="mt-2 text-xs text-[#514d44] font-sans">{error}</p>
          <div className="mt-6">
            <Link to="/exams">
              <Button size="sm">Return to Assessments</Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  const formatTime = (seconds) => {
    if (!seconds && seconds !== 0) return 'N/A';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const filteredDetails = (result.details || []).filter((item) => {
    if (filterType === 'correct') return item.isCorrect;
    if (filterType === 'incorrect') {
      return !item.isCorrect && item.selectedOption !== null && item.selectedOption !== undefined;
    }
    if (filterType === 'unanswered') {
      return item.selectedOption === null || item.selectedOption === undefined;
    }
    return true;
  });

  return (
    <Layout>
      <div className="space-y-10 print:p-0">
        {/* Top Control Ribbon */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#d4ccbd] pb-6 print:hidden">
          <Link
            to="/exams"
            className="inline-flex items-center gap-1.5 text-xs font-sans uppercase tracking-wider text-[#514d44] hover:text-[#29271f] transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Return to Curriculum</span>
          </Link>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.print()}
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Print Report</span>
            </Button>
            <Link to={`/exams/${result.examId}/take`}>
              <Button size="sm" variant="primary">
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Retake Assessment</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Hero Performance Banner */}
        <section className="rounded-[3px] border border-[#d4ccbd] bg-[#fcfaf5] p-6 sm:p-10 shadow-[0_1px_3px_rgba(41,39,31,0.04)]">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center rounded-[2px] border px-2 py-0.5 text-[10px] uppercase tracking-wider font-semibold ${
                    result.passed
                      ? 'border-[#8b713a]/50 text-[#68501f] bg-[#8b713a]/10'
                      : 'border-[#8b2b2b]/40 text-[#8b2b2b] bg-[#8b2b2b]/10'
                  }`}
                >
                  {result.passed ? 'Certified Pass' : 'Academic Deficit'}
                </span>
                <span className="text-[10px] font-sans uppercase tracking-widest text-[#514d44]">
                  {result.category || 'General'}
                </span>
              </div>

              <h1 className="font-serif text-3xl sm:text-5xl font-normal tracking-tight text-[#29271f] leading-tight">
                {result.examTitle}
              </h1>

              <p className="font-serif italic text-base text-[#514d44] pl-3 border-l border-[#8b713a]/50">
                Evaluation recorded on{' '}
                {new Date(result.createdAt).toLocaleString(undefined, {
                  dateStyle: 'medium',
                  timeStyle: 'short',
                })}
              </p>
            </div>

            {/* Score Figure */}
            <div className="flex flex-col items-center sm:items-end border border-[#d4ccbd] bg-[#f7f4ec] rounded-[3px] p-5 self-stretch sm:self-auto min-w-[160px]">
              <span className="text-[10px] font-sans font-medium uppercase tracking-widest text-[#514d44]">
                Total Accuracy
              </span>
              <div
                className={`font-serif text-4xl sm:text-5xl font-normal tracking-tight my-1 ${
                  result.passed ? 'text-[#29271f]' : 'text-[#8b2b2b]'
                }`}
              >
                {result.percentage}%
              </div>
              <span className="text-[11px] font-sans text-[#514d44]">
                {result.score} of {result.totalMarks} Marks
              </span>
            </div>
          </div>
        </section>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
          <div className="rounded-[3px] border border-[#d4ccbd] bg-[#fcfaf5] p-5 shadow-[0_1px_2px_rgba(41,39,31,0.03)]">
            <div className="flex items-center justify-between border-b border-[#e7e0d3] pb-2 text-[#514d44]">
              <span className="text-[10px] uppercase tracking-widest font-medium">Final Score</span>
              <Award className="h-3.5 w-3.5 text-[#8b713a]" />
            </div>
            <div className="mt-2 font-serif text-3xl text-[#29271f]">
              {result.score} <span className="text-sm font-sans text-[#514d44]">/ {result.totalMarks}</span>
            </div>
            <div className="mt-1 text-[11px] text-[#514d44]">Threshold: 60%</div>
          </div>

          <div className="rounded-[3px] border border-[#d4ccbd] bg-[#fcfaf5] p-5 shadow-[0_1px_2px_rgba(41,39,31,0.03)]">
            <div className="flex items-center justify-between border-b border-[#e7e0d3] pb-2 text-[#514d44]">
              <span className="text-[10px] uppercase tracking-widest font-medium">Duration</span>
              <Clock className="h-3.5 w-3.5 text-[#8b713a]" />
            </div>
            <div className="mt-2 font-serif text-3xl text-[#29271f]">
              {formatTime(result.timeSpentSeconds)}
            </div>
            <div className="mt-1 text-[11px] text-[#514d44]">Timed session</div>
          </div>

          <div className="rounded-[3px] border border-[#d4ccbd] bg-[#fcfaf5] p-5 shadow-[0_1px_2px_rgba(41,39,31,0.03)]">
            <div className="flex items-center justify-between border-b border-[#e7e0d3] pb-2 text-[#514d44]">
              <span className="text-[10px] uppercase tracking-widest font-medium">Correct</span>
              <CheckCircle2 className="h-3.5 w-3.5 text-[#68501f]" />
            </div>
            <div className="mt-2 font-serif text-3xl text-[#68501f]">
              {result.correctCount} <span className="text-sm font-sans text-[#514d44]">/ {result.totalQuestions}</span>
            </div>
            <div className="mt-1 text-[11px] text-[#514d44]">Accurate answers</div>
          </div>

          <div className="rounded-[3px] border border-[#d4ccbd] bg-[#fcfaf5] p-5 shadow-[0_1px_2px_rgba(41,39,31,0.03)]">
            <div className="flex items-center justify-between border-b border-[#e7e0d3] pb-2 text-[#514d44]">
              <span className="text-[10px] uppercase tracking-widest font-medium">Incorrect / Skipped</span>
              <XCircle className="h-3.5 w-3.5 text-[#8b2b2b]" />
            </div>
            <div className="mt-2 font-serif text-3xl text-[#8b2b2b]">
              {result.incorrectCount + result.unansweredCount}
            </div>
            <div className="mt-1 text-[11px] text-[#514d44]">{result.incorrectCount} wrong, {result.unansweredCount} skipped</div>
          </div>
        </div>

        {/* Question Solutions Breakdown */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#d4ccbd] pb-4">
            <div>
              <h2 className="font-serif text-2xl font-normal text-[#29271f]">
                Detailed Solutions & Commentary
              </h2>
              <p className="mt-1 text-xs text-[#514d44] font-sans">
                Review your selections alongside official keys and conceptual rationales.
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-1.5 print:hidden">
              <button
                onClick={() => setFilterType('all')}
                className={`rounded-[2px] border px-2.5 py-1 text-[11px] font-sans uppercase tracking-wider transition-colors ${
                  filterType === 'all'
                    ? 'border-[#29271f] bg-[#29271f] text-[#f7f4ec]'
                    : 'border-[#d4ccbd] bg-[#fcfaf5] text-[#514d44] hover:border-[#8b713a]'
                }`}
              >
                All ({result.details?.length || 0})
              </button>
              <button
                onClick={() => setFilterType('correct')}
                className={`rounded-[2px] border px-2.5 py-1 text-[11px] font-sans uppercase tracking-wider transition-colors ${
                  filterType === 'correct'
                    ? 'border-[#29271f] bg-[#29271f] text-[#f7f4ec]'
                    : 'border-[#d4ccbd] bg-[#fcfaf5] text-[#514d44] hover:border-[#8b713a]'
                }`}
              >
                Correct ({result.correctCount})
              </button>
              <button
                onClick={() => setFilterType('incorrect')}
                className={`rounded-[2px] border px-2.5 py-1 text-[11px] font-sans uppercase tracking-wider transition-colors ${
                  filterType === 'incorrect'
                    ? 'border-[#29271f] bg-[#29271f] text-[#f7f4ec]'
                    : 'border-[#d4ccbd] bg-[#fcfaf5] text-[#514d44] hover:border-[#8b713a]'
                }`}
              >
                Incorrect ({result.incorrectCount})
              </button>
              {result.unansweredCount > 0 ? (
                <button
                  onClick={() => setFilterType('unanswered')}
                  className={`rounded-[2px] border px-2.5 py-1 text-[11px] font-sans uppercase tracking-wider transition-colors ${
                    filterType === 'unanswered'
                      ? 'border-[#29271f] bg-[#29271f] text-[#f7f4ec]'
                      : 'border-[#d4ccbd] bg-[#fcfaf5] text-[#514d44] hover:border-[#8b713a]'
                  }`}
                >
                  Skipped ({result.unansweredCount})
                </button>
              ) : null}
            </div>
          </div>

          <div className="space-y-6">
            {filteredDetails.map((detail, idx) => {
              const isUnanswered =
                detail.selectedOption === null || detail.selectedOption === undefined;
              const optionLetters = ['A', 'B', 'C', 'D', 'E', 'F'];

              return (
                <div
                  key={idx}
                  className="rounded-[3px] border border-[#d4ccbd] bg-[#fcfaf5] p-6 shadow-[0_1px_3px_rgba(41,39,31,0.04)]"
                >
                  <div className="flex items-start justify-between gap-4 border-b border-[#e7e0d3] pb-3">
                    <div className="flex items-center gap-3">
                      <span className="font-serif text-lg text-[#514d44]">
                        #{idx + 1}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 rounded-[2px] border px-2 py-0.5 text-[10px] uppercase tracking-wider font-semibold ${
                          detail.isCorrect
                            ? 'border-[#8b713a]/50 text-[#68501f] bg-[#8b713a]/10'
                            : isUnanswered
                            ? 'border-[#d4ccbd] text-[#514d44] bg-[#f7f4ec]'
                            : 'border-[#8b2b2b]/40 text-[#8b2b2b] bg-[#8b2b2b]/10'
                        }`}
                      >
                        {detail.isCorrect
                          ? `Correct (+${detail.marksAwarded} Marks)`
                          : isUnanswered
                          ? 'Unanswered (0 Marks)'
                          : 'Incorrect (0 Marks)'}
                      </span>
                    </div>

                    <span className="text-[10px] uppercase tracking-widest text-[#514d44]">
                      Max {detail.maxMarks || 10} Marks
                    </span>
                  </div>

                  <h3 className="mt-4 font-serif text-xl font-normal text-[#29271f] leading-relaxed">
                    {detail.questionText}
                  </h3>

                  {/* Options List */}
                  <div className="mt-4 space-y-2">
                    {detail.options.map((optionText, optIdx) => {
                      const isUserChoice = detail.selectedOption === optIdx;
                      const isCorrectChoice = detail.correctOption === optIdx;
                      const letter = optionLetters[optIdx] || String(optIdx + 1);

                      let style = 'border-[#d4ccbd] bg-[#f7f4ec] text-[#514d44]';

                      if (isCorrectChoice) {
                        style = 'border-[#8b713a] bg-[#8b713a]/10 text-[#29271f] font-medium';
                      } else if (isUserChoice && !detail.isCorrect) {
                        style = 'border-[#8b2b2b]/50 bg-[#8b2b2b]/10 text-[#8b2b2b]';
                      }

                      return (
                        <div
                          key={optIdx}
                          className={`flex items-center justify-between gap-3 rounded-[3px] border p-3 text-xs sm:text-sm font-sans ${style}`}
                        >
                          <div className="flex items-center gap-3">
                            <span
                              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-[2px] font-serif text-xs font-semibold ${
                                isCorrectChoice
                                  ? 'bg-[#29271f] text-[#f7f4ec]'
                                  : isUserChoice && !detail.isCorrect
                                  ? 'bg-[#8b2b2b] text-[#f7f4ec]'
                                  : 'border border-[#d4ccbd] bg-[#fcfaf5] text-[#514d44]'
                              }`}
                            >
                              {letter}
                            </span>
                            <span>{optionText}</span>
                          </div>

                          <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider font-semibold shrink-0">
                            {isUserChoice ? (
                              <span
                                className={`rounded-[2px] border px-2 py-0.5 ${
                                  detail.isCorrect
                                    ? 'border-[#8b713a]/50 text-[#68501f]'
                                    : 'border-[#8b2b2b]/50 text-[#8b2b2b]'
                                }`}
                              >
                                Your Selection
                              </span>
                            ) : null}
                            {isCorrectChoice && !isUserChoice ? (
                              <span className="rounded-[2px] border border-[#8b713a]/60 bg-[#8b713a]/20 text-[#68501f] px-2 py-0.5">
                                Verified Key
                              </span>
                            ) : null}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Theoretical Explanation */}
                  {detail.explanation ? (
                    <div className="mt-4 rounded-[2px] border-l-2 border-[#8b713a] bg-[#f7f4ec] p-4 text-xs font-sans">
                      <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider font-semibold text-[#68501f]">
                        <HelpCircle className="h-3.5 w-3.5 text-[#8b713a]" />
                        <span>Conceptual Explanation:</span>
                      </div>
                      <p className="mt-1 text-[#514d44] leading-relaxed">
                        {detail.explanation}
                      </p>
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </section>

        {/* Footer Actions */}
        <div className="flex items-center justify-center gap-4 pt-6 pb-12 print:hidden border-t border-[#d4ccbd]">
          <Link to="/exams">
            <Button variant="outline" size="default">
              Return to Curriculum
            </Button>
          </Link>
          <Link to={`/exams/${result.examId}/take`}>
            <Button variant="primary" size="default">
              Retake Assessment
            </Button>
          </Link>
        </div>
      </div>
    </Layout>
  );
}
