import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';
import { Map, Clock, PlayCircle, Trophy, CheckCircle2, ArrowRight } from 'lucide-react';
import Button from '../components/Button';
import Loader from '../components/Loader';

const Tours = () => {
  const { getToken } = useAuth();
  const [tours, setTours] = useState([]);
  const [progress, setProgress] = useState([]); // Array of { tourId, completedSections, completed }
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch tours and progress in parallel
        const token = await getToken();
        const [toursRes, progressRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/api/tours`),
          axios.get(`${import.meta.env.VITE_API_URL}/api/progress`, {
            headers: { Authorization: `Bearer ${token}` },
          }).catch(() => ({ data: [] })), // Fail silently if no progress
        ]);

        setTours(toursRes.data);
        setProgress(progressRes.data);
      } catch (err) {
        console.error(err);
        setError('Failed to load tours.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Helper: get progress for a specific tour
  const getProgressForTour = (tourId) => {
    return progress.find(p => p.tourId?._id === tourId || p.tourId === tourId);
  };

  const completedTours = progress.filter(p => p.completed);
  const inProgressTours = progress.filter(p => !p.completed && p.completedSections?.length > 0);

  if (loading) return <Loader fullScreen text="Loading virtual tours..." />;

  return (
    <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center space-x-2 bg-brand-primary/10 rounded-full px-4 py-1.5 mb-6">
          <Map className="h-4 w-4 text-brand-primary" />
          <span className="text-sm font-bold text-brand-primary uppercase tracking-wide">Interactive Learning</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-display font-bold text-brand-primary mb-6">Virtual Botanical Tours</h1>
        <p className="text-lg text-brand-on-surface-variant">
          Take guided, interactive journeys through the world of plants. Read the content, complete the quizzes, and test your knowledge.
        </p>
      </div>

      {/* ── My Progress Section ────────── */}
      {(completedTours.length > 0 || inProgressTours.length > 0) && (
        <div className="mb-16">
          <div className="flex items-center mb-6">
            <Trophy className="h-6 w-6 text-brand-primary mr-3" />
            <h2 className="text-2xl font-display font-bold text-brand-primary">My Progress</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Completed Tours */}
            {completedTours.map((p) => {
              const tourInfo = p.tourId; // populated from backend
              if (!tourInfo) return null;
              return (
                <Link key={p._id} to={`/tours/${tourInfo._id}`} className="block">
                  <div className="bg-brand-surface rounded-2xl border-2 border-brand-secondary p-5 shadow-sm hover:shadow-md transition-all flex items-center gap-4">
                    <div className="bg-brand-secondary/10 p-3 rounded-xl flex-shrink-0">
                      <CheckCircle2 className="h-6 w-6 text-brand-secondary" />
                    </div>
                    <div className="min-w-0 flex-grow">
                      <p className="font-bold text-brand-primary truncate">{tourInfo.title || 'Tour'}</p>
                      <p className="text-sm text-brand-secondary font-medium">Completed ✓</p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-brand-on-surface-variant flex-shrink-0" />
                  </div>
                </Link>
              );
            })}

            {/* In-Progress Tours */}
            {inProgressTours.map((p) => {
              const tourInfo = p.tourId;
              if (!tourInfo) return null;
              return (
                <Link key={p._id} to={`/tours/${tourInfo._id}`} className="block">
                  <div className="bg-brand-surface rounded-2xl border border-brand-surface-dim p-5 shadow-sm hover:shadow-md transition-all">
                    <div className="flex items-center gap-4 mb-3">
                      <div className="bg-brand-primary/10 p-3 rounded-xl flex-shrink-0">
                        <Map className="h-5 w-5 text-brand-primary" />
                      </div>
                      <div className="min-w-0 flex-grow">
                        <p className="font-bold text-brand-primary truncate">{tourInfo.title || 'Tour'}</p>
                        <p className="text-sm text-brand-on-surface-variant">{p.completedSections.length} sections done</p>
                      </div>
                      <ArrowRight className="h-5 w-5 text-brand-on-surface-variant flex-shrink-0" />
                    </div>
                    {/* Mini progress bar */}
                    <div className="bg-brand-surface-dim rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-brand-primary h-full rounded-full transition-all"
                        style={{ width: `${Math.min((p.completedSections.length / 3) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* ── All Tours Grid ────────── */}
      <div className="flex items-center mb-6">
        <Map className="h-5 w-5 text-brand-primary mr-2" />
        <h2 className="text-xl font-display font-bold text-brand-primary">All Tours</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {tours.map((tour) => {
          const tourProgress = getProgressForTour(tour._id);
          const isCompleted = tourProgress?.completed;

          return (
            <div key={tour._id} className={`bg-brand-surface rounded-[2rem] overflow-hidden border shadow-ambient hover:shadow-lg transition-all duration-300 group flex flex-col ${isCompleted ? 'border-brand-secondary' : 'border-brand-surface-dim'}`}>
              <div className="h-56 relative overflow-hidden">
                <img 
                  src={tour.thumbnailUrl || 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=800&q=80'} 
                  alt={tour.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
                <div className="absolute bottom-4 left-4 flex space-x-2">
                  <span className="bg-brand-surface/90 backdrop-blur-md text-brand-primary text-xs font-bold px-3 py-1.5 rounded-full flex items-center shadow-sm">
                    <Clock className="h-3 w-3 mr-1" /> {(tour.sections && tour.sections.length > 0) ? `${tour.sections.length * 5} mins` : '15 mins'}
                  </span>
                  {tour.category && (
                    <span className="bg-brand-surface/90 backdrop-blur-md text-brand-primary text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                      {tour.category}
                    </span>
                  )}
                </div>
                {isCompleted && (
                  <div className="absolute top-4 right-4 bg-brand-secondary text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center shadow-md">
                    <CheckCircle2 className="h-3 w-3 mr-1" /> Completed
                  </div>
                )}
              </div>
              
              <div className="p-8 flex flex-col flex-grow">
                <h3 className="text-2xl font-display font-bold text-brand-primary mb-3">{tour.title}</h3>
                <p className="text-brand-on-surface-variant leading-relaxed mb-8 flex-grow">{tour.description}</p>
                
                <Link to={`/tours/${tour._id}`} className="w-full">
                  <Button className="w-full justify-between group-hover:bg-brand-secondary">
                    {isCompleted ? 'Review Tour' : (tourProgress ? 'Continue Tour' : 'Start Tour')} <PlayCircle className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Tours;
