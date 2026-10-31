import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTravel } from '../context/TravelContext';
import { DestinationCard } from '../components/destinations/DestinationCard';
import { formatCurrency, formatDate } from '../utils/formatters';
import { 
  Calendar, 
  Heart, 
  Sparkles, 
  User, 
  Trash2, 
  AlertCircle, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  ArrowRight,
  ShieldCheck,
  Package,
  MapPin
} from 'lucide-react';

export const MyTripsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'bookings';
  const [activeTab, setActiveTab] = useState(initialTab);

  const { currentUser, isAuthenticated, quickDemoLogin } = useAuth();
  const { 
    bookings, 
    cancelBooking, 
    deleteBookingRecord, 
    plannedTrips, 
    deletePlannedTrip, 
    wishlist, 
    destinations 
  } = useTravel();

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab) setActiveTab(tab);
  }, [searchParams]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  // Find wishlist destinations
  const wishlistDestinations = destinations.filter((d) => wishlist.includes(d.id));

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      
      {/* Dashboard Header & Profile Snippet */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={currentUser?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80"}
              alt="Profile"
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-emerald-500 shadow-md"
            />
            <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-white text-[10px]">
              ✓
            </span>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-navy-900 font-sans">
                {currentUser ? currentUser.name : "Demo Traveler"}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800">
                {currentUser?.role || "Travel Explorer"}
              </span>
            </div>
            <p className="text-xs text-slate-500">{currentUser?.email || "guest@travelora.demo"}</p>
            <p className="text-[11px] text-slate-400">Member since {currentUser?.joinedDate || "2026"}</p>
          </div>
        </div>

        {/* Quick Stats in Profile */}
        <div className="flex items-center gap-4 sm:gap-6 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-8">
          <div className="text-center">
            <span className="text-2xl font-extrabold text-navy-900">{bookings.length}</span>
            <span className="text-[11px] font-semibold text-slate-400 block uppercase">Bookings</span>
          </div>
          <div className="text-center">
            <span className="text-2xl font-extrabold text-navy-900">{plannedTrips.length}</span>
            <span className="text-[11px] font-semibold text-slate-400 block uppercase">Planned</span>
          </div>
          <div className="text-center">
            <span className="text-2xl font-extrabold text-navy-900">{wishlist.length}</span>
            <span className="text-[11px] font-semibold text-slate-400 block uppercase">Wishlist</span>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-slate-200 flex items-center gap-2 sm:gap-6 overflow-x-auto scrollbar-none">
        {[
          { id: 'bookings', label: 'Bookings History', count: bookings.length, icon: Calendar },
          { id: 'planned', label: 'AI Planned Trips', count: plannedTrips.length, icon: Sparkles },
          { id: 'wishlist', label: 'Saved Destinations', count: wishlist.length, icon: Heart },
          { id: 'profile', label: 'Profile & Settings', count: null, icon: User }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`pb-4 px-2 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
                isActive
                  ? 'border-emerald-600 text-emerald-700'
                  : 'border-transparent text-slate-500 hover:text-navy-900 hover:border-slate-300'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.count !== null && (
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold ${
                  isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab 1: Bookings History */}
      {activeTab === 'bookings' && (
        <div className="space-y-6">
          {bookings.length > 0 ? (
            <div className="space-y-4">
              {bookings.map((booking) => (
                <div
                  key={booking.bookingId}
                  className="bg-white rounded-3xl p-6 border border-slate-100 shadow-subtle hover:shadow-card transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
                >
                  <div className="flex items-start sm:items-center gap-4">
                    <img
                      src={booking.image}
                      alt={booking.packageTitle}
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover flex-shrink-0"
                    />
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                          {booking.bookingId}
                        </span>
                        <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                          booking.status === 'Confirmed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}>
                          {booking.status}
                        </span>
                      </div>

                      <h3 className="text-base sm:text-lg font-bold text-navy-900">
                        {booking.packageTitle}
                      </h3>

                      <p className="text-xs text-slate-500 flex items-center gap-3">
                        <span>Date: <strong>{formatDate(booking.travelDate)}</strong></span>
                        <span>•</span>
                        <span>{booking.travellersCount} Traveller{booking.travellersCount > 1 ? 's' : ''}</span>
                        <span>•</span>
                        <span>Lead: {booking.leadTraveller?.fullName}</span>
                      </p>
                    </div>
                  </div>

                  {/* Pricing and Actions */}
                  <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end justify-between border-t md:border-t-0 pt-3 md:pt-0 gap-3">
                    <div>
                      <span className="text-[11px] text-slate-400 block uppercase font-semibold">Total Demo Paid</span>
                      <span className="text-xl font-extrabold text-navy-900">
                        {formatCurrency(booking.totalAmount)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        to={`/booking-confirmation/${booking.bookingId}`}
                        className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-navy-900 text-xs font-bold transition-colors"
                      >
                        View Receipt
                      </Link>

                      {booking.status === 'Confirmed' && (
                        <button
                          onClick={() => cancelBooking(booking.bookingId)}
                          className="px-3.5 py-1.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-bold transition-colors"
                        >
                          Cancel Booking
                        </button>
                      )}

                      <button
                        onClick={() => deleteBookingRecord(booking.bookingId)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                        title="Delete Record"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center max-w-md mx-auto border border-slate-100 space-y-3">
              <Package className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-lg font-bold text-navy-900">No active bookings</h3>
              <p className="text-xs text-slate-500">
                You haven't booked any holiday packages yet. Check out our curated packages to get started.
              </p>
              <Link
                to="/packages"
                className="inline-flex px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-sm"
              >
                Browse Holiday Packages
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: AI Planned Trips */}
      {activeTab === 'planned' && (
        <div className="space-y-6">
          {plannedTrips.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {plannedTrips.map((plan) => (
                <div
                  key={plan.id}
                  className="bg-white rounded-3xl p-6 border border-slate-100 shadow-subtle hover:shadow-card transition-all space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800">
                        {plan.travelStyle || 'Active'} Plan
                      </span>
                      <button
                        onClick={() => deletePlannedTrip(plan.id)}
                        className="text-slate-400 hover:text-rose-600 p-1"
                        title="Delete planned trip"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <h3 className="text-xl font-bold text-navy-900">
                      {plan.destination} Itinerary
                    </h3>
                    <p className="text-xs text-slate-500">
                      {plan.days} Days • {plan.travellers} Travellers • Estimated: {formatCurrency(plan.totalEstimatedCost)}
                    </p>
                  </div>

                  {/* Highlights preview */}
                  <div className="bg-slate-50 rounded-2xl p-3.5 space-y-1.5 text-xs text-slate-600">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">
                      Sample Schedule Preview
                    </span>
                    {plan.daysItinerary?.slice(0, 2).map((d) => (
                      <div key={d.day} className="truncate">
                        <strong>Day {d.day}:</strong> {d.theme}
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 flex items-center justify-between">
                    <Link
                      to={`/planner?dest=${encodeURIComponent(plan.destination)}`}
                      className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1"
                    >
                      <span>Re-open in AI Planner</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center max-w-md mx-auto border border-slate-100 space-y-3">
              <Sparkles className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-lg font-bold text-navy-900">No planned itineraries yet</h3>
              <p className="text-xs text-slate-500">
                Use our AI Smart Trip Planner to craft a personalized day-wise schedule and save it here.
              </p>
              <Link
                to="/planner"
                className="inline-flex px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-sm"
              >
                Create an Itinerary
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Wishlist */}
      {activeTab === 'wishlist' && (
        <div className="space-y-6">
          {wishlistDestinations.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {wishlistDestinations.map((dest) => (
                <DestinationCard key={dest.id} destination={dest} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center max-w-md mx-auto border border-slate-100 space-y-3">
              <Heart className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-lg font-bold text-navy-900">Your wishlist is empty</h3>
              <p className="text-xs text-slate-500">
                Click the heart icon on any destination card to bookmark it for later exploration.
              </p>
              <Link
                to="/explore"
                className="inline-flex px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-sm"
              >
                Explore Destinations
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Profile & Preferences */}
      {activeTab === 'profile' && (
        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-card max-w-2xl space-y-6">
          <h2 className="text-xl font-bold text-navy-900 font-sans border-b border-slate-100 pb-3">
            Explorer Profile Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-slate-400 font-semibold block uppercase text-[10px] mb-1">Full Name</span>
              <span className="font-bold text-navy-900 text-sm">{currentUser?.name || "Ansh Sharma"}</span>
            </div>
            <div>
              <span className="text-slate-400 font-semibold block uppercase text-[10px] mb-1">Email Address</span>
              <span className="font-bold text-navy-900 text-sm">{currentUser?.email || "ansh@travelora.demo"}</span>
            </div>
            <div>
              <span className="text-slate-400 font-semibold block uppercase text-[10px] mb-1">Phone Number</span>
              <span className="font-bold text-navy-900 text-sm">{currentUser?.phone || "+91 98765 43210"}</span>
            </div>
            <div>
              <span className="text-slate-400 font-semibold block uppercase text-[10px] mb-1">User Role</span>
              <span className="font-bold text-emerald-700 text-sm">{currentUser?.role || "Travel Explorer"}</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs space-y-1">
            <strong className="block font-bold">Demo Architecture Note:</strong>
            <p>
              Your user credentials and preferences are securely persisted inside browser localStorage. This is designed for university capstone demonstrations and is not meant for production financial transactions.
            </p>
          </div>

          <div className="pt-2 flex items-center gap-3">
            <button
              onClick={() => quickDemoLogin(0)}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-navy-900 text-xs font-bold transition-colors"
            >
              Switch to Ansh (Demo 1)
            </button>
            <button
              onClick={() => quickDemoLogin(1)}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-navy-900 text-xs font-bold transition-colors"
            >
              Switch to Elena (Demo 2)
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
