import React from 'react';
import { Compass, Sparkles, Target, Eye, Shield, Users, Award, Code2, Heart } from 'lucide-react';

export const AboutPage = () => {
  const team = [
    {
      name: "Ansh Sharma",
      role: "Lead Full-Stack Architect & Product Designer",
      bio: "Computer Science student specializing in scalable web architectures, AI algorithms, and intuitive modern interfaces.",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80"
    },
    {
      name: "Dr. K. Ramanathan",
      role: "Project Mentor & Research Guide",
      bio: "Senior Professor of Software Engineering with 18+ years of mentorship in distributed systems and human-computer interaction.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80"
    },
    {
      name: "Rhea Sen",
      role: "UI/UX Researcher & Systems Testing",
      bio: "Final-year engineering student passionate about accessible design systems, fluid motion typography, and data visualization.",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"
    }
  ];

  return (
    <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      
      {/* Hero Intro */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-emerald-50 text-emerald-700 border border-emerald-100">
          <Compass className="w-3.5 h-3.5 text-emerald-600" />
          <span>Our Story & Vision</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-navy-900 font-sans">
          Reinventing How the World Explores
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          TRAVELORA was conceptualized as an advanced university capstone project to bridge the gap between chaotic multi-tab trip planning and rigid, opaque traditional travel agency pricing.
        </p>
      </div>

      {/* Mission & Vision Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Mission */}
        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-card space-y-4 relative overflow-hidden group">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <Target className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-navy-900 font-sans">Our Mission</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            To democratize personalized travel planning by combining smart algorithmic itinerary generation, crystal-clear cost transparency, and verified boutique experiences that empower every traveller to roam with absolute confidence.
          </p>
        </div>

        {/* Vision */}
        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-card space-y-4 relative overflow-hidden group">
          <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center">
            <Eye className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-navy-900 font-sans">Our Vision</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            To become the benchmark standard for next-generation tourism technology—where intelligent software understands traveler cadence, eliminates budgeting guesswork, and supports sustainable regional tourism.
          </p>
        </div>

      </div>

      {/* Why We Built Travelora */}
      <div className="bg-gradient-to-r from-navy-950 via-navy-900 to-emerald-950 text-white rounded-3xl p-8 sm:p-12 shadow-card space-y-6">
        <div className="max-w-2xl space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
            The Problem We Solved
          </span>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
            Why We Created This Platform
          </h3>
          <p className="text-sm text-slate-300 leading-relaxed">
            Every vacation planner faces the same frustrations: spending 20+ hours piecing together random blog itineraries, struggling with unpredictable transit costs, and having zero visibility into what a trip truly expenses.
          </p>
          <p className="text-sm text-slate-300 leading-relaxed">
            TRAVELORA solves this in one unified platform: generating realistic day-wise itineraries, providing instant budget forecasting by category, and offering verified turnkey holiday packages with instant confirmation vouchers.
          </p>
        </div>
      </div>

      {/* University Major Project Showcase Note */}
      <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-3xl p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-emerald-800 text-xs font-bold uppercase tracking-wider">
            <Award className="w-4 h-4 text-emerald-600" />
            <span>Academic Capstone Accreditation</span>
          </div>
          <h3 className="text-xl font-bold text-navy-900">
            B.Tech Final Year / Major Project 2026
          </h3>
          <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
            Architected and demonstrated as an end-to-end full-stack web application implementing client-side state machine design, responsive Tailwind CSS layouts, modular component design, and persistent offline demo synchronization.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="px-3.5 py-1.5 rounded-xl bg-white border border-emerald-300 text-emerald-800 text-xs font-bold shadow-xs">
            React 18 + Vite
          </span>
          <span className="px-3.5 py-1.5 rounded-xl bg-white border border-emerald-300 text-emerald-800 text-xs font-bold shadow-xs">
            Tailwind CSS
          </span>
        </div>
      </div>

      {/* Team Section */}
      <div className="space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-900 font-sans">
            The Minds Behind Travelora
          </h2>
          <p className="text-xs text-slate-500">
            Dedicated engineers and designers committed to crafting world-class digital travel experiences.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {team.map((member, i) => (
            <div
              key={i}
              className="bg-white rounded-3xl p-6 border border-slate-100 shadow-subtle hover:shadow-card transition-all text-center space-y-4"
            >
              <img
                src={member.avatar}
                alt={member.name}
                className="w-24 h-24 rounded-full object-cover mx-auto border-2 border-emerald-500 shadow-md"
              />
              <div>
                <h4 className="text-base font-bold text-navy-900">{member.name}</h4>
                <p className="text-xs font-semibold text-emerald-700">{member.role}</p>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {member.bio}
              </p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
