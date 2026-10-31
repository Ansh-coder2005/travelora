import React from 'react';
import { Link } from 'react-router-dom';
import { HeroSection } from '../components/home/HeroSection';
import { WhyChooseUs } from '../components/home/WhyChooseUs';
import { Newsletter } from '../components/home/Newsletter';
import { DestinationCard } from '../components/destinations/DestinationCard';
import { PackageCard } from '../components/packages/PackageCard';
import { StarRating } from '../components/common/StarRating';
import { useTravel } from '../context/TravelContext';
import { TESTIMONIALS, PLATFORM_STATS } from '../data/reviewsData';
import { ArrowRight, Sparkles, MapPin, Compass, Quote } from 'lucide-react';

export const HomePage = () => {
  const { destinations, packages } = useTravel();

  // Trending destinations (top 4)
  const trendingDestinations = destinations.slice(0, 4);

  // Featured packages (top 3)
  const featuredPackages = packages.slice(0, 3);

  return (
    <div className="space-y-16 lg:space-y-24">
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Platform Key Stats Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 sm:-mt-12 relative z-20">
        <div className="bg-white rounded-3xl p-5 sm:p-8 shadow-card border border-slate-100 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-center">
          {PLATFORM_STATS.map((stat, i) => (
            <div key={i} className="p-3 sm:p-4 rounded-2xl bg-slate-50/70 border border-slate-100/60 flex flex-col items-center justify-center">
              <p className="text-2xl sm:text-4xl font-extrabold text-navy-900 font-sans tracking-tight">
                {stat.value}
              </p>
              <p className="text-[11px] sm:text-xs font-bold text-slate-500 mt-1 uppercase tracking-wider text-center">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Trending Destinations Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-emerald-50 text-emerald-700 border border-emerald-100 mb-2">
              <Compass className="w-3.5 h-3.5 text-emerald-600" />
              <span>Trending Worldwide</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-navy-900 tracking-tight font-sans">
              Top Pick Destinations
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Handpicked spots capturing the hearts of wanderers this season.
            </p>
          </div>

          <Link
            to="/explore"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-emerald-700 hover:text-emerald-800 hover:underline group"
          >
            <span>View All Destinations</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trendingDestinations.map((dest) => (
            <DestinationCard key={dest.id} destination={dest} />
          ))}
        </div>
      </section>

      {/* 4. AI Smart Planner Banner Callout */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-navy-900 via-navy-800 to-emerald-950 p-8 sm:p-12 shadow-card text-white">
          <div className="max-w-2xl space-y-4 relative z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Next-Gen Travel AI</span>
            </div>
            <h3 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Build a Bespoke Day-Wise Itinerary in Seconds
            </h3>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Don't spend hours searching disjointed travel blogs. Tell our smart engine your destination, duration, budget, and travel interests—and receive a morning-to-night personalized schedule with realistic cost estimates.
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <Link
                to="/planner"
                className="px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-navy-950 font-extrabold text-xs sm:text-sm shadow-lg shadow-emerald-500/20 flex items-center gap-2 transition-all transform active:scale-95"
              >
                <Sparkles className="w-4 h-4" />
                <span>Launch Smart Trip Planner</span>
              </Link>
              <Link
                to="/calculator"
                className="px-6 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm border border-white/20 transition-colors"
              >
                Calculate Travel Budget
              </Link>
            </div>
          </div>

          <div className="hidden lg:block absolute right-8 top-1/2 -translate-y-1/2 opacity-20 hover:opacity-30 transition-opacity">
            <Compass className="w-80 h-80 text-emerald-400 stroke-1" />
          </div>
        </div>
      </section>

      {/* 5. Popular Travel Packages Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-emerald-50 text-emerald-700 border border-emerald-100 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Curated Holiday Packages</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-navy-900 tracking-tight font-sans">
              Popular Travel Experiences
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Complete itineraries bundled with boutique stays, private transit, and guided excursions.
            </p>
          </div>

          <Link
            to="/packages"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-emerald-700 hover:text-emerald-800 hover:underline group"
          >
            <span>View All Packages</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredPackages.map((pkg) => (
            <PackageCard key={pkg.id} packageData={pkg} />
          ))}
        </div>
      </section>

      {/* 6. Why Choose Us Section */}
      <WhyChooseUs />

      {/* 7. Customer Testimonials Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-emerald-50 text-emerald-700 border border-emerald-100 mb-3">
            <Quote className="w-3.5 h-3.5 text-emerald-600" />
            <span>Community Stories</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-900 tracking-tight font-sans">
            Loved by Travellers Worldwide
          </h2>
          <p className="text-sm text-slate-500 mt-2">
            Read real feedback from wanderers who designed and booked their journeys with Travelora.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.id}
              className="bg-white rounded-3xl p-6 border border-slate-100 shadow-subtle hover:shadow-card-hover transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                <StarRating rating={t.rating} showCount={false} />
                <p className="text-xs text-slate-600 leading-relaxed italic">
                  "{t.comment}"
                </p>
              </div>

              <div className="pt-5 border-t border-slate-100 flex items-center gap-3 mt-6">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-10 h-10 rounded-full object-cover border border-emerald-500"
                />
                <div>
                  <h4 className="text-xs font-bold text-navy-900">{t.name}</h4>
                  <p className="text-[11px] text-slate-400">{t.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. Newsletter Section */}
      <Newsletter />
    </div>
  );
};
