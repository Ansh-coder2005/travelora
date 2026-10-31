import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, MapPin, ArrowRight, Sparkles } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import { useTravel } from '../../context/TravelContext';
import { StarRating } from '../common/StarRating';

export const DestinationCard = ({ destination }) => {
  const { isInWishlist, toggleWishlist } = useTravel();
  const inWishlist = isInWishlist(destination.id);

  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-subtle hover:shadow-card-hover transition-all duration-300 flex flex-col h-full transform hover:-translate-y-1">
      {/* Image Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
        <img
          src={destination.bannerImage}
          alt={destination.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 opacity-80" />

        {/* Category Pill */}
        <div className="absolute top-3 left-3">
          <span className="px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-white/90 backdrop-blur-md text-navy-900 shadow-sm">
            {destination.category}
          </span>
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(destination.id);
          }}
          className={`absolute top-3 right-3 p-2.5 rounded-full backdrop-blur-md transition-transform active:scale-90 shadow-sm ${
            inWishlist
              ? 'bg-rose-50 text-rose-500'
              : 'bg-white/80 text-slate-700 hover:text-rose-500 hover:bg-white'
          }`}
          aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart className={`w-4 h-4 ${inWishlist ? 'fill-rose-500' : ''}`} />
        </button>

        {/* Overlay Location */}
        <div className="absolute bottom-3 left-3 right-3 text-white">
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-200">
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            <span>{destination.region}, {destination.country}</span>
          </div>
          <h3 className="text-xl font-bold tracking-tight text-white drop-shadow-sm font-sans mt-0.5">
            {destination.name}
          </h3>
        </div>
      </div>

      {/* Content Container */}
      <div className="p-5 flex flex-col flex-grow justify-between gap-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <StarRating rating={destination.rating} count={destination.reviewCount} />
            {destination.isTrending && (
              <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                <Sparkles className="w-3 h-3 text-emerald-500" />
                Trending
              </span>
            )}
          </div>

          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
            {destination.shortDescription}
          </p>
        </div>

        {/* Footer info & CTA */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between mt-auto flex-wrap gap-2">
          <div>
            <span className="text-[11px] text-slate-400 uppercase tracking-wider block font-semibold">
              Estimated / Day
            </span>
            <span className="text-base font-extrabold text-navy-900">
              {formatCurrency(destination.pricePerDay)}
            </span>
            <span className="text-[11px] text-slate-500 font-normal"> / person</span>
          </div>

          <Link
            to={`/destination/${destination.id}`}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-emerald-600 hover:text-white text-navy-900 transition-all duration-200 group/btn flex-shrink-0"
          >
            <span>View Details</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
};
