import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';
import {
  ArrowLeft, ArrowRight, BookOpen, CheckCircle2,
  XCircle, Trophy, RotateCcw, ChevronRight
} from 'lucide-react';
import Button from '../components/Button';
import Loader from '../components/Loader';

const TourDetail = () => {
  const { id } = useParams();
  const { getToken } = useAuth();
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Navigation state
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [view, setView] = useState('content'); // 'content' | 'quiz' | 'results'

  // Quiz state
  const [answers, setAnswers] = useState({});       // { questionIndex: selectedOption }
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  // Overall progress
  const [completedSections, setCompletedSections] = useState(new Set());

  useEffect(() => {
    const fetchTour = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/tours/${id}`);
        // Sort sections by order
        if (data.sections) {
          data.sections.sort((a, b) => a.order - b.order);
        }
        setTour(data);

        // Fetch existing progress
        try {
          const token = await getToken();
          const { data: progress } = await axios.get(`${import.meta.env.VITE_API_URL}/api/progress/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (progress && progress.completedSections) {
            // Convert section order numbers to indices
            const indices = new Set();
            progress.completedSections.forEach(order => {
              const idx = data.sections.findIndex(s => s.order === order);
              if (idx !== -1) indices.add(idx);
            });
            setCompletedSections(indices);
          }
        } catch (progressErr) {
          // Progress fetch failed, that's ok — start fresh
          console.log('No existing progress found.');
        }
      } catch (err) {
        console.error(err);
        setError('Could not load this tour.');
      } finally {
        setLoading(false);
      }
    };
    fetchTour();
  }, [id]);

  if (loading) return <Loader fullScreen text="Loading tour..." />;
  if (error || !tour) {
    return (
      <div className="py-24 text-center max-w-xl mx-auto">
        <h2 className="text-2xl font-bold text-brand-primary mb-4">Tour Not Found</h2>
        <p className="text-brand-on-surface-variant mb-8">{error}</p>
        <Link to="/tours"><Button>Back to Tours</Button></Link>
      </div>
    );
  }

  const sections = tour.sections || [];
  const currentSection = sections[currentSectionIndex];
  const hasQuiz = currentSection?.quiz?.questions?.length > 0;
  const totalSections = sections.length;
  const allCompleted = completedSections.size === totalSections;

  // --- Quiz Handlers ---
  const selectAnswer = (qIdx, option) => {
    if (submitted) return;
    setAnswers(prev => ({ ...prev, [qIdx]: option }));
  };

  const submitQuiz = async () => {
    let correct = 0;
    currentSection.quiz.questions.forEach((q, i) => {
      if (answers[i] === q.correctAnswer) correct++;
    });
    setScore(correct);
    setSubmitted(true);
    const passed = correct >= (currentSection.quiz.passingScore || 1);
    if (passed) {
      setCompletedSections(prev => new Set([...prev, currentSectionIndex]));
      // Save progress to backend
      try {
        const token = await getToken();
        await axios.post(`${import.meta.env.VITE_API_URL}/api/progress/${id}/section`, {
          sectionOrder: currentSection.order,
        }, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch (err) {
        console.error('Failed to save progress:', err);
      }
    }
  };

  const goToNextSection = () => {
    if (currentSectionIndex < totalSections - 1) {
      setCurrentSectionIndex(prev => prev + 1);
      resetQuiz();
      setView('content');
    }
  };

  const goToPrevSection = () => {
    if (currentSectionIndex > 0) {
      setCurrentSectionIndex(prev => prev - 1);
      resetQuiz();
      setView('content');
    }
  };

  const jumpToSection = (idx) => {
    setCurrentSectionIndex(idx);
    resetQuiz();
    setView('content');
  };

  const resetQuiz = () => {
    setAnswers({});
    setSubmitted(false);
    setScore(0);
  };

  // --- Render ---
  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <Link to="/tours" className="inline-flex items-center text-brand-on-surface-variant hover:text-brand-primary transition-colors mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Tours
        </Link>
        <h1 className="text-3xl md:text-4xl font-display font-bold text-brand-primary">{tour.title}</h1>
        <p className="text-brand-on-surface-variant mt-2">{tour.description}</p>
        {/* Progress bar */}
        <div className="mt-4 flex items-center gap-4">
          <div className="flex-grow bg-brand-surface-dim rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-brand-primary h-full rounded-full transition-all duration-500"
              style={{ width: `${totalSections > 0 ? (completedSections.size / totalSections) * 100 : 0}%` }}
            />
          </div>
          <span className="text-sm font-medium text-brand-primary whitespace-nowrap">
            {completedSections.size}/{totalSections} complete
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* ── Sidebar ────────────────── */}
        <div className="lg:col-span-1">
          <div className="bg-brand-surface rounded-2xl border border-brand-surface-dim p-5 shadow-sm sticky top-28">
            <h3 className="font-bold text-brand-primary mb-4 flex items-center">
              <BookOpen className="h-4 w-4 mr-2" /> Sections
            </h3>
            <nav className="space-y-1">
              {sections.map((sec, idx) => {
                const isActive = idx === currentSectionIndex;
                const isDone = completedSections.has(idx);
                return (
                  <button
                    key={sec._id}
                    onClick={() => jumpToSection(idx)}
                    className={`w-full text-left flex items-center px-3 py-2.5 rounded-xl text-sm transition-all
                      ${isActive
                        ? 'bg-brand-primary text-white font-bold shadow-sm'
                        : 'hover:bg-brand-background text-brand-on-surface-variant'}`}
                  >
                    {isDone ? (
                      <CheckCircle2 className={`h-4 w-4 mr-2 flex-shrink-0 ${isActive ? 'text-white' : 'text-brand-secondary'}`} />
                    ) : (
                      <ChevronRight className={`h-4 w-4 mr-2 flex-shrink-0 ${isActive ? 'text-white' : 'text-brand-on-surface-variant'}`} />
                    )}
                    <span className="truncate">{sec.title}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* ── Main Content ────────────── */}
        <div className="lg:col-span-3">
          <div className="bg-brand-surface rounded-[2rem] border border-brand-surface-dim shadow-ambient p-8 md:p-10 min-h-[500px]">

            {/* Section Title */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-brand-on-surface-variant">
                  Section {currentSectionIndex + 1} of {totalSections}
                </span>
                <h2 className="text-2xl font-display font-bold text-brand-primary mt-1">{currentSection?.title}</h2>
              </div>
              {completedSections.has(currentSectionIndex) && (
                <span className="flex items-center text-sm font-bold text-brand-secondary bg-brand-secondary/10 px-3 py-1.5 rounded-full">
                  <CheckCircle2 className="h-4 w-4 mr-1.5" /> Passed
                </span>
              )}
            </div>

            {/* ── Content View ── */}
            {view === 'content' && (
              <div>
                <div className="prose prose-brand max-w-none text-brand-on-surface-variant leading-relaxed text-lg mb-10 bg-brand-background rounded-2xl p-6 border border-brand-surface-dim">
                  {currentSection?.content}
                </div>

                <div className="flex items-center justify-between">
                  <Button
                    variant="outline"
                    onClick={goToPrevSection}
                    disabled={currentSectionIndex === 0}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" /> Previous
                  </Button>

                  {hasQuiz ? (
                    <Button onClick={() => { resetQuiz(); setView('quiz'); }}>
                      Take Quiz <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  ) : (
                    <Button onClick={goToNextSection} disabled={currentSectionIndex === totalSections - 1}>
                      Next Section <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            )}

            {/* ── Quiz View ── */}
            {view === 'quiz' && hasQuiz && (
              <div>
                <div className="space-y-8 mb-10">
                  {currentSection.quiz.questions.map((q, qIdx) => (
                    <div key={q._id} className="bg-brand-background rounded-2xl border border-brand-surface-dim p-6">
                      <p className="font-bold text-brand-primary mb-4">
                        Q{qIdx + 1}. {q.question}
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {q.options.map((opt) => {
                          const isSelected = answers[qIdx] === opt;
                          const isCorrect = submitted && opt === q.correctAnswer;
                          const isWrong = submitted && isSelected && opt !== q.correctAnswer;

                          let classes = 'border-2 rounded-xl px-4 py-3 text-left transition-all cursor-pointer text-sm font-medium ';
                          if (isCorrect) {
                            classes += 'border-green-500 bg-green-50 text-green-700';
                          } else if (isWrong) {
                            classes += 'border-red-400 bg-red-50 text-red-700';
                          } else if (isSelected) {
                            classes += 'border-brand-primary bg-brand-primary/5 text-brand-primary';
                          } else {
                            classes += 'border-brand-surface-dim bg-brand-surface hover:border-brand-primary/40 text-brand-on-surface-variant';
                          }

                          return (
                            <button
                              key={opt}
                              onClick={() => selectAnswer(qIdx, opt)}
                              disabled={submitted}
                              className={classes}
                            >
                              <span className="flex items-center">
                                {isCorrect && <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />}
                                {isWrong && <XCircle className="h-4 w-4 mr-2 text-red-500" />}
                                {opt}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                {!submitted ? (
                  <div className="flex justify-between">
                    <Button variant="outline" onClick={() => setView('content')}>
                      <ArrowLeft className="mr-2 h-4 w-4" /> Back to Content
                    </Button>
                    <Button
                      onClick={submitQuiz}
                      disabled={Object.keys(answers).length < currentSection.quiz.questions.length}
                    >
                      Submit Answers
                    </Button>
                  </div>
                ) : (
                  <div className="text-center">
                    {/* Score Banner */}
                    <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-2xl mb-6 ${
                      score >= (currentSection.quiz.passingScore || 1)
                        ? 'bg-green-50 border border-green-300 text-green-700'
                        : 'bg-red-50 border border-red-300 text-red-700'
                    }`}>
                      {score >= (currentSection.quiz.passingScore || 1) ? (
                        <Trophy className="h-6 w-6" />
                      ) : (
                        <XCircle className="h-6 w-6" />
                      )}
                      <span className="font-bold text-lg">
                        {score} / {currentSection.quiz.questions.length} correct
                      </span>
                    </div>

                    <div className="flex justify-center gap-4 mt-4">
                      {score < (currentSection.quiz.passingScore || 1) && (
                        <Button variant="outline" onClick={() => { resetQuiz(); }}>
                          <RotateCcw className="mr-2 h-4 w-4" /> Retry
                        </Button>
                      )}
                      {currentSectionIndex < totalSections - 1 && (
                        <Button onClick={goToNextSection}>
                          Next Section <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      )}
                      {allCompleted && (
                        <Link to="/tours">
                          <Button>
                            <Trophy className="mr-2 h-4 w-4" /> Finish Tour
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourDetail;
