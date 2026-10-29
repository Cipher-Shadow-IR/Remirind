import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import LoadingSpinner from '../components/LoadingSpinner';
import Button from '../components/ui/Button';
import { fetchExams, fetchUserResults } from '../services/examService';
import {
  GraduationCap,
  Clock,
  Award,
  BookOpen,
  Search,
  CheckCircle2,
  XCircle,
  ArrowRight,
  History,
  FileCheck2,
} from 'lucide-react';

export default function ExamList() {
  const [exams, setExams] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeTab, setActiveTab] = useState('available'); // 'available' | 'history'

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [examsRes, resultsRes] = await Promise.all([
        fetchExams(),
        fetchUserResults(),
      ]);
      setExams(examsRes.data.data || []);
      setResults(resultsRes.data.data || []);
    } catch (err) {
      console.error(err);
      setError('Unable to load assessments. Please verify your connection.');
    } finally {
      setLoading(false);
    }
  };

  const categories = ['All', ...new Set(exams.map((e) => e.category).filter(Boolean))];

  const filteredExams = exams.filter((exam) => {
    const matchesSearch =
      exam.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (exam.description && exam.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory =
      selectedCategory === 'All' || exam.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <Layout>
      <div className="space-y-10">
        {/* Editorial Opening */}
        <section className="border-b border-[#d4ccbd] pb-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-2xl">
              <span className="text-[11px] font-sans font-medium uppercase tracking-widest text-[#8b713a]">
                Academic & Technical Examination
              </span>
              <h1 className="mt-2 font-serif text-3xl sm:text-5xl text-[#29271f] font-normal tracking-tight leading-[1.1]">
                Assessments & Knowledge Audits
              </h1>
              <p className="font-serif italic text-lg sm:text-xl text-[#8b713a] mt-1 pl-4 border-l border-[#8b713a]/40">
                Rigorous evaluations, real-time grading, and detailed conceptual post-mortems.
              </p>
            </div>

            {/* Tab switchers */}
            <div className="flex items-center gap-1 border border-[#d4ccbd] bg-[#fcfaf5] p-1 rounded-[3px] self-start md:self-auto">
              <button
                onClick={() => setActiveTab('available')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-[2px] text-xs font-sans uppercase tracking-wider font-medium transition-colors ${
                  activeTab === 'available'
                    ? 'bg-[#29271f] text-[#f7f4ec]'
                    : 'text-[#514d44] hover:text-[#29271f]'
                }`}
              >
                <BookOpen className="h-3.5 w-3.5" />
                <span>Available ({exams.length})</span>
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-[2px] text-xs font-sans uppercase tracking-wider font-medium transition-colors ${
                  activeTab === 'history'
                    ? 'bg-[#29271f] text-[#f7f4ec]'
                    : 'text-[#514d44] hover:text-[#29271f]'
                }`}
              >
                <History className="h-3.5 w-3.5" />
                <span>History ({results.length})</span>
              </button>
            </div>
          </div>
        </section>

        {error ? (
          <div className="rounded-[3px] border border-[#8b2b2b]/30 bg-[#8b2b2b]/10 p-4 text-xs text-[#8b2b2b] flex items-center justify-between">
            <span>{error}</span>
            <Button size="sm" variant="outline" onClick={loadData}>
              Retry
            </Button>
          </div>
        ) : null}

        {loading ? (
          <div className="py-20">
            <LoadingSpinner />
          </div>
        ) : activeTab === 'available' ? (
          <div className="space-y-8">
            {/* Search and Category Filter Ribbon */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#e7e0d3] pb-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#514d44]/70" />
                <input
                  type="text"
                  placeholder="Filter curriculum by keyword..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-[3px] border border-[#d4ccbd] bg-[#fcfaf5] pl-8 pr-3 py-1.5 text-xs text-[#29271f] font-sans placeholder:text-[#514d44]/60 focus:outline-none focus:border-[#8b713a] focus:ring-1 focus:ring-[#8b713a] transition-colors"
                />
              </div>

              {/* Category Pills */}
              <div className="flex flex-wrap items-center gap-1.5">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`rounded-[2px] border px-2.5 py-1 text-[11px] font-sans uppercase tracking-wider transition-colors ${
                      selectedCategory === cat
                        ? 'border-[#29271f] bg-[#29271f] text-[#f7f4ec]'
                        : 'border-[#d4ccbd] bg-[#fcfaf5] text-[#514d44] hover:border-[#8b713a]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Assessment Cards Grid */}
            {filteredExams.length === 0 ? (
              <div className="rounded-[3px] border border-dashed border-[#d4ccbd] bg-[#fcfaf5] p-16 text-center">
                <GraduationCap className="mx-auto h-8 w-8 text-[#8b713a]" />
                <h3 className="mt-3 font-serif text-2xl font-normal text-[#29271f]">
                  No Assessments Located
                </h3>
                <p className="mt-1 text-xs text-[#514d44] font-sans">
                  No testing material aligns with your filter criteria.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredExams.map((exam) => {
                  const pastAttempts = results.filter((r) => r.examId === exam._id);
                  const latestResult = pastAttempts[0];

                  return (
                    <div
                      key={exam._id}
                      className="group flex flex-col justify-between rounded-[3px] border border-[#d4ccbd] bg-[#fcfaf5] p-6 shadow-[0_1px_3px_rgba(41,39,31,0.04)] transition-colors hover:border-[#8b713a]"
                    >
                      <div className="space-y-4">
                        <div className="flex items-start justify-between gap-2 border-b border-[#e7e0d3] pb-3">
                          <span className="text-[10px] font-sans font-medium uppercase tracking-widest text-[#8b713a]">
                            {exam.category || 'General'}
                          </span>
                          {latestResult ? (
                            <span
                              className={`inline-flex items-center gap-1 rounded-[2px] border px-2 py-0.5 text-[10px] uppercase tracking-wider font-semibold ${
                                latestResult.passed
                                  ? 'border-[#8b713a]/50 text-[#68501f] bg-[#8b713a]/10'
                                  : 'border-[#8b2b2b]/40 text-[#8b2b2b] bg-[#8b2b2b]/10'
                              }`}
                            >
                              {latestResult.passed ? (
                                <CheckCircle2 className="h-3 w-3" />
                              ) : (
                                <XCircle className="h-3 w-3" />
                              )}
                              Score: {latestResult.percentage}%
                            </span>
                          ) : null}
                        </div>

                        <div>
                          <h3 className="font-serif text-2xl font-normal tracking-tight text-[#29271f] group-hover:text-[#8b713a] transition-colors">
                            {exam.title}
                          </h3>
                          <p className="mt-2 font-sans text-xs sm:text-sm text-[#514d44] leading-relaxed line-clamp-3">
                            {exam.description || 'Standard academic examination designed to measure practical proficiency.'}
                          </p>
                        </div>

                        {/* Specs band */}
                        <div className="grid grid-cols-3 gap-2 border-t border-b border-[#e7e0d3] py-3 text-center bg-[#f7f4ec]/60">
                          <div>
                            <div className="flex items-center justify-center gap-1 text-[10px] uppercase tracking-widest text-[#514d44]">
                              <Clock className="h-3 w-3 text-[#8b713a]" />
                              Duration
                            </div>
                            <div className="mt-1 font-serif text-lg text-[#29271f]">
                              {exam.durationMinutes}m
                            </div>
                          </div>
                          <div className="border-l border-r border-[#e7e0d3]">
                            <div className="flex items-center justify-center gap-1 text-[10px] uppercase tracking-widest text-[#514d44]">
                              <Award className="h-3 w-3 text-[#8b713a]" />
                              Marks
                            </div>
                            <div className="mt-1 font-serif text-lg text-[#29271f]">
                              {exam.totalMarks || (exam.questionCount || 0) * 10}
                            </div>
                          </div>
                          <div>
                            <div className="flex items-center justify-center gap-1 text-[10px] uppercase tracking-widest text-[#514d44]">
                              <FileCheck2 className="h-3 w-3 text-[#8b713a]" />
                              Questions
                            </div>
                            <div className="mt-1 font-serif text-lg text-[#29271f]">
                              {exam.questionCount || exam.totalQuestions || 0}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 flex items-center gap-2 pt-2">
                        <Link
                          to={`/exams/${exam._id}/take`}
                          className="flex-1 inline-flex items-center justify-center gap-2 rounded-[3px] bg-[#29271f] px-3.5 py-2 text-xs uppercase tracking-wider font-medium text-[#f7f4ec] hover:bg-[#454034] transition-colors"
                        >
                          <span>{latestResult ? 'Retake Examination' : 'Begin Assessment'}</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                        {latestResult ? (
                          <Link
                            to={`/exams/results/${latestResult._id}`}
                            className="inline-flex items-center justify-center rounded-[3px] border border-[#d4ccbd] bg-[#fcfaf5] px-3 py-2 text-xs uppercase tracking-wider font-medium text-[#29271f] hover:bg-[#eae3d5] hover:border-[#8b713a]"
                            title="View Last Report"
                          >
                            Report
                          </Link>
                        ) : null}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          /* User History Table */
          <div className="space-y-6">
            {results.length === 0 ? (
              <div className="rounded-[3px] border border-dashed border-[#d4ccbd] bg-[#fcfaf5] p-16 text-center">
                <History className="mx-auto h-8 w-8 text-[#8b713a]" />
                <h3 className="mt-3 font-serif text-2xl font-normal text-[#29271f]">
                  No Examination Records
                </h3>
                <p className="mt-1 text-xs text-[#514d44] font-sans">
                  No assessments have been recorded yet for your account.
                </p>
                <div className="mt-6">
                  <Button size="sm" onClick={() => setActiveTab('available')}>
                    Browse Available Tests
                  </Button>
                </div>
              </div>
            ) : (
              <div className="overflow-hidden rounded-[3px] border border-[#d4ccbd] bg-[#fcfaf5]">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-sans">
                    <thead className="border-b border-[#d4ccbd] bg-[#f7f4ec] text-[10px] uppercase tracking-widest text-[#514d44]">
                      <tr>
                        <th className="px-5 py-3 font-medium">Curriculum</th>
                        <th className="px-5 py-3 font-medium">Domain</th>
                        <th className="px-5 py-3 font-medium">Score</th>
                        <th className="px-5 py-3 font-medium">Accuracy</th>
                        <th className="px-5 py-3 font-medium">Evaluation</th>
                        <th className="px-5 py-3 font-medium">Date Recorded</th>
                        <th className="px-5 py-3 font-medium text-right">Audit</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#e7e0d3]">
                      {results.map((res) => (
                        <tr key={res._id} className="hover:bg-[#f7f4ec]/50 transition-colors">
                          <td className="px-5 py-3.5 font-serif text-base text-[#29271f]">
                            {res.examTitle}
                          </td>
                          <td className="px-5 py-3.5 text-[#514d44] uppercase tracking-wider text-[11px]">
                            {res.category || 'General'}
                          </td>
                          <td className="px-5 py-3.5 font-serif text-base text-[#29271f]">
                            {res.score} / {res.totalMarks}
                          </td>
                          <td className="px-5 py-3.5 font-sans font-medium text-[#29271f]">
                            {res.percentage}%
                          </td>
                          <td className="px-5 py-3.5">
                            <span
                              className={`inline-flex items-center rounded-[2px] border px-2 py-0.5 text-[10px] uppercase tracking-wider font-semibold ${
                                res.passed
                                  ? 'border-[#8b713a]/50 text-[#68501f] bg-[#8b713a]/10'
                                  : 'border-[#8b2b2b]/40 text-[#8b2b2b] bg-[#8b2b2b]/10'
                              }`}
                            >
                              {res.passed ? 'Certified' : 'Deficient'}
                            </span>
                          </td>
                          <td className="px-5 py-3.5 text-[#514d44]">
                            {new Date(res.createdAt).toLocaleDateString(undefined, {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </td>
                          <td className="px-5 py-3.5 text-right">
                            <Link
                              to={`/exams/results/${res._id}`}
                              className="inline-flex items-center gap-1 font-sans text-xs uppercase tracking-wider font-semibold text-[#8b713a] hover:text-[#68501f]"
                            >
                              <span>Report</span>
                              <ArrowRight className="h-3 w-3" />
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}
