import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  MapPin, 
  Calendar, 
  Wallet, 
  Users, 
  Compass, 
  Bookmark, 
  Printer, 
  Sun, 
  Coffee, 
  Moon, 
  Utensils, 
  CheckCircle2, 
  DollarSign, 
  Bot, 
  ArrowRight,
  RefreshCw,
  Info
} from 'lucide-react';
import { generateSmartItinerary } from '../utils/aiPlanner';
import { useTravel } from '../context/TravelContext';
import { useToast } from '../context/ToastContext';
import { formatCurrency } from '../utils/formatters';

const INTEREST_OPTIONS = [
  "Culture & Heritage",
  "Adventure & Treks",
  "Sightseeing",
  "Local Food & Cafes",
  "Photography",
  "Nature & Wildlife",
  "Relaxation & Spa",
  "Nightlife & Music"
];

const STYLE_OPTIONS = [
  { id: "Budget", label: "Budget Backpacker", desc: "Cozy hostels, local transit & street food" },
  { id: "Adventure", label: "Active Explorer", desc: "Moderate hotels, outdoor excursions & tours" },
  { id: "Relaxation", label: "Leisure & Wellness", desc: "Tranquil 4-star resorts & scenic views" },
  { id: "Luxury", label: "Luxury Indulgence", desc: "5-star boutique stays, private transit & fine dining" }
];

export const AIPlannerPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { savePlannedTrip, destinations } = useTravel();
  const { addToast } = useToast();

  const initialDest = searchParams.get('dest') || 'Ladakh';

  // Form State
  const [destination, setDestination] = useState(initialDest);
  const [days, setDays] = useState(4);
  const [budget, setBudget] = useState(30000);
  const [travellers, setTravellers] = useState(2);
  const [travelStyle, setTravelStyle] = useState('Adventure');
  const [selectedInterests, setSelectedInterests] = useState([
    "Culture & Heritage",
    "Sightseeing",
    "Local Food & Cafes"
  ]);

  // Generation status
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState('');
  const [generatedPlan, setGeneratedPlan] = useState(null);

  // Auto-generate initial itinerary on first load if dest provided
  useEffect(() => {
    handleGeneratePlan();
  }, []);

  const toggleInterest = (interest) => {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.length > 1
          ? prev.filter((i) => i !== interest)
          : prev
        : [...prev, interest]
    );
  };

  const handleGeneratePlan = () => {
    if (!destination.trim()) {
      addToast('Please specify a destination.', 'error');
      return;
    }

    setIsGenerating(true);
    setGenerationStep('Analyzing destination terrain and seasonality...');

    setTimeout(() => {
      setGenerationStep('Balancing morning, afternoon, and evening routes...');
    }, 400);

    setTimeout(() => {
      setGenerationStep('Estimating meal, transit, and attraction budgets...');
    }, 800);

    setTimeout(() => {
      const plan = generateSmartItinerary({
        destinationName: destination,
        days,
        budget,
        travellers,
        interests: selectedInterests,
        travelStyle
      });

      setGeneratedPlan(plan);
      setIsGenerating(false);
      setGenerationStep('');
      addToast(`Personalized itinerary for ${destination} generated!`, 'success');
    }, 1200);
  };

  const handleSaveToDashboard = () => {
    if (!generatedPlan) return;
    savePlannedTrip(generatedPlan);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-emerald-50 text-emerald-700 border border-emerald-100">
          <Bot className="w-4 h-4 text-emerald-600" />
          <span>Intelligent Travel Engine</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-navy-900 font-sans">
          AI Smart Trip Planner
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Specify your dream destination, budget, group size, and interests. Our deterministic AI rule engine synthesizes a realistic, day-wise schedule with morning, afternoon, and evening experiences.
        </p>
      </div>

      {/* Planner Builder Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-card border border-slate-100 space-y-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Destination Input */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-emerald-600" />
              <span>Target Destination</span>
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="e.g. Ladakh, Bali, Goa, Tokyo..."
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-semibold text-navy-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            {/* Quick destination tags */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {['Ladakh', 'Goa', 'Bali', 'Swiss Alps', 'Tokyo'].map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDestination(d)}
                  className="text-[10px] bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 px-2 py-0.5 rounded-md font-semibold text-slate-600 transition-colors"
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Number of Days */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-emerald-600" />
                <span>Trip Duration</span>
              </label>
              <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                {days} Days
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              step="1"
              value={days}
              onChange={(e) => setDays(parseInt(e.target.value))}
              className="w-full accent-emerald-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-semibold">
              <span>1 Day</span>
              <span>5 Days</span>
              <span>10 Days</span>
            </div>
          </div>

          {/* Travel Budget */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider flex items-center gap-1.5">
                <Wallet className="w-4 h-4 text-emerald-600" />
                <span>Total Budget</span>
              </label>
              <span className="text-xs font-extrabold text-navy-900">
                {formatCurrency(budget)}
              </span>
            </div>
            <input
              type="range"
              min="10000"
              max="200000"
              step="5000"
              value={budget}
              onChange={(e) => setBudget(parseInt(e.target.value))}
              className="w-full accent-emerald-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-semibold">
              <span>₹10,000</span>
              <span>₹1,00,000</span>
              <span>₹2,00,000</span>
            </div>
          </div>

          {/* Number of Travellers */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider flex items-center gap-1.5">
              <Users className="w-4 h-4 text-emerald-600" />
              <span>Group Size</span>
            </label>
            <div className="flex items-center border border-slate-200 rounded-2xl bg-slate-50 px-3 py-2">
              <button
                type="button"
                onClick={() => setTravellers((prev) => Math.max(1, prev - 1))}
                className="w-8 h-8 rounded-xl bg-white border border-slate-200 font-bold text-navy-900 hover:bg-slate-100 flex items-center justify-center"
              >
                -
              </button>
              <span className="flex-1 text-center font-bold text-sm text-navy-900">
                {travellers} {travellers > 1 ? 'Travellers' : 'Solo'}
              </span>
              <button
                type="button"
                onClick={() => setTravellers((prev) => Math.min(10, prev + 1))}
                className="w-8 h-8 rounded-xl bg-white border border-slate-200 font-bold text-navy-900 hover:bg-slate-100 flex items-center justify-center"
              >
                +
              </button>
            </div>
          </div>

        </div>

        {/* Travel Style Selector */}
        <div className="space-y-3 pt-4 border-t border-slate-100">
          <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider">
            Travel Style & Comfort Level
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {STYLE_OPTIONS.map((style) => (
              <button
                key={style.id}
                type="button"
                onClick={() => setTravelStyle(style.id)}
                className={`p-4 rounded-2xl text-left border transition-all ${
                  travelStyle === style.id
                    ? 'border-emerald-500 bg-emerald-50/60 shadow-xs ring-1 ring-emerald-500'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <span className="font-bold text-xs text-navy-900 block">{style.label}</span>
                <span className="text-[11px] text-slate-500 leading-tight mt-1 block">{style.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Interests Multi-Select Chips */}
        <div className="space-y-3 pt-4 border-t border-slate-100">
          <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider">
            Primary Travel Interests & Vibes (Select all that apply)
          </label>
          <div className="flex flex-wrap gap-2">
            {INTEREST_OPTIONS.map((interest) => {
              const isSelected = selectedInterests.includes(interest);
              return (
                <button
                  key={interest}
                  type="button"
                  onClick={() => toggleInterest(interest)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-navy-900 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                  <span>{interest}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Info className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>Deterministic rule-based AI engine: no external paid API tokens required.</span>
          </div>

          <button
            type="button"
            disabled={isGenerating}
            onClick={handleGeneratePlan}
            className="px-8 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm shadow-lg shadow-emerald-600/30 flex items-center gap-2 transition-all transform active:scale-95 disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>{generationStep || 'Generating Itinerary...'}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Smart Itinerary</span>
              </>
            )}
          </button>
        </div>

      </div>

      {/* Generated Itinerary Display */}
      {generatedPlan && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 print:text-black">
          
          {/* Summary Banner Card */}
          <div className="bg-gradient-to-r from-navy-950 via-navy-900 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {generatedPlan.travelStyle} Style
                </span>
                <span className="text-xs text-slate-300">
                  {generatedPlan.days} Days • {generatedPlan.travellers} {generatedPlan.travellers > 1 ? 'Travellers' : 'Solo'}
                </span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
                {generatedPlan.destination} Adventure Itinerary
              </h2>
              <p className="text-xs text-slate-300 max-w-xl">
                {generatedPlan.aiRecommendationNote}
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-3 print:hidden">
              <button
                onClick={handleSaveToDashboard}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold flex items-center gap-2 transition-colors"
              >
                <Bookmark className="w-4 h-4 text-emerald-400" />
                <span>Save to My Trips</span>
              </button>
              <button
                onClick={handlePrint}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold flex items-center gap-2 transition-colors"
              >
                <Printer className="w-4 h-4" />
                <span>Print / PDF</span>
              </button>
            </div>
          </div>

          {/* Budget Feasibility Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-subtle">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Total Estimated Cost
              </span>
              <p className="text-2xl font-extrabold text-navy-900">
                {formatCurrency(generatedPlan.totalEstimatedCost)}
              </p>
              <span className="text-xs text-slate-500">
                Covers hotel, food, transit & activities
              </span>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-subtle">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Cost Per Traveller
              </span>
              <p className="text-2xl font-extrabold text-emerald-700">
                {formatCurrency(generatedPlan.costPerTraveller)}
              </p>
              <span className="text-xs text-slate-500">
                For the entire {generatedPlan.days}-day stay
              </span>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-subtle">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Budget Alignment
              </span>
              <p className={`text-base font-extrabold ${generatedPlan.totalEstimatedCost <= generatedPlan.totalBudgetRequested ? 'text-emerald-600' : 'text-amber-600'}`}>
                {generatedPlan.budgetStatus}
              </p>
              <span className="text-xs text-slate-500">
                Target budget: {formatCurrency(generatedPlan.totalBudgetRequested)}
              </span>
            </div>
          </div>

          {/* Day-Wise Timeline */}
          <div className="space-y-6">
            <h3 className="text-xl font-extrabold text-navy-900 font-sans">
              Day-by-Day Detailed Itinerary
            </h3>

            <div className="space-y-6">
              {generatedPlan.daysItinerary.map((dayData) => (
                <div
                  key={dayData.day}
                  className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-subtle space-y-6"
                >
                  {/* Day Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
                    <div className="flex items-center gap-3">
                      <span className="w-10 h-10 rounded-2xl bg-emerald-600 text-white font-extrabold text-sm flex items-center justify-center shadow-sm">
                        D{dayData.day}
                      </span>
                      <div>
                        <h4 className="text-base font-extrabold text-navy-900">
                          Day {dayData.day}: {dayData.theme}
                        </h4>
                        <p className="text-xs text-slate-500">
                          Estimated day expenses: ~{formatCurrency(dayData.estimatedDailyExpenses.total)} (Entire group)
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                      <span>Stay: {formatCurrency(dayData.estimatedDailyExpenses.hotel)}</span>
                      <span>•</span>
                      <span>Food: {formatCurrency(dayData.estimatedDailyExpenses.food)}</span>
                    </div>
                  </div>

                  {/* 3 Phases: Morning, Afternoon, Evening */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    
                    {/* Morning */}
                    <div className="p-4 rounded-2xl bg-amber-50/40 border border-amber-100 space-y-2">
                      <div className="flex items-center gap-2 text-amber-700 text-xs font-bold uppercase tracking-wider">
                        <Sun className="w-4 h-4" />
                        <span>Morning (08:30 – 12:30)</span>
                      </div>
                      <h5 className="text-sm font-bold text-navy-900">{dayData.morning.title}</h5>
                      <p className="text-xs text-slate-600 leading-relaxed">{dayData.morning.desc}</p>
                      <div className="pt-2 text-[11px] text-amber-900 font-medium">
                        <strong>Spot:</strong> {dayData.morning.spot}
                      </div>
                    </div>

                    {/* Afternoon */}
                    <div className="p-4 rounded-2xl bg-cyan-50/40 border border-cyan-100 space-y-2">
                      <div className="flex items-center gap-2 text-cyan-700 text-xs font-bold uppercase tracking-wider">
                        <Coffee className="w-4 h-4" />
                        <span>Afternoon (13:30 – 17:00)</span>
                      </div>
                      <h5 className="text-sm font-bold text-navy-900">{dayData.afternoon.title}</h5>
                      <p className="text-xs text-slate-600 leading-relaxed">{dayData.afternoon.desc}</p>
                      <div className="pt-2 text-[11px] text-cyan-900 font-medium">
                        <strong>Spot:</strong> {dayData.afternoon.spot}
                      </div>
                    </div>

                    {/* Evening */}
                    <div className="p-4 rounded-2xl bg-indigo-50/40 border border-indigo-100 space-y-2">
                      <div className="flex items-center gap-2 text-indigo-700 text-xs font-bold uppercase tracking-wider">
                        <Moon className="w-4 h-4" />
                        <span>Evening (18:00 – 21:30)</span>
                      </div>
                      <h5 className="text-sm font-bold text-navy-900">{dayData.evening.title}</h5>
                      <p className="text-xs text-slate-600 leading-relaxed">{dayData.evening.desc}</p>
                      <div className="pt-2 text-[11px] text-indigo-900 font-medium">
                        <strong>Spot:</strong> {dayData.evening.spot}
                      </div>
                    </div>

                  </div>

                  {/* Food & Dining Recommendations for the day */}
                  <div className="pt-2 border-t border-slate-100 flex items-start gap-3 bg-slate-50 p-3.5 rounded-2xl text-xs text-slate-600">
                    <Utensils className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-navy-900">Recommended Culinary Experiences: </strong>
                      Breakfast: {dayData.foodRecommendations.breakfast} | Dinner: {dayData.foodRecommendations.dinner}
                    </div>
                  </div>

                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
