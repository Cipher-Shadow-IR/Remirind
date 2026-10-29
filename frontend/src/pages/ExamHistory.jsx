import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import LoadingSpinner from '../components/LoadingSpinner';
import Button from '../components/ui/Button';
import { fetchUserResults } from '../services/examService';
import {
  History,
  GraduationCap,
  ArrowRight,
  Clock,
  Award,
} from 'lucide-react';

export default function ExamHistory() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetchUserResults();
        setResults(res.data.data || []);
      } catch (err) {
        console.error(err);
        setError('Unable to load assessment records.');
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, []);

  const formatTime = (seconds) => {
    if (!seconds && seconds !== 0) return 'N/A';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <Layout>
      <div className="space-y-10">
        <section className="border-b border-[#d4ccbd] pb-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div className="max-w-2xl">
              <span className="text-[11px] font-sans font-medium uppercase tracking-widest text-[#8b713a]">
                Academic Archive
              </span>
              <h1 className="mt-2 font-serif text-3xl sm:text-5xl text-[#29271f] font-normal tracking-tight leading-[1.1]">
                Assessment History & Performance
              </h1>
              <p className="font-serif italic text-lg sm:text-xl text-[#8b713a] mt-1 pl-4 border-l border-[#8b713a]/40">
                Permanent chronological record of test attempts, accuracy metrics, and evaluation audits.
              </p>
            </div>

            <Link to="/exams">
              <Button variant="primary">
                <GraduationCap className="h-3.5 w-3.5" />
                <span>Browse Assessments</span>
              </Button>
            </Link>
          </div>
        </section>

        {error ? (
          <div className="rounded-[3px] border border-[#8b2b2b]/30 bg-[#8b2b2b]/10 p-4 text-xs text-[#8b2b2b]">
            {error}
          </div>
        ) : null}

        {loading ? (
          <div className="py-20">
            <LoadingSpinner />
          </div>
        ) : results.length === 0 ? (
          <div className="rounded-[3px] border border-dashed border-[#d4ccbd] bg-[#fcfaf5] p-16 text-center">
            <History className="mx-auto h-8 w-8 text-[#8b713a]" />
            <h3 className="mt-3 font-serif text-2xl font-normal text-[#29271f]">
              No Historical Records Found
            </h3>
            <p className="mt-1 text-xs text-[#514d44] font-sans">
              Complete your first examination to establish your academic record.
            </p>
            <div className="mt-6">
              <Link to="/exams">
                <Button size="sm">Initiate Assessment</Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {results.map((result) => (
              <div
                key={result._id}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-[3px] border border-[#d4ccbd] bg-[#fcfaf5] p-6 shadow-[0_1px_3px_rgba(41,39,31,0.04)] transition-colors hover:border-[#8b713a]"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center rounded-[2px] border px-2 py-0.5 text-[10px] uppercase tracking-wider font-semibold ${
                        result.passed
                          ? 'border-[#8b713a]/50 text-[#68501f] bg-[#8b713a]/10'
                          : 'border-[#8b2b2b]/40 text-[#8b2b2b] bg-[#8b2b2b]/10'
                      }`}
                    >
                      {result.passed ? 'Certified Pass' : 'Deficient'}
                    </span>
                    <span className="text-[10px] uppercase tracking-widest text-[#514d44] font-sans">
                      {result.category || 'General'}
                    </span>
                  </div>

                  <h3 className="font-serif text-2xl font-normal text-[#29271f]">
                    {result.examTitle}
                  </h3>

                  <div className="flex flex-wrap items-center gap-3 text-xs font-sans text-[#514d44] pt-1">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-[#8b713a]" />
                      {formatTime(result.timeSpentSeconds)}
                    </span>
                    <span className="text-[#d4ccbd]">&bull;</span>
                    <span className="flex items-center gap-1">
                      <Award className="h-3 w-3 text-[#8b713a]" />
                      {result.score} / {result.totalMarks} Marks
                    </span>
                    <span className="text-[#d4ccbd]">&bull;</span>
                    <span>
                      {new Date(result.createdAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-6 self-end sm:self-center">
                  <div className="text-right">
                    <div
                      className={`font-serif text-3xl font-normal ${
                        result.passed ? 'text-[#29271f]' : 'text-[#8b2b2b]'
                      }`}
                    >
                      {result.percentage}%
                    </div>
                    <div className="text-[10px] uppercase tracking-wider font-sans text-[#514d44]">
                      Accuracy
                    </div>
                  </div>

                  <Link
                    to={`/exams/results/${result._id}`}
                    className="inline-flex items-center gap-1.5 rounded-[3px] border border-[#d4ccbd] bg-[#f7f4ec] px-3 py-2 text-xs uppercase tracking-wider font-medium text-[#29271f] hover:border-[#8b713a] hover:bg-[#eae3d5] transition-colors"
                  >
                    <span>View Audit</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
