import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { DestinationCard } from '../components/destinations/DestinationCard';
import { useTravel } from '../context/TravelContext';
import { CATEGORIES } from '../data/destinationsData';
import { Search, Filter, SlidersHorizontal, ArrowUpDown, X, Globe, Sparkles } from 'lucide-react';

export const ExplorePage = () => {
  const { destinations } = useTravel();
  const [searchParams, setSearchParams] = useSearchParams();

  // Search, filter, and sort states
  const [searchQuery, setSearchQuery] = useState(searchParams.get('query') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
  const [selectedCountry, setSelectedCountry] = useState(searchParams.get('country') || 'All');
  const [sortBy, setSortBy] = useState('popularity'); // 'popularity', 'price-asc', 'price-desc', 'rating'

  // Sync state if URL query changes
  useEffect(() => {
    const query = searchParams.get('query');
    if (query !== null) setSearchQuery(query);
  }, [searchParams]);

  // Extract unique countries
  const countries = useMemo(() => {
    const list = Array.from(new Set(destinations.map((d) => d.country)));
    return ['All', ...list.sort()];
  }, [destinations]);

  // Filter & Sort logic
  const filteredDestinations = useMemo(() => {
    return destinations
      .filter((dest) => {
        // Search Query filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchesName = dest.name.toLowerCase().includes(q);
          const matchesRegion = dest.region.toLowerCase().includes(q);
          const matchesCountry = dest.country.toLowerCase().includes(q);
          const matchesDesc = dest.shortDescription.toLowerCase().includes(q);
          if (!matchesName && !matchesRegion && !matchesCountry && !matchesDesc) {
            return false;
          }
        }

        // Category filter
        if (selectedCategory !== 'All' && dest.category !== selectedCategory) {
          return false;
        }

        // Country filter
        if (selectedCountry !== 'All' && dest.country !== selectedCountry) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'popularity') {
          return (b.reviewCount || 0) - (a.reviewCount || 0);
        }
        if (sortBy === 'price-asc') {
          return a.pricePerDay - b.pricePerDay;
        }
        if (sortBy === 'price-desc') {
          return b.pricePerDay - a.pricePerDay;
        }
        if (sortBy === 'rating') {
          return b.rating - a.rating;
        }
        return 0;
      });
  }, [destinations, searchQuery, selectedCategory, selectedCountry, sortBy]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedCountry('All');
    setSortBy('popularity');
    setSearchParams({});
  };

  const isFiltered = searchQuery || selectedCategory !== 'All' || selectedCountry !== 'All';

  return (
    <div className="py-10 space-y-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-emerald-50 text-emerald-700 border border-emerald-100">
          <Globe className="w-3.5 h-3.5 text-emerald-600" />
          <span>Global Destination Directory</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-navy-900 font-sans">
          Explore Destinations
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          From snow-crested Himalayan valleys to Mediterranean cliffs and neon megalopolises, discover your next dream getaway.
        </p>
      </div>

      {/* Filter and Control Bar */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-subtle border border-slate-100 space-y-5">
        
        {/* Search & Main Selectors */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5">
          
          {/* Search Input */}
          <div className="md:col-span-5 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by destination, region, or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-semibold text-navy-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Country Selector */}
          <div className="md:col-span-4 relative">
            <div className="flex items-center bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-3">
              <Globe className="w-4 h-4 text-emerald-600 mr-2 flex-shrink-0" />
              <div className="flex-1">
                <select
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  className="w-full bg-transparent text-xs sm:text-sm font-bold text-navy-900 focus:outline-none cursor-pointer"
                >
                  {countries.map((country) => (
                    <option key={country} value={country}>
                      {country === 'All' ? 'All Countries' : country}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Sort Selector */}
          <div className="md:col-span-3 relative">
            <div className="flex items-center bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-3">
              <ArrowUpDown className="w-4 h-4 text-emerald-600 mr-2 flex-shrink-0" />
              <div className="flex-1">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full bg-transparent text-xs sm:text-sm font-bold text-navy-900 focus:outline-none cursor-pointer"
                >
                  <option value="popularity">Most Popular</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>
            </div>
          </div>

        </div>

        {/* Category Pills Bar */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 w-full sm:w-auto scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-navy-900 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-navy-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Active Status & Reset */}
          <div className="flex items-center gap-3 ml-auto text-xs font-semibold text-slate-500 pt-1 sm:pt-0">
            <span>
              Showing <strong className="text-navy-900">{filteredDestinations.length}</strong> of {destinations.length}
            </span>
            {isFiltered && (
              <button
                onClick={handleResetFilters}
                className="flex items-center gap-1 text-emerald-700 hover:text-emerald-900 font-bold bg-emerald-50 px-2.5 py-1 rounded-lg"
              >
                <X className="w-3.5 h-3.5" />
                <span>Reset Filters</span>
              </button>
            )}
          </div>
        </div>

      </div>

      {/* Destinations Grid */}
      {filteredDestinations.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredDestinations.map((destination) => (
            <DestinationCard key={destination.id} destination={destination} />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-3xl p-12 text-center max-w-lg mx-auto border border-slate-100 shadow-subtle space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
            <Search className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-navy-900">No destinations found</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            We couldn't find any destinations matching your current filters. Try relaxing the category, country or search term.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors shadow-sm"
          >
            Clear All Filters
          </button>
        </div>
      )}

    </div>
  );
};
