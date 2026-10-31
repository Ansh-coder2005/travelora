import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Calendar, Users, ShieldCheck, CreditCard, Sparkles, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTravel } from '../../context/TravelContext';
import { formatCurrency } from '../../utils/formatters';

export const BookingModal = ({ isOpen, onClose, packageData }) => {
  const { currentUser } = useAuth();
  const { createBooking } = useTravel();
  const navigate = useNavigate();

  // Tomorrow's date string YYYY-MM-DD
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDateStr = tomorrow.toISOString().split('T')[0];

  const [travelDate, setTravelDate] = useState(minDateStr);
  const [travellersCount, setTravellersCount] = useState(2);
  const [fullName, setFullName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [specialRequests, setSpecialRequests] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !packageData) return null;

  const basePrice = packageData.price;
  const subtotal = basePrice * travellersCount;
  const taxes = Math.round(subtotal * 0.18);
  const total = subtotal + taxes;

  const validate = () => {
    const errors = {};
    if (!fullName.trim()) errors.fullName = 'Lead traveller name is required.';
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) errors.email = 'Valid email is required.';
    if (!phone.trim() || phone.trim().length < 8) errors.phone = 'Valid phone number is required.';
    if (!travelDate) errors.travelDate = 'Please select a travel departure date.';
    if (travellersCount < 1) errors.travellersCount = 'At least 1 traveller is required.';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const booking = await createBooking({
        packageId: packageData.id,
        packageTitle: packageData.title,
        destination: packageData.destination,
        travelDate,
        travellersCount,
        leadTraveller: {
          fullName,
          email,
          phone,
          specialRequests
        },
        pricePerPerson: basePrice,
        image: packageData.image
      });

      setIsSubmitting(false);
      onClose();
      if (booking?.bookingId) {
        navigate(`/booking-confirmation/${booking.bookingId}`);
      } else {
        navigate('/trips');
      }
    } catch (err) {
      console.error('Booking submission error:', err);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-navy-950/70 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div 
        className="relative bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-100 overflow-hidden my-auto max-h-[94vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-navy-900 to-navy-800 text-white p-5 sm:p-6 relative flex-shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 sm:top-5 right-4 sm:right-5 p-2 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold tracking-wide uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Demo Instant Booking
            </span>
            <span className="text-xs text-slate-300">{packageData.duration}</span>
          </div>

          <h2 className="text-lg sm:text-2xl font-extrabold tracking-tight text-white pr-8">
            {packageData.title}
          </h2>
          <p className="text-xs text-slate-300 mt-1 flex items-center gap-1.5">
            <span>Destination:</span>
            <span className="font-semibold text-white">{packageData.destination}</span>
          </p>
        </div>

        {/* Demo Notice Banner */}
        <div className="bg-amber-50 border-b border-amber-200/60 px-5 sm:px-6 py-2.5 flex items-center gap-2 text-amber-800 text-xs font-medium flex-shrink-0">
          <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
          <span>Demo Simulation Mode: No payment credentials or actual card charges required.</span>
        </div>

        {/* Form Body */}
        <form onSubmit={handleBookingSubmit} className="p-5 sm:p-6 space-y-5 overflow-y-auto flex-grow">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Travel Date */}
            <div>
              <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-1.5">
                Travel Departure Date *
              </label>
              <div className="relative">
                <input
                  type="date"
                  min={minDateStr}
                  value={travelDate}
                  onChange={(e) => setTravelDate(e.target.value)}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all ${
                    formErrors.travelDate ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200 bg-slate-50/50'
                  }`}
                />
              </div>
              {formErrors.travelDate && (
                <p className="text-[11px] text-rose-500 mt-1">{formErrors.travelDate}</p>
              )}
            </div>

            {/* Travellers Count */}
            <div>
              <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-1.5">
                Number of Travellers *
              </label>
              <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50/50 px-3 py-1.5">
                <button
                  type="button"
                  onClick={() => setTravellersCount((prev) => Math.max(1, prev - 1))}
                  className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-navy-900 font-bold hover:bg-slate-100 flex items-center justify-center transition-colors"
                >
                  -
                </button>
                <div className="flex-1 text-center font-bold text-navy-900 text-sm flex items-center justify-center gap-1.5">
                  <Users className="w-4 h-4 text-emerald-600" />
                  <span>{travellersCount} Traveller{travellersCount > 1 ? 's' : ''}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setTravellersCount((prev) => Math.min(12, prev + 1))}
                  className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-navy-900 font-bold hover:bg-slate-100 flex items-center justify-center transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Lead Traveller Name */}
            <div>
              <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-1.5">
                Primary Contact Name *
              </label>
              <input
                type="text"
                placeholder="e.g. Ansh Sharma"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all ${
                  formErrors.fullName ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200 bg-slate-50/50'
                }`}
              />
              {formErrors.fullName && (
                <p className="text-[11px] text-rose-500 mt-1">{formErrors.fullName}</p>
              )}
            </div>

            {/* Lead Traveller Phone */}
            <div>
              <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-1.5">
                Phone Number *
              </label>
              <input
                type="tel"
                placeholder="e.g. +91 98765 43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all ${
                  formErrors.phone ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200 bg-slate-50/50'
                }`}
              />
              {formErrors.phone && (
                <p className="text-[11px] text-rose-500 mt-1">{formErrors.phone}</p>
              )}
            </div>

            {/* Lead Traveller Email */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-1.5">
                Email Address for Itinerary & Confirmation *
              </label>
              <input
                type="email"
                placeholder="e.g. ansh@travelora.demo"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all ${
                  formErrors.email ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200 bg-slate-50/50'
                }`}
              />
              {formErrors.email && (
                <p className="text-[11px] text-rose-500 mt-1">{formErrors.email}</p>
              )}
            </div>

            {/* Special Request */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-1.5">
                Special Requests or Dietary Preferences (Optional)
              </label>
              <textarea
                rows="2"
                placeholder="e.g. Vegetarian meals preferred, ground floor room request..."
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50/50 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none resize-none"
              ></textarea>
            </div>

          </div>

          {/* Pricing Summary Box */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-2">
            <h4 className="text-xs font-extrabold text-navy-900 uppercase tracking-wider">
              Transparent Price Summary
            </h4>
            <div className="flex justify-between text-xs text-slate-600">
              <span>{formatCurrency(basePrice)} × {travellersCount} Traveller{travellersCount > 1 ? 's' : ''}</span>
              <span className="font-semibold text-navy-900">{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between text-xs text-slate-600">
              <span>Standard Goods & Services Tax (GST 18%)</span>
              <span className="font-semibold text-navy-900">{formatCurrency(taxes)}</span>
            </div>
            <div className="border-t border-slate-200 pt-2 flex justify-between items-center text-sm font-extrabold text-navy-900">
              <span>Grand Total (Demo)</span>
              <span className="text-emerald-700 text-lg">{formatCurrency(total)}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/30 flex items-center gap-2 transition-all disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Processing Demo Booking...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Confirm Demo Booking ({formatCurrency(total)})</span>
                </>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
