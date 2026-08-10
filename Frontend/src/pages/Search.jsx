import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search as SearchIcon, Leaf, AlertCircle } from 'lucide-react';
import Input from '../components/Input';
import PlantCard from '../components/PlantCard';
import Loader from '../components/Loader';

const Search = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedTerm, setDebouncedTerm] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // 1. Debounce the search term
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedTerm(searchTerm);
      setCurrentPage(1); // Reset to first page on new search
    }, 500); // 500ms delay

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  // 2. Fetch data when debounced term changes
  useEffect(() => {
    if (!debouncedTerm) {
      setResults([]);
      return;
    }

    const fetchPlants = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/plants/search?q=${debouncedTerm}`);
        // The backend returns a flat array, so axios puts it directly in response.data
        setResults(response.data || []);
      } catch (err) {
        setError('Failed to fetch plants. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlants();
  }, [debouncedTerm]);

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = results.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(results.length / itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div className="py-8 m-10">
      <div className="max-w-3xl mx-auto mb-12 text-center">
        <h1 className="text-4xl font-display font-bold text-brand-primary mb-4">Discover Plants</h1>
        <p className="text-brand-on-surface-variant mb-8">Search through our extensive botanical database</p>
        
        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <Input
            icon={SearchIcon}
            placeholder="Search for neem, aloe, basil..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Loading State */}
      {loading && <Loader size="lg" text="Searching botanical database..." />}

      {error && (
        <div className="bg-brand-error/10 border-l-4 border-brand-error p-4 rounded-r-lg max-w-2xl mx-auto flex items-center">
          <AlertCircle className="h-5 w-5 text-brand-error mr-3" />
          <p className="text-brand-error">{error}</p>
        </div>
      )}

      {!loading && !error && debouncedTerm && results.length === 0 && (
        <div className="text-center py-20">
          <Leaf className="h-12 w-12 text-brand-surface-dim mx-auto mb-4" />
          <p className="text-brand-on-surface-variant text-lg">No plants found for "{debouncedTerm}"</p>
        </div>
      )}

      {/* Results Grid */}
      {!loading && currentItems.length > 0 && (
        <div className="mb-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentItems.map((plant) => (
              <PlantCard key={plant.id} plant={plant} />
            ))}
          </div>
          
          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center mt-12 space-x-4">
              <button 
                onClick={handlePrevPage} 
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-[1rem] border border-brand-surface-dim text-brand-on-surface disabled:opacity-50 disabled:cursor-not-allowed hover:bg-brand-background transition-colors"
              >
                Previous
              </button>
              <span className="text-brand-on-surface font-medium">
                Page {currentPage} of {totalPages}
              </span>
              <button 
                onClick={handleNextPage} 
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-[1rem] border border-brand-surface-dim text-brand-on-surface disabled:opacity-50 disabled:cursor-not-allowed hover:bg-brand-background transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Search;
