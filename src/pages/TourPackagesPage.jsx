import React, { useState, useMemo } from 'react';
import { PackageCard } from '../components/packages/PackageCard';
import { useTravel } from '../context/TravelContext';
import { CATEGORIES } from '../data/destinationsData';
import { Package, Search, Filter, Clock, Sparkles, CheckCircle2 } from 'lucide-react';

export const TourPackagesPage = () => {
  const { packages } = useTravel();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [durationFilter, setDurationFilter] = useState('All'); // 'All', 'short' (<=4), 'medium' (5-6), 'long' (>=7)
  const [priceMax, setPriceMax] = useState(160000);

  const filteredPackages = useMemo(() => {
    return packages.filter((pkg) => {
      // Query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesTitle = pkg.title.toLowerCase().includes(q);
        const matchesDest = pkg.destination.toLowerCase().includes(q);
        const matchesOverview = pkg.overview.toLowerCase().includes(q);
        if (!matchesTitle && !matchesDest && !matchesOverview) return false;
      }

      // Category filter
      if (selectedCategory !== 'All' && pkg.category !== selectedCategory) {
        return false;
      }

      // Duration filter
      if (durationFilter === 'short' && pkg.daysCount > 4) return false;
      if (durationFilter === 'medium' && (pkg.daysCount < 5 || pkg.daysCount > 6)) return false;
      if (durationFilter === 'long' && pkg.daysCount < 7) return false;

      // Price filter
      if (pkg.price > priceMax) return false;

      return true;
    });
  }, [packages, searchQuery, selectedCategory, durationFilter, priceMax]);

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-emerald-50 text-emerald-700 border border-emerald-100">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>Curated Travel Itineraries</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-navy-900 font-sans">
          Tour & Holiday Packages
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Comprehensive vacations with verified 4-star boutique hotels, private sanitized transport, full day-wise schedules, and local tour guides.
        </p>
      </div>

      {/* Filter and Control Bar */}
      <div className="bg-white rounded-3xl p-6 shadow-subtle border border-slate-100 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          
          {/* Search Bar */}
          <div className="md:col-span-5 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search package name or destination..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-semibold text-navy-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Duration Selector */}
          <div className="md:col-span-4">
            <div className="flex items-center bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-3">
              <Clock className="w-4 h-4 text-emerald-600 mr-2 flex-shrink-0" />
              <select
                value={durationFilter}
                onChange={(e) => setDurationFilter(e.target.value)}
                className="w-full bg-transparent text-xs sm:text-sm font-bold text-navy-900 focus:outline-none cursor-pointer"
              >
                <option value="All">All Durations</option>
                <option value="short">Short Getaway (≤ 4 Days)</option>
                <option value="medium">Standard Vacation (5 - 6 Days)</option>
                <option value="long">Extended Journey (≥ 7 Days)</option>
              </select>
            </div>
          </div>

          {/* Category Selector */}
          <div className="md:col-span-3">
            <div className="flex items-center bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-3">
              <Filter className="w-4 h-4 text-emerald-600 mr-2 flex-shrink-0" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-transparent text-xs sm:text-sm font-bold text-navy-900 focus:outline-none cursor-pointer"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat === 'All' ? 'All Categories' : cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

        </div>

        {/* Results summary & Active Count */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-semibold">
          <span>
            Displaying <strong className="text-navy-900">{filteredPackages.length}</strong> verified tour packages
          </span>
          {(searchQuery || selectedCategory !== 'All' || durationFilter !== 'All') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setDurationFilter('All');
                setPriceMax(160000);
              }}
              className="text-emerald-700 hover:text-emerald-900 font-bold bg-emerald-50 px-2.5 py-1 rounded-lg"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Packages Grid */}
      {filteredPackages.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPackages.map((pkg) => (
            <PackageCard key={pkg.id} packageData={pkg} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center max-w-md mx-auto border border-slate-100 shadow-subtle space-y-3">
          <Package className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-lg font-bold text-navy-900">No packages found</h3>
          <p className="text-xs text-slate-500">
            No packages match your specific filters. Try expanding the duration or category filter.
          </p>
        </div>
      )}

    </div>
  );
};
