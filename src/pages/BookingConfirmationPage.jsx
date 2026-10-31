import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { useTravel } from '../context/TravelContext';
import { formatCurrency, formatDate } from '../utils/formatters';
import { bookingsAPI } from '../services/api';
import { 
  CheckCircle2, 
  Printer, 
  Calendar, 
  Users, 
  Compass, 
  ShieldCheck, 
  ArrowRight,
  AlertCircle
} from 'lucide-react';

export const BookingConfirmationPage = () => {
  const { bookingId } = useParams();
  const { bookings } = useTravel();
  const [directBooking, setDirectBooking] = useState(null);

  const matched = bookings.find((b) => b.bookingId === bookingId);
  const booking = matched || directBooking || bookings[0];

  useEffect(() => {
    if (!matched && bookingId) {
      bookingsAPI.getById(bookingId)
        .then((res) => {
          if (res.success && res.booking) {
            setDirectBooking(res.booking);
          }
        })
        .catch(() => {});
    }
  }, [bookingId, matched]);

  useEffect(() => {
    // Fire celebratory confetti on page mount
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // safe fallback
    }
  }, []);

  const handlePrint = () => {
    window.print();
  };

  if (!booking) {
    return (
      <div className="py-20 text-center max-w-md mx-auto">
        <h2 className="text-xl font-bold text-navy-900 mb-2">Booking Not Found</h2>
        <p className="text-xs text-slate-500 mb-4">No matching booking reference could be retrieved.</p>
        <Link to="/trips" className="px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold">
          Go to My Trips
        </Link>
      </div>
    );
  }

  return (
    <div className="py-12 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* Top Success Banner */}
      <div className="text-center space-y-3">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md shadow-emerald-500/20">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full inline-block">
          Booking Confirmed (Demo)
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-navy-900 font-sans tracking-tight">
          Pack Your Bags, You're Traveling!
        </h1>
        <p className="text-sm text-slate-500 max-w-md mx-auto">
          Your reservation has been recorded in the platform database with reference code below.
        </p>
      </div>

      {/* Booking Voucher Receipt Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-card overflow-hidden">
        
        {/* Receipt Header */}
        <div className="bg-navy-900 text-white p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[11px] uppercase tracking-widest text-emerald-400 font-bold block mb-1">
              Official Booking Reference ID
            </span>
            <div className="text-2xl sm:text-3xl font-mono font-extrabold text-white tracking-wider">
              {booking.bookingId}
            </div>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-[11px] text-slate-400 block font-medium">Booked on</span>
            <span className="text-xs font-bold text-slate-200">
              {formatDate(booking.bookedAt)}
            </span>
          </div>
        </div>

        {/* Demo Disclaimer */}
        <div className="bg-amber-50 px-6 py-2.5 border-b border-amber-200/60 flex items-center gap-2 text-amber-800 text-xs">
          <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
          <span>Demo Simulation Notice: No financial charge took place. Simulated reservation for university project evaluation.</span>
        </div>

        {/* Package & Details Body */}
        <div className="p-6 sm:p-8 space-y-6">
          
          <div className="flex items-start gap-4 pb-6 border-b border-slate-100">
            <img
              src={booking.image}
              alt={booking.packageTitle}
              className="w-20 h-20 rounded-2xl object-cover flex-shrink-0"
            />
            <div>
              <span className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full inline-block mb-1">
                Confirmed Tour Package
              </span>
              <h2 className="text-lg font-extrabold text-navy-900">
                {booking.packageTitle}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Destination: <strong>{booking.destination}</strong>
              </p>
            </div>
          </div>

          {/* Traveler & Schedule Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="text-[11px] font-bold uppercase text-slate-400 block">Lead Traveller</span>
              <p className="font-bold text-navy-900 text-sm">{booking.leadTraveller?.fullName}</p>
              <p className="text-slate-500">{booking.leadTraveller?.email}</p>
              <p className="text-slate-500">{booking.leadTraveller?.phone}</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="text-[11px] font-bold uppercase text-slate-400 block">Trip Dates & Pax</span>
              <p className="font-bold text-navy-900 text-sm">Departure: {formatDate(booking.travelDate)}</p>
              <p className="text-slate-500">{booking.travellersCount} Confirmed Traveller{booking.travellersCount > 1 ? 's' : ''}</p>
              <p className="text-emerald-700 font-semibold">Payment Status: Verified Demo Paid</p>
            </div>
          </div>

          {/* Special Requests if any */}
          {booking.leadTraveller?.specialRequests && (
            <div className="p-3.5 rounded-xl bg-slate-50 text-xs text-slate-600">
              <strong className="text-navy-900">Special Notes: </strong>
              {booking.leadTraveller.specialRequests}
            </div>
          )}

          {/* Payment Breakdown */}
          <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Base Package Fare ({booking.travellersCount} pax × {formatCurrency(booking.pricePerPerson)}):</span>
              <span className="font-semibold text-navy-900">{formatCurrency(booking.pricePerPerson * booking.travellersCount)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Goods & Services Tax (GST 18%):</span>
              <span className="font-semibold text-navy-900">{formatCurrency(booking.taxes)}</span>
            </div>
            <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-sm font-extrabold text-navy-900">
              <span>Total Demo Amount:</span>
              <span className="text-xl text-emerald-700">{formatCurrency(booking.totalAmount)}</span>
            </div>
          </div>

        </div>

        {/* Voucher Footer Action Buttons */}
        <div className="p-6 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 print:hidden">
          <button
            onClick={handlePrint}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-navy-900 text-xs font-bold flex items-center justify-center gap-2 transition-colors"
          >
            <Printer className="w-4 h-4 text-emerald-600" />
            <span>Print / Download PDF Voucher</span>
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Link
              to="/trips"
              className="flex-1 sm:flex-none text-center px-5 py-2.5 rounded-xl bg-navy-900 hover:bg-navy-800 text-white text-xs font-bold transition-colors"
            >
              Go to My Trips
            </Link>
            <Link
              to="/explore"
              className="flex-1 sm:flex-none text-center px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors shadow-sm"
            >
              Explore More
            </Link>
          </div>
        </div>

      </div>

    </div>
  );
};
