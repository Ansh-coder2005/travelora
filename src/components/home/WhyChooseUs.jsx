import React from 'react';
import { Sparkles, ShieldCheck, Calculator, Clock, Award, Compass } from 'lucide-react';

export const WhyChooseUs = () => {
  const features = [
    {
      icon: Sparkles,
      title: "AI Smart Trip Engine",
      description: "Generates realistic, day-wise itineraries with morning, afternoon, and evening attractions, food recommendations, and budget balancing."
    },
    {
      icon: Calculator,
      title: "Interactive Budget Calculator",
      description: "Dynamic expense simulations covering accommodations, food, transportation, and activities with visual charts and per-traveller estimates."
    },
    {
      icon: ShieldCheck,
      title: "Curated & Verified Packages",
      description: "Every holiday itinerary is built with 4-star boutique stays, reliable private vehicles, and certified local mountain/cultural guides."
    },
    {
      icon: Award,
      title: "Next-Gen TravelTech Architecture",
      description: "Fast, responsive single-page experience powered by modern React 18, Tailwind CSS, LocalStorage persistence, and fluid animations."
    }
  ];

  return (
    <section className="py-20 bg-white border-y border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-emerald-50 text-emerald-700 border border-emerald-100 mb-3">
            <Compass className="w-3.5 h-3.5 text-emerald-600" />
            <span>Why Choose Travelora</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-navy-900 font-sans">
            Crafted for the Modern Globetrotter
          </h2>
          <p className="text-base text-slate-600 mt-3 leading-relaxed">
            We replaced obsolete travel agencies with a smart, transparent platform that gives you total control over your travel plans, budget, and bookings.
          </p>
        </div>

        {/* 4 Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feat, index) => {
            const Icon = feat.icon;
            return (
              <div
                key={index}
                className="p-8 rounded-3xl bg-slate-50/70 border border-slate-100/80 hover:bg-white hover:border-emerald-200 hover:shadow-card-hover transition-all duration-300 group"
              >
                <div className="w-13 h-13 rounded-2xl bg-white border border-slate-200/60 shadow-sm flex items-center justify-center text-emerald-600 mb-6 group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-navy-900 mb-2 font-sans group-hover:text-emerald-700 transition-colors">
                  {feat.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {feat.description}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
