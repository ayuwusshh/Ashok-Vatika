import React, { useState, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';
import {
  UploadCloud, X, FlaskConical, CheckCircle2, AlertTriangle,
  AlertOctagon, HelpCircle, Minus, Star
} from 'lucide-react';
import Button from '../components/Button';

// --- Config ---
// Maps each backend category to display label, color, and icon
const CATEGORY_CONFIG = {
  best:    { label: 'Best',    bg: 'bg-emerald-50',  border: 'border-emerald-400', text: 'text-emerald-700',  icon: <Star        className="h-5 w-5 text-emerald-500" />, badge: 'bg-emerald-100 text-emerald-700' },
  good:    { label: 'Good',    bg: 'bg-green-50',    border: 'border-green-400',   text: 'text-green-700',    icon: <CheckCircle2 className="h-5 w-5 text-green-500"   />, badge: 'bg-green-100 text-green-700'   },
  average: { label: 'Average', bg: 'bg-yellow-50',   border: 'border-yellow-400',  text: 'text-yellow-700',   icon: <Minus       className="h-5 w-5 text-yellow-500"  />, badge: 'bg-yellow-100 text-yellow-700'  },
  bad:     { label: 'Bad',     bg: 'bg-orange-50',   border: 'border-orange-400',  text: 'text-orange-700',   icon: <AlertTriangle className="h-5 w-5 text-orange-500" />, badge: 'bg-orange-100 text-orange-700'  },
  worst:   { label: 'Worst',   bg: 'bg-red-50',      border: 'border-red-400',     text: 'text-red-700',      icon: <AlertOctagon className="h-5 w-5 text-red-500"    />, badge: 'bg-red-100 text-red-700'       },
  unknown: { label: 'Unknown', bg: 'bg-gray-50',     border: 'border-gray-300',    text: 'text-gray-600',     icon: <HelpCircle   className="h-5 w-5 text-gray-400"   />, badge: 'bg-gray-100 text-gray-600'     },
};

// --- Component ---
const Analyzer = () => {
  const { getToken } = useAuth();
  const [previewUrl, setPreviewUrl]     = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isDragging, setIsDragging]     = useState(false);
  const [loading, setLoading]           = useState(false);
  const [results, setResults]           = useState(null); // { best:[], good:[], ... }
  const [error, setError]               = useState(null);
  const fileInputRef = useRef(null);

  const totalCount = results
    ? Object.values(results).reduce((acc, arr) => acc + arr.length, 0)
    : 0;

  // --- Handlers ---
  const handleFile = (file) => {
    if (!file?.type.startsWith('image/')) { setError('Please select a valid image.'); return; }
    setError(null);
    setSelectedImage(file);
    setPreviewUrl(URL.createObjectURL(file));
    setResults(null);
  };

  const removeImage = () => {
    setSelectedImage(null);
    setPreviewUrl(null);
    setResults(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const analyzeImage = async () => {
    if (!selectedImage) return;
    setLoading(true);
    setError(null);
    setResults(null);

    const formData = new FormData();
    formData.append('image', selectedImage);

    try {
      const token = await getToken();
      const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/api/analyze`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        },
      });
      // data is: { best:[], good:[], average:[], bad:[], worst:[], unknown:[] }
      setResults(data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Analysis failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // --- Render ---
  return (
    <div className="py-12 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center space-x-2 bg-brand-primary/10 rounded-full px-4 py-1.5 mb-5">
          <FlaskConical className="h-4 w-4 text-brand-primary" />
          <span className="text-sm font-bold text-brand-primary uppercase tracking-wide">AI-Powered</span>
        </div>
        <h1 className="text-4xl font-display font-bold text-brand-primary mb-4">Ingredient Analyzer</h1>
        <p className="text-brand-on-surface-variant max-w-2xl mx-auto">
          Upload a photo of any product label. Our system will extract ingredients via OCR and instantly categorize their safety.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* ── Upload Column ─────────────────────── */}
        <div className="space-y-6">
          {/* Drop Zone */}
          <div
            className={`border-2 border-dashed rounded-[2rem] p-10 text-center transition-all duration-300 cursor-pointer
              ${isDragging ? 'border-brand-primary bg-brand-primary/5 scale-[1.02]' : 'border-brand-surface-dim bg-brand-surface hover:border-brand-primary/50'}`}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
            onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFile(e.dataTransfer.files[0]); }}
            onClick={() => !previewUrl && fileInputRef.current?.click()}
          >
            {!previewUrl ? (
              <div className="flex flex-col items-center space-y-4">
                <div className="bg-brand-background p-4 rounded-full">
                  <UploadCloud className="h-10 w-10 text-brand-primary" />
                </div>
                <div>
                  <p className="text-lg font-bold text-brand-primary mb-1">Drag & Drop your image here</p>
                  <p className="text-sm text-brand-on-surface-variant">Supports JPG, PNG (Max 5MB)</p>
                </div>
                <Button variant="outline" onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}>
                  Browse Files
                </Button>
              </div>
            ) : (
              <div className="relative group rounded-[1.5rem] overflow-hidden">
                <img src={previewUrl} alt="Label Preview" className="w-full h-[280px] object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    onClick={(e) => { e.stopPropagation(); removeImage(); }}
                    className="bg-white p-2 rounded-full text-red-500 hover:scale-110 transition-transform"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
              </div>
            )}
          </div>

          <input type="file" accept="image/*" className="hidden" ref={fileInputRef}
            onChange={(e) => handleFile(e.target.files?.[0])} />

          {error && (
            <div className="p-4 bg-red-50 text-red-700 rounded-2xl flex items-center border border-red-200">
              <AlertOctagon className="h-5 w-5 mr-3 flex-shrink-0" /> {error}
            </div>
          )}

          <Button
            className="w-full"
            size="lg"
            onClick={analyzeImage}
            disabled={!selectedImage || loading}
            isLoading={loading}
          >
            {loading ? 'Analyzing...' : 'Analyze Ingredients'}
          </Button>

          {/* Legend */}
          <div className="bg-brand-surface border border-brand-surface-dim rounded-2xl p-5">
            <p className="text-sm font-bold text-brand-primary mb-3">Safety Legend</p>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(CATEGORY_CONFIG).map(([key, cfg]) => (
                <div key={key} className="flex items-center space-x-2">
                  {cfg.icon}
                  <span className="text-sm text-brand-on-surface-variant">{cfg.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Results Column ────────────────────── */}
        <div className="bg-brand-surface rounded-[2rem] border border-brand-surface-dim p-8 shadow-ambient min-h-[500px] flex flex-col">
          <h2 className="text-2xl font-bold text-brand-primary mb-2 flex items-center">
            <FlaskConical className="mr-3 h-6 w-6" /> Analysis Results
          </h2>

          {!results && !loading && (
            <div className="flex-grow flex flex-col items-center justify-center text-center">
              <div className="bg-brand-background p-5 rounded-full mb-4">
                <FlaskConical className="h-10 w-10 text-brand-surface-dim" />
              </div>
              <p className="text-brand-on-surface-variant max-w-xs">
                Upload an image and click analyze. Results will appear here, categorized by safety rating.
              </p>
            </div>
          )}

          {loading && (
            <div className="flex-grow flex flex-col items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary mb-4"></div>
              <p className="text-brand-on-surface-variant font-medium animate-pulse">Reading label via OCR...</p>
              <p className="text-brand-on-surface-variant text-sm mt-1 animate-pulse">This may take 10–20 seconds</p>
            </div>
          )}

          {results && (
            <div className="flex flex-col flex-grow">
              {/* Summary bar */}
              <div className="flex items-center justify-between mb-6 p-3 bg-brand-background rounded-xl">
                <p className="text-sm text-brand-on-surface-variant font-medium">
                  {totalCount} ingredient{totalCount !== 1 ? 's' : ''} found
                </p>
                <div className="flex gap-2">
                  {results.best?.length  > 0 && <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">{results.best.length} Best</span>}
                  {results.good?.length  > 0 && <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-green-100   text-green-700">  {results.good.length} Good</span>}
                  {results.bad?.length   > 0 && <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-orange-100  text-orange-700">{results.bad.length} Bad</span>}
                  {results.worst?.length > 0 && <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-red-100     text-red-700">  {results.worst.length} Worst</span>}
                </div>
              </div>

              <div className="space-y-6 overflow-y-auto flex-grow pr-1">
                {Object.entries(CATEGORY_CONFIG).map(([key, cfg]) => {
                  const items = results[key];
                  if (!items || items.length === 0) return null;

                  return (
                    <div key={key}>
                      {/* Section Header */}
                      <div className={`flex items-center space-x-2 mb-3 px-3 py-1.5 rounded-xl ${cfg.badge} w-fit`}>
                        {cfg.icon}
                        <span className={`text-sm font-bold ${cfg.text}`}>{cfg.label} ({items.length})</span>
                      </div>

                      <div className="space-y-2">
                        {items.map((item, i) => (
                          <div key={i}
                            className={`flex items-start p-4 rounded-2xl border ${cfg.bg} ${cfg.border}`}>
                            <div className="mt-0.5 mr-3 flex-shrink-0">{cfg.icon}</div>
                            <div className="flex-grow min-w-0">
                              <p className={`font-semibold capitalize text-base ${cfg.text}`}>
                                {/* item is either { ingredient_name, functions } or just a string (unknown) */}
                                {typeof item === 'string' ? item : item.ingredient_name}
                              </p>
                              {typeof item !== 'string' && item.functions && (
                                <p className="text-sm text-brand-on-surface-variant mt-0.5">
                                  {item.functions}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}

                {totalCount === 0 && (
                  <p className="text-brand-on-surface-variant text-center py-10">
                    No clear ingredients were recognized. Try a clearer, well-lit photo of the label.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Analyzer;
