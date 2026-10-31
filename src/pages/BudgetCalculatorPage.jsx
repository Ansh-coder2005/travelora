import React, { useState } from 'react';
import { 
  Calculator, 
  RotateCcw, 
  Users, 
  Calendar, 
  Car, 
  Building2, 
  Utensils, 
  Compass, 
  ShoppingBag,
  Sparkles,
  PieChart as PieChartIcon,
  CheckCircle2,
  Copy
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { formatCurrency } from '../utils/formatters';
import { useToast } from '../context/ToastContext';

const COLORS = ['#059669', '#0284c7', '#d97706', '#8b5cf6', '#ec4899'];

const PRESETS = [
  {
    name: 'Backpacker Budget',
    travellers: 1,
    days: 5,
    transport: 4000,
    hotelPerNight: 1200,
    foodPerDay: 600,
    activities: 2500,
    other: 1500
  },
  {
    name: 'Couple Vacation',
    travellers: 2,
    days: 6,
    transport: 14000,
    hotelPerNight: 3500,
    foodPerDay: 1800,
    activities: 8000,
    other: 4000
  },
  {
    name: 'Family Luxury',
    travellers: 4,
    days: 7,
    transport: 35000,
    hotelPerNight: 9000,
    foodPerDay: 4500,
    activities: 20000,
    other: 12000
  }
];

export const BudgetCalculatorPage = () => {
  const { addToast } = useToast();

  const [travellers, setTravellers] = useState(2);
  const [days, setDays] = useState(5);

  // Expense categories
  const [transport, setTransport] = useState(12000);
  const [hotelPerNight, setHotelPerNight] = useState(3000);
  const [foodPerDay, setFoodPerDay] = useState(1500);
  const [activities, setActivities] = useState(6000);
  const [other, setOther] = useState(3000);

  // Calculations
  const totalHotel = hotelPerNight * days;
  const totalFood = foodPerDay * days * travellers;
  const totalTransport = transport * travellers;
  const totalActivities = activities * travellers;
  const totalOther = other;

  const grandTotal = totalTransport + totalHotel + totalFood + totalActivities + totalOther;
  const perPersonTotal = Math.round(grandTotal / (travellers || 1));
  const perDayPerPerson = Math.round(perPersonTotal / (days || 1));

  const chartData = [
    { name: 'Accommodations', value: totalHotel },
    { name: 'Transportation', value: totalTransport },
    { name: 'Food & Dining', value: totalFood },
    { name: 'Activities & Tours', value: totalActivities },
    { name: 'Miscellaneous', value: totalOther },
  ].filter(item => item.value > 0);

  const applyPreset = (preset) => {
    setTravellers(preset.travellers);
    setDays(preset.days);
    setTransport(preset.transport);
    setHotelPerNight(preset.hotelPerNight);
    setFoodPerDay(preset.foodPerDay);
    setActivities(preset.activities);
    setOther(preset.other);
    addToast(`Applied preset: ${preset.name}`, 'info');
  };

  const handleReset = () => {
    applyPreset(PRESETS[1]);
  };

  const handleCopySummary = () => {
    const text = `TRAVELORA Budget Estimation:
Destination Trip: ${days} Days for ${travellers} travellers
Total Estimated Cost: ${formatCurrency(grandTotal)}
Cost Per Traveller: ${formatCurrency(perPersonTotal)}
Breakdown:
- Stay: ${formatCurrency(totalHotel)}
- Transport: ${formatCurrency(totalTransport)}
- Food: ${formatCurrency(totalFood)}
- Activities: ${formatCurrency(totalActivities)}
- Misc: ${formatCurrency(totalOther)}`;

    navigator.clipboard?.writeText(text);
    addToast('Budget summary copied to clipboard!', 'success');
  };

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-emerald-50 text-emerald-700 border border-emerald-100">
          <Calculator className="w-3.5 h-3.5 text-emerald-600" />
          <span>Trip Cost Estimator</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-navy-900 font-sans">
          Travel Budget Calculator
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Simulate realistic travel expenditure across stays, transportation, food, and excursions with instant visual cost breakdowns and per-person allocations.
        </p>
      </div>

      {/* Preset Selector */}
      <div className="flex items-center justify-center gap-2 flex-wrap">
        <span className="text-xs font-bold text-slate-500 mr-2">Quick Presets:</span>
        {PRESETS.map((p, i) => (
          <button
            key={i}
            onClick={() => applyPreset(p)}
            className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-white border border-slate-200 text-navy-900 hover:border-emerald-500 hover:bg-emerald-50 transition-all shadow-xs"
          >
            {p.name}
          </button>
        ))}
        <button
          onClick={handleReset}
          className="px-3.5 py-1.5 rounded-full text-xs font-bold text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-colors flex items-center gap-1"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      {/* Main Grid: Inputs vs Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Interactive Inputs (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-card space-y-6">
          <h2 className="text-lg font-extrabold text-navy-900 font-sans border-b border-slate-100 pb-3">
            Trip Parameters & Estimates
          </h2>

          {/* Group & Duration controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Travellers Count */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-navy-900 flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-emerald-600" />
                  <span>Travellers</span>
                </span>
                <span className="text-xs font-extrabold text-navy-900">{travellers}</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={travellers}
                onChange={(e) => setTravellers(parseInt(e.target.value))}
                className="w-full accent-emerald-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
              />
            </div>

            {/* Duration Days */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-navy-900 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-emerald-600" />
                  <span>Duration (Days)</span>
                </span>
                <span className="text-xs font-extrabold text-navy-900">{days} Days</span>
              </div>
              <input
                type="range"
                min="1"
                max="21"
                value={days}
                onChange={(e) => setDays(parseInt(e.target.value))}
                className="w-full accent-emerald-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
              />
            </div>

          </div>

          {/* Sliders for Expenses */}
          <div className="space-y-5 pt-2">
            
            {/* 1. Hotel Per Night */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-navy-900 flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-emerald-600" />
                  <span>Hotel / Stay per Night:</span>
                </span>
                <span className="text-emerald-700 font-extrabold">{formatCurrency(hotelPerNight)}</span>
              </div>
              <input
                type="range"
                min="500"
                max="25000"
                step="250"
                value={hotelPerNight}
                onChange={(e) => setHotelPerNight(parseInt(e.target.value))}
                className="w-full accent-emerald-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>Total Stay ({days} nights): {formatCurrency(totalHotel)}</span>
              </div>
            </div>

            {/* 2. Transportation per person */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-navy-900 flex items-center gap-1.5">
                  <Car className="w-4 h-4 text-sky-600" />
                  <span>Transportation (Flights / Trains / Cabs per person):</span>
                </span>
                <span className="text-sky-700 font-extrabold">{formatCurrency(transport)}</span>
              </div>
              <input
                type="range"
                min="1000"
                max="60000"
                step="500"
                value={transport}
                onChange={(e) => setTransport(parseInt(e.target.value))}
                className="w-full accent-sky-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>Group Transit ({travellers} pax): {formatCurrency(totalTransport)}</span>
              </div>
            </div>

            {/* 3. Food per person per day */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-navy-900 flex items-center gap-1.5">
                  <Utensils className="w-4 h-4 text-amber-600" />
                  <span>Food & Dining per person / day:</span>
                </span>
                <span className="text-amber-700 font-extrabold">{formatCurrency(foodPerDay)}</span>
              </div>
              <input
                type="range"
                min="300"
                max="8000"
                step="100"
                value={foodPerDay}
                onChange={(e) => setFoodPerDay(parseInt(e.target.value))}
                className="w-full accent-amber-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>Total Food ({days} days, {travellers} pax): {formatCurrency(totalFood)}</span>
              </div>
            </div>

            {/* 4. Activities per person */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-navy-900 flex items-center gap-1.5">
                  <Compass className="w-4 h-4 text-purple-600" />
                  <span>Activities, Safaris & Passes per person:</span>
                </span>
                <span className="text-purple-700 font-extrabold">{formatCurrency(activities)}</span>
              </div>
              <input
                type="range"
                min="500"
                max="30000"
                step="500"
                value={activities}
                onChange={(e) => setActivities(parseInt(e.target.value))}
                className="w-full accent-purple-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>Total Activities ({travellers} pax): {formatCurrency(totalActivities)}</span>
              </div>
            </div>

            {/* 5. Miscellaneous */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-navy-900 flex items-center gap-1.5">
                  <ShoppingBag className="w-4 h-4 text-pink-600" />
                  <span>Shopping & Contingency Fund (Total):</span>
                </span>
                <span className="text-pink-700 font-extrabold">{formatCurrency(other)}</span>
              </div>
              <input
                type="range"
                min="0"
                max="25000"
                step="500"
                value={other}
                onChange={(e) => setOther(parseInt(e.target.value))}
                className="w-full accent-pink-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
              />
            </div>

          </div>
        </div>

        {/* Right Column: Visual Breakdown & Summary (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Grand Total Hero Box */}
          <div className="bg-gradient-to-br from-navy-900 via-navy-800 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 shadow-card space-y-4">
            <span className="text-xs font-bold tracking-wider uppercase text-emerald-300 block">
              Calculated Grand Total
            </span>
            <div className="text-3xl sm:text-4xl font-extrabold text-white font-sans">
              {formatCurrency(grandTotal)}
            </div>

            <div className="pt-3 border-t border-white/10 grid grid-cols-2 gap-4">
              <div>
                <span className="text-[11px] text-slate-300 block font-medium">Per Traveller</span>
                <span className="text-lg font-bold text-emerald-400">{formatCurrency(perPersonTotal)}</span>
              </div>
              <div>
                <span className="text-[11px] text-slate-300 block font-medium">Daily Cost / Person</span>
                <span className="text-lg font-bold text-emerald-400">{formatCurrency(perDayPerPerson)}</span>
              </div>
            </div>

            <button
              onClick={handleCopySummary}
              className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 flex items-center justify-center gap-2 transition-colors pt-2"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Detailed Budget Breakdown</span>
            </button>
          </div>

          {/* Recharts Pie Breakdown */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-card space-y-4">
            <div className="flex items-center gap-2">
              <PieChartIcon className="w-4 h-4 text-emerald-600" />
              <h3 className="text-sm font-bold text-navy-900">Expense Distribution</h3>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val) => formatCurrency(val)}
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderRadius: '12px',
                      color: '#ffffff',
                      fontSize: '12px',
                      border: 'none',
                    }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    iconType="circle"
                    wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Itemized Table */}
            <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
              {chartData.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center text-slate-600">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                    />
                    <span>{item.name}</span>
                  </div>
                  <span className="font-bold text-navy-900">{formatCurrency(item.value)}</span>
                </div>
              ))}
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
