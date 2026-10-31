import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTravel } from '../context/TravelContext';
import { formatCurrency } from '../utils/formatters';
import { StarRating } from '../components/common/StarRating';
import { DestinationCard } from '../components/destinations/DestinationCard';
import { 
  Heart, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Sparkles, 
  CheckCircle2, 
  Lightbulb, 
  ArrowLeft, 
  Package, 
  ChevronRight,
  Share2
} from 'lucide-react';
import { useToast } from '../context/ToastContext';

export const DestinationDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { destinations, isInWishlist, toggleWishlist, packages } = useTravel();
  const { addToast } = useToast();

  const destination = destinations.find((d) => d.id === id);

  // Active gallery image state
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Reset image index when switching destinations
  useEffect(() => {
    setActiveImageIndex(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  if (!destination) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-navy-900 mb-4">Destination Not Found</h2>
        <p className="text-slate-500 mb-6">The requested destination does not exist or has been modified.</p>
        <Link
          to="/explore"
          className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs"
        >
          Back to Explore
        </Link>
      </div>
    );
  }

  const inWishlist = isInWishlist(destination.id);
  const images = destination.galleryImages || [destination.bannerImage];

  // Related destinations (same category or general)
  const relatedDestinations = destinations
    .filter((d) => d.id !== destination.id && (d.category === destination.category || d.country === destination.country))
    .slice(0, 3);

  // Associated package if any
  const associatedPackage = packages.find((p) => p.destinationId === destination.id);

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    addToast('Destination link copied to clipboard!', 'info');
  };

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      
      {/* Breadcrumbs & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <Link to="/" className="hover:text-emerald-700">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <Link to="/explore" className="hover:text-emerald-700">Destinations</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-navy-900 font-bold">{destination.name}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors flex items-center gap-1.5 text-xs font-bold"
          >
            <Share2 className="w-4 h-4" />
            <span className="hidden sm:inline">Share</span>
          </button>
          <button
            onClick={() => toggleWishlist(destination.id)}
            className={`px-4 py-2.5 rounded-xl border flex items-center gap-2 text-xs font-bold transition-all ${
              inWishlist
                ? 'bg-rose-50 border-rose-200 text-rose-600'
                : 'border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Heart className={`w-4 h-4 ${inWishlist ? 'fill-rose-500 text-rose-500' : ''}`} />
            <span>{inWishlist ? 'In Wishlist' : 'Add to Wishlist'}</span>
          </button>
        </div>
      </div>

      {/* Main Image Gallery Showcase */}
      <div className="space-y-3">
        <div className="relative aspect-[4/3] sm:aspect-[16/9] lg:aspect-[21/9] min-h-[260px] sm:min-h-[340px] max-h-[520px] w-full rounded-3xl overflow-hidden bg-slate-100 shadow-card">
          <img
            src={images[activeImageIndex] || destination.bannerImage}
            alt={destination.name}
            className="w-full h-full object-cover transition-all duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-transparent to-black/30" />
          
          <div className="absolute top-4 left-4">
            <span className="px-3.5 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-white/95 text-navy-900 shadow-sm backdrop-blur-md">
              {destination.category}
            </span>
          </div>

          <div className="absolute bottom-6 left-6 right-6 text-white flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-300">
                <MapPin className="w-4 h-4" />
                <span>{destination.region}, {destination.country}</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mt-1">
                {destination.name}
              </h1>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/20 flex items-center gap-3">
              <StarRating rating={destination.rating} count={destination.reviewCount} />
            </div>
          </div>
        </div>

        {/* Thumbnails Strip */}
        <div className="grid grid-cols-4 gap-3">
          {images.map((imgUrl, idx) => (
            <button
              key={idx}
              onClick={() => setActiveImageIndex(idx)}
              className={`relative aspect-[16/9] rounded-2xl overflow-hidden border-2 transition-all ${
                activeImageIndex === idx ? 'border-emerald-500 ring-2 ring-emerald-500/30' : 'border-transparent opacity-70 hover:opacity-100'
              }`}
            >
              <img src={imgUrl} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      </div>

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Left 2 Cols: Content */}
        <div className="lg:col-span-2 space-y-10">
          
          {/* Overview Description */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-subtle space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-navy-900 font-sans">
              About {destination.name}
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              {destination.fullDescription}
            </p>

            <div className="pt-2 flex items-center gap-3 text-xs text-slate-500">
              <span className="font-semibold text-navy-900">Ideal Trip Length:</span>
              <span>4 to 7 Days</span>
              <span>•</span>
              <span className="font-semibold text-navy-900">Vibe:</span>
              <span>{destination.category} & Cultural Discovery</span>
            </div>
          </div>

          {/* Top Tourist Attractions */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-subtle space-y-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-navy-900 font-sans">
                Top Tourist Attractions
              </h2>
              <p className="text-xs text-slate-500 mt-1">Must-visit landmarks and natural highlights in {destination.name}.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {(destination.topAttractions || []).map((attr, index) => (
                <div
                  key={index}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-emerald-200 transition-all space-y-1.5"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-extrabold flex items-center justify-center">
                      {index + 1}
                    </span>
                    <h3 className="text-sm font-bold text-navy-900">{attr.name}</h3>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed pl-8">
                    {attr.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Popular Activities */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-subtle space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-navy-900 font-sans">
              Popular Activities & Experiences
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(destination.popularActivities || []).map((act, index) => (
                <div key={index} className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 text-xs font-semibold text-navy-900">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>{act}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Insider Travel Tips */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-subtle space-y-4">
            <div className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-amber-500" />
              <h2 className="text-xl sm:text-2xl font-bold text-navy-900 font-sans">
                Traveler Tips & Local Advice
              </h2>
            </div>
            <ul className="space-y-2.5">
              {(destination.travelTips || []).map((tip, index) => (
                <li key={index} className="flex items-start gap-2.5 text-xs text-slate-600 leading-relaxed">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0 mt-2" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Right Col: Quick Planning & Budget Widget */}
        <div className="space-y-6">
          
          {/* Best Time to Visit Card */}
          <div className="bg-gradient-to-br from-emerald-900 to-navy-900 text-white rounded-3xl p-6 shadow-card space-y-3">
            <div className="flex items-center gap-2 text-emerald-300 text-xs font-bold uppercase tracking-wider">
              <Calendar className="w-4 h-4" />
              <span>Best Season to Visit</span>
            </div>
            <p className="text-base font-bold text-white">
              {destination.bestTimeToVisit}
            </p>
            <p className="text-xs text-slate-300 leading-relaxed">
              Plan your travel dates around these peak seasonal windows for optimal weather conditions and open sightseeing passes.
            </p>
          </div>

          {/* Estimated Expenses Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-card space-y-5">
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1">
                Estimated Daily Budget
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-navy-900">
                  {formatCurrency(destination.pricePerDay)}
                </span>
                <span className="text-xs text-slate-500">/ person per day</span>
              </div>
            </div>

            {/* Expense breakdown list */}
            <div className="space-y-2.5 pt-2 border-t border-slate-100 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Hotel / Stay per night:</span>
                <span className="font-bold text-navy-900">{formatCurrency(destination.estimatedExpenses?.stayPerNight || 2500)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Food & Meals per day:</span>
                <span className="font-bold text-navy-900">{formatCurrency(destination.estimatedExpenses?.mealPerDay || 800)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Local Transit per day:</span>
                <span className="font-bold text-navy-900">{formatCurrency(destination.estimatedExpenses?.localTravel || 600)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Activities & Entrance:</span>
                <span className="font-bold text-navy-900">{formatCurrency(destination.estimatedExpenses?.activities || 700)}</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="pt-2 space-y-2.5">
              <Link
                to={`/planner?dest=${encodeURIComponent(destination.name)}`}
                className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all"
              >
                <Sparkles className="w-4 h-4" />
                <span>Generate AI Itinerary for {destination.name}</span>
              </Link>

              <Link
                to={`/calculator?cost=${destination.pricePerDay}`}
                className="w-full py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-navy-900 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <span>Calculate Exact Trip Budget</span>
              </Link>

              {associatedPackage && (
                <div className="pt-3 border-t border-slate-100">
                  <p className="text-[11px] text-slate-500 mb-2">Verified Holiday Package Available:</p>
                  <Link
                    to="/packages"
                    className="p-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/60 block text-xs font-bold text-emerald-800 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span>{associatedPackage.title}</span>
                      <ChevronRight className="w-4 h-4 text-emerald-600" />
                    </div>
                    <span className="text-[11px] font-normal text-emerald-700 block mt-0.5">
                      {associatedPackage.duration} • from {formatCurrency(associatedPackage.price)}
                    </span>
                  </Link>
                </div>
              )}
            </div>

          </div>

        </div>

      </div>

      {/* Related Destinations */}
      {relatedDestinations.length > 0 && (
        <div className="pt-8 border-t border-slate-200/80 space-y-6">
          <div>
            <h2 className="text-2xl font-extrabold text-navy-900 font-sans">
              You Might Also Like
            </h2>
            <p className="text-xs text-slate-500 mt-1">Explore similar {destination.category} getaways and regional alternatives.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedDestinations.map((rel) => (
              <DestinationCard key={rel.id} destination={rel} />
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
