import React, { useState } from 'react';
import { 
  Clock, 
  MapPin, 
  Building2, 
  Car, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp, 
  CalendarCheck,
  Star,
  Tag
} from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import { BookingModal } from './BookingModal';

export const PackageCard = ({ packageData }) => {
  const [showItinerary, setShowItinerary] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  const discountPercent = Math.round(
    ((packageData.originalPrice - packageData.price) / packageData.originalPrice) * 100
  );

  return (
    <>
      <div className="bg-white rounded-3xl border border-slate-100 shadow-subtle hover:shadow-card-hover transition-all duration-300 overflow-hidden flex flex-col h-full">
        
        {/* Banner Image */}
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-100 group">
          <img
            src={packageData.image}
            alt={packageData.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-emerald-600 text-white shadow-sm flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {packageData.duration}
            </span>
            {discountPercent > 0 && (
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500 text-navy-950 shadow-sm flex items-center gap-1">
                <Tag className="w-3 h-3" />
                {discountPercent}% OFF
              </span>
            )}
          </div>

          <div className="absolute bottom-3 left-3 right-3 text-white">
            <div className="flex items-center gap-1.5 text-xs text-slate-200">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <span>{packageData.destination}</span>
            </div>
            <h3 className="text-xl font-extrabold tracking-tight text-white mt-0.5">
              {packageData.title}
            </h3>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-6 flex flex-col flex-grow justify-between gap-5">
          
          <div className="space-y-4">
            {/* Overview */}
            <p className="text-xs text-slate-600 leading-relaxed">
              {packageData.overview}
            </p>

            {/* Stay & Transport Specs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="flex items-start gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <Building2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-navy-900 block">Accommodations</span>
                  <span className="text-slate-500 line-clamp-1">{packageData.hotelInfo}</span>
                </div>
              </div>
              <div className="flex items-start gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <Car className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-navy-900 block">Transportation</span>
                  <span className="text-slate-500 line-clamp-1">{packageData.transportInfo}</span>
                </div>
              </div>
            </div>

            {/* Inclusions Snippet */}
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1.5">
                Top Inclusions
              </span>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {packageData.inclusions.slice(0, 4).map((inc, index) => (
                  <li key={index} className="flex items-center gap-1.5 text-xs text-slate-600">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                    <span className="truncate">{inc}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Day-wise Itinerary Accordion Button */}
            <div>
              <button
                type="button"
                onClick={() => setShowItinerary(!showItinerary)}
                className="w-full flex items-center justify-between text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100/70 py-2 px-3.5 rounded-xl transition-colors"
              >
                <span>{showItinerary ? "Hide Day-Wise Schedule" : `View ${packageData.daysCount}-Day Detailed Schedule`}</span>
                {showItinerary ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {/* Itinerary Accordion Content */}
              {showItinerary && (
                <div className="mt-3 space-y-2.5 bg-slate-50 p-4 rounded-2xl border border-slate-100 animate-in fade-in duration-200">
                  {packageData.itinerary.map((item) => (
                    <div key={item.day} className="border-l-2 border-emerald-500 pl-3 py-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-extrabold text-emerald-700 uppercase">
                          Day {item.day}:
                        </span>
                        <span className="text-xs font-bold text-navy-900">{item.title}</span>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-0.5">{item.description}</p>
                      {item.stay && (
                        <p className="text-[10px] text-slate-400 mt-0.5">Stay: {item.stay}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* Pricing & CTA */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-auto flex-wrap gap-3">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-extrabold text-navy-900">
                  {formatCurrency(packageData.price)}
                </span>
                {packageData.originalPrice && (
                  <span className="text-xs text-slate-400 line-through">
                    {formatCurrency(packageData.originalPrice)}
                  </span>
                )}
              </div>
              <span className="text-[11px] text-slate-500 block font-normal">
                Per person • All taxes extra
              </span>
            </div>

            <button
              onClick={() => setIsBookingModalOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/30 hover:shadow-lg transition-all transform active:scale-95 flex-shrink-0"
            >
              <CalendarCheck className="w-4 h-4" />
              <span>Book Now</span>
            </button>
          </div>

        </div>
      </div>

      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        packageData={packageData}
      />
    </>
  );
};
