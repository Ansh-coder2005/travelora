import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Calendar, Users, Sparkles, MapPin, ArrowRight } from 'lucide-react';

export const HeroSection = () => {
  const navigate = useNavigate();
  const [destinationSearch, setDestinationSearch] = useState('');
  const [travelDate, setTravelDate] = useState('');
  const [travellers, setTravellers] = useState('2');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (destinationSearch.trim()) params.append('query', destinationSearch.trim());
    if (travelDate) params.append('date', travelDate);
    if (travellers) params.append('travellers', travellers);
    navigate(`/explore?${params.toString()}`);
  };

  return (
    <div className="relative min-h-[620px] lg:min-h-[700px] flex items-center justify-center overflow-hidden">
      {/* Background Photography with Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=2000&q=85"
          alt="Travel adventure landscape"
          className="w-full h-full object-cover object-center scale-105 animate-in fade-in duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy-950/85 via-navy-950/60 to-navy-900/75" />
        <div className="absolute inset-0 hero-vignette" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20">
        
        {/* Floating pill badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-emerald-300 text-xs sm:text-sm font-semibold mb-6 animate-in fade-in slide-in-from-top-4">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>Smart AI Powered Travel Architecture • 2026 Edition</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white font-sans leading-[1.1] mb-6 drop-shadow-md">
          Discover Your Next <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
            Adventure
          </span>
        </h1>

        {/* Tagline */}
        <p className="max-w-2xl mx-auto text-base sm:text-xl text-slate-200 font-normal leading-relaxed mb-10 drop-shadow-sm">
          Explore the world your way. From high Himalayan passes to sun-drenched coastal havens, generate bespoke day-wise itineraries, calculate live budgets, and book curated holiday packages.
        </p>

        {/* Interactive Search Bar Widget */}
        <div className="max-w-4xl mx-auto bg-white/95 backdrop-blur-md rounded-3xl p-3 sm:p-4 shadow-2xl border border-white/30 text-left">
          <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            
            {/* Destination Search */}
            <div className="md:col-span-4 p-2 sm:p-3 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-emerald-500 transition-colors">
              <label className="block text-[11px] font-extrabold text-navy-900 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                <span>Destination</span>
              </label>
              <input
                type="text"
                placeholder="Where to? (e.g. Ladakh, Bali, Goa)"
                value={destinationSearch}
                onChange={(e) => setDestinationSearch(e.target.value)}
                className="w-full bg-transparent text-sm font-semibold text-navy-900 placeholder:text-slate-400 focus:outline-none"
              />
            </div>

            {/* Travel Date */}
            <div className="md:col-span-3 p-2 sm:p-3 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-emerald-500 transition-colors">
              <label className="block text-[11px] font-extrabold text-navy-900 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                <span>Departure</span>
              </label>
              <input
                type="date"
                value={travelDate}
                onChange={(e) => setTravelDate(e.target.value)}
                className="w-full bg-transparent text-sm font-semibold text-navy-900 placeholder:text-slate-400 focus:outline-none"
              />
            </div>

            {/* Travellers Selector */}
            <div className="md:col-span-2 p-2 sm:p-3 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-emerald-500 transition-colors">
              <label className="block text-[11px] font-extrabold text-navy-900 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-emerald-600" />
                <span>Travellers</span>
              </label>
              <select
                value={travellers}
                onChange={(e) => setTravellers(e.target.value)}
                className="w-full bg-transparent text-sm font-semibold text-navy-900 focus:outline-none cursor-pointer"
              >
                <option value="1">1 Solo</option>
                <option value="2">2 Couple</option>
                <option value="4">4 Family</option>
                <option value="6">6 Group</option>
              </select>
            </div>

            {/* Submit Action */}
            <div className="md:col-span-3">
              <button
                type="submit"
                className="w-full h-full min-h-[52px] rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-sm shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all transform active:scale-95"
              >
                <Search className="w-4 h-4" />
                <span>Explore Destinations</span>
              </button>
            </div>

          </form>

          {/* Quick suggestions tags */}
          <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs text-slate-500 px-1">
            <span className="font-semibold text-navy-900">Trending Now:</span>
            {['Ladakh', 'Goa', 'Swiss Alps', 'Bali', 'Dubai', 'Kerala'].map((city) => (
              <button
                key={city}
                onClick={() => {
                  setDestinationSearch(city);
                  navigate(`/explore?query=${city}`);
                }}
                className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 transition-colors font-medium text-slate-600"
              >
                {city}
              </button>
            ))}
          </div>

        </div>

      </div>
    </div>
  );
};
