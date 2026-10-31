import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Mail, Phone, MapPin, Heart, Shield, Sparkles, Award } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-navy-950 text-slate-300 pt-16 pb-8 border-t border-navy-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-navy-800/80">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-md">
                <Compass className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-extrabold tracking-tight text-white font-sans">
                  TRAVELORA<span className="text-emerald-400">.</span>
                </span>
                <span className="text-[10px] uppercase tracking-widest font-semibold text-emerald-400 -mt-1">
                  Explore the World. Your Way.
                </span>
              </div>
            </Link>

            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              TRAVELORA is an intelligent travel and tourism platform fusing next-generation AI trip itinerary synthesis, verified boutique holiday packages, and transparent dynamic budget calculation.
            </p>

            <div className="flex items-center gap-2 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950/60 text-emerald-400 border border-emerald-800/60">
                <Sparkles className="w-3.5 h-3.5" />
                University Major Project 2026
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-navy-800 text-slate-300 border border-navy-700">
                <Award className="w-3.5 h-3.5 text-amber-400" />
                TravelTech Prototype
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">Platform</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/explore" className="text-slate-400 hover:text-emerald-400 transition-colors">
                  Explore Destinations
                </Link>
              </li>
              <li>
                <Link to="/packages" className="text-slate-400 hover:text-emerald-400 transition-colors">
                  Curated Tour Packages
                </Link>
              </li>
              <li>
                <Link to="/planner" className="text-slate-400 hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  <span>AI Smart Planner</span>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded font-bold">NEW</span>
                </Link>
              </li>
              <li>
                <Link to="/calculator" className="text-slate-400 hover:text-emerald-400 transition-colors">
                  Budget Calculator
                </Link>
              </li>
              <li>
                <Link to="/trips" className="text-slate-400 hover:text-emerald-400 transition-colors">
                  My Trips Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Discover Highlights */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">Top Destinations</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/destination/ladakh-india" className="text-slate-400 hover:text-emerald-400 transition-colors">
                  Ladakh, India
                </Link>
              </li>
              <li>
                <Link to="/destination/goa-beaches-india" className="text-slate-400 hover:text-emerald-400 transition-colors">
                  Goa Beaches
                </Link>
              </li>
              <li>
                <Link to="/destination/swiss-alps-switzerland" className="text-slate-400 hover:text-emerald-400 transition-colors">
                  Swiss Alps
                </Link>
              </li>
              <li>
                <Link to="/destination/bali-indonesia" className="text-slate-400 hover:text-emerald-400 transition-colors">
                  Bali Island
                </Link>
              </li>
              <li>
                <Link to="/destination/tokyo-japan" className="text-slate-400 hover:text-emerald-400 transition-colors">
                  Tokyo & Kyoto
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Coordinates */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">Get in Touch</h4>
            <div className="space-y-3 text-sm text-slate-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>Innovation Hub, Tech Park, Bangalore, KA, India</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>support@travelora.platform</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>+91 (080) 4120-9988</span>
              </div>
              <div className="pt-1">
                <Link
                  to="/admin"
                  className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-emerald-300 border border-navy-700 hover:border-emerald-500 px-3 py-1.5 rounded-lg transition-colors"
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>Admin Management Area</span>
                </Link>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} TRAVELORA Technologies. All Rights Reserved. University Major Capstone Project.</p>
          <div className="flex items-center gap-6">
            <Link to="/about" className="hover:text-slate-400 transition-colors">About Us</Link>
            <Link to="/contact" className="hover:text-slate-400 transition-colors">Support & FAQs</Link>
            <span className="text-slate-600">|</span>
            <span className="text-emerald-500/80 font-medium">Demo Mode (Non-Commercial)</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
