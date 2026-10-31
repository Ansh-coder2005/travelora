import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTravel } from '../context/TravelContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { formatCurrency, formatDate } from '../utils/formatters';
import { adminAPI, contactAPI, newsletterAPI } from '../services/api';
import { 
  ShieldAlert, 
  TrendingUp, 
  Users, 
  Package, 
  MapPin, 
  DollarSign, 
  Calendar, 
  Trash2, 
  Plus, 
  RotateCcw, 
  CheckCircle2, 
  XCircle,
  Clock,
  SlidersHorizontal,
  ChevronRight,
  Sparkles,
  ShieldCheck,
  Lock,
  Database,
  ArrowRight,
  Mail,
  MessageSquare,
  Edit3,
  Check
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid,
  Cell
} from 'recharts';

export const AdminDashboardPage = () => {
  const { 
    bookings, 
    cancelBooking, 
    deleteBookingRecord, 
    destinations, 
    deleteDestination, 
    addDestination, 
    packages, 
    deletePackage, 
    addPackage, 
    resetAllDemoData 
  } = useTravel();
  const { registeredUsers, currentUser, quickDemoLogin } = useAuth();
  const { addToast } = useToast();

  const [adminStats, setAdminStats] = useState(null);
  const [inquiries, setInquiries] = useState([]);
  const [subscribers, setSubscribers] = useState([]);

  useEffect(() => {
    if (currentUser?.role === 'admin') {
      adminAPI.getStats()
        .then((res) => {
          if (res.success && res.stats) {
            setAdminStats(res.stats);
          }
        })
        .catch(() => {});

      contactAPI.getAll()
        .then((res) => {
          if (res.success && res.inquiries) {
            setInquiries(res.inquiries);
          }
        })
        .catch(() => {});

      newsletterAPI.getAll()
        .then((res) => {
          if (res.success && res.subscribers) {
            setSubscribers(res.subscribers);
          }
        })
        .catch(() => {});
    }
  }, [currentUser]);

  const [activeTab, setActiveTab] = useState('bookings'); // 'bookings', 'destinations', 'packages', 'analytics'

  // Add Destination Form State
  const [showAddDestModal, setShowAddDestModal] = useState(false);
  const [newDestName, setNewDestName] = useState('');
  const [newDestRegion, setNewDestRegion] = useState('');
  const [newDestCountry, setNewDestCountry] = useState('India');
  const [newDestCategory, setNewDestCategory] = useState('Mountains');
  const [newDestPrice, setNewDestPrice] = useState(4000);
  const [newDestDesc, setNewDestDesc] = useState('');

  // Add Package Form State
  const [showAddPkgModal, setShowAddPkgModal] = useState(false);
  const [newPkgTitle, setNewPkgTitle] = useState('');
  const [newPkgDest, setNewPkgDest] = useState('');
  const [newPkgPrice, setNewPkgPrice] = useState(25000);
  const [newPkgDuration, setNewPkgDuration] = useState('5 Days / 4 Nights');
  const [newPkgCategory, setNewPkgCategory] = useState('Mountains');
  const [newPkgHotel, setNewPkgHotel] = useState('4-Star Boutique Resort');
  const [newPkgTransport, setNewPkgTransport] = useState('Private Chauffeur Sedan');

  // KPI Calculations
  const totalRevenue = bookings.reduce((sum, b) => b.status === 'Confirmed' ? sum + b.totalAmount : sum, 0);
  const confirmedBookingsCount = bookings.filter((b) => b.status === 'Confirmed').length;

  // Chart data: Bookings by Destination Category
  const categoryStats = [
    { category: 'Mountains', bookings: 0, revenue: 0 },
    { category: 'Beaches', bookings: 0, revenue: 0 },
    { category: 'Adventure', bookings: 0, revenue: 0 },
    { category: 'Historical', bookings: 0, revenue: 0 },
    { category: 'Wildlife', bookings: 0, revenue: 0 },
    { category: 'City Tours', bookings: 0, revenue: 0 },
  ];

  bookings.forEach((b) => {
    // Attempt to match category
    const matchedPkg = packages.find(p => p.id === b.packageId);
    const cat = matchedPkg ? matchedPkg.category : 'Mountains';
    const found = categoryStats.find(c => c.category === cat);
    if (found) {
      found.bookings += 1;
      found.revenue += b.totalAmount;
    }
  });

  const handleCreateDestination = (e) => {
    e.preventDefault();
    if (!newDestName.trim()) {
      addToast('Please enter a destination name.', 'error');
      return;
    }

    addDestination({
      name: newDestName.trim(),
      region: newDestRegion.trim() || 'Scenic Region',
      country: newDestCountry.trim() || 'India',
      category: newDestCategory,
      rating: 4.8,
      reviewCount: 120,
      pricePerDay: parseInt(newDestPrice) || 3500,
      shortDescription: newDestDesc.trim() || 'A captivating destination known for scenic vistas and rich culture.',
      fullDescription: newDestDesc.trim() || 'Experience memorable views, local hospitality, and world-class tourism amenities.',
      bannerImage: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
      galleryImages: [
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80"
      ],
      bestTimeToVisit: "October to April",
      estimatedExpenses: { stayPerNight: 2000, mealPerDay: 700, localTravel: 500, activities: 800 },
      topAttractions: [{ name: "Central Heritage Landmark", description: "Iconic historical viewpoint." }],
      popularActivities: ["Sightseeing", "Cultural Walking Tour", "Local Gastronomy"],
      travelTips: ["Carry comfortable footwear.", "Book transport in advance."]
    });

    setNewDestName('');
    setNewDestDesc('');
    setShowAddDestModal(false);
  };

  const handleCreatePackage = (e) => {
    e.preventDefault();
    if (!newPkgTitle.trim() || !newPkgDest.trim()) {
      addToast('Please fill in title and destination.', 'error');
      return;
    }

    addPackage({
      title: newPkgTitle.trim(),
      destination: newPkgDest.trim(),
      category: newPkgCategory,
      duration: newPkgDuration,
      daysCount: parseInt(newPkgDuration.charAt(0)) || 5,
      nightsCount: (parseInt(newPkgDuration.charAt(0)) || 5) - 1,
      price: parseInt(newPkgPrice) || 20000,
      originalPrice: Math.round((parseInt(newPkgPrice) || 20000) * 1.2),
      rating: 4.9,
      reviewsCount: 50,
      image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80",
      overview: "Custom curated travel package with premium stays and private transfers.",
      hotelInfo: newPkgHotel,
      transportInfo: newPkgTransport,
      inclusions: ["All accommodations", "Daily buffet breakfast", "Private transfers", "Guided city tour"],
      exclusions: ["Flight tickets", "Personal tips & laundry"],
      itinerary: [
        { day: 1, title: "Arrival and Orientation", description: "Check in and relax.", stay: newPkgHotel },
        { day: 2, title: "Scenic Sightseeing", description: "Full day tour.", stay: newPkgHotel }
      ]
    });

    setNewPkgTitle('');
    setNewPkgDest('');
    setShowAddPkgModal(false);
  };

  // Security Gate: Ensure user is logged in with admin role
  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="py-20 max-w-lg mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-card text-center space-y-6">
          <div className="w-16 h-16 rounded-3xl bg-purple-100 text-purple-700 mx-auto flex items-center justify-center shadow-inner">
            <Lock className="w-8 h-8" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-50 text-purple-700 border border-purple-200 mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>RBAC Protected Route</span>
            </div>
            <h2 className="text-2xl font-black text-navy-900 font-sans">
              Administrator Login Required
            </h2>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              This administration operations console requires verified administrator privileges. Database records, revenue metrics, and catalog management are restricted.
            </p>
          </div>

          {currentUser ? (
            <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-800 text-left flex items-start gap-2.5">
              <ShieldAlert className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Access Denied for current session</p>
                <p className="text-[11px] mt-0.5">
                  Signed in as <strong>{currentUser.name}</strong> ({currentUser.email}) with role: <span className="uppercase font-bold text-amber-900">{currentUser.role}</span>.
                </p>
              </div>
            </div>
          ) : (
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600 text-left">
              No authenticated session detected. Please sign in using an authorized administrator account.
            </div>
          )}

          <div className="space-y-3 pt-2">
            <button
              onClick={() => quickDemoLogin('admin')}
              className="w-full py-3.5 rounded-2xl bg-purple-700 hover:bg-purple-800 text-white font-extrabold text-xs shadow-md shadow-purple-700/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>One-Click Sign In as Admin (admin@travelora.com)</span>
            </button>

            <Link
              to="/auth"
              className="w-full py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-navy-900 font-bold text-xs flex items-center justify-center gap-2 transition-all"
            >
              <span>Go to Main Sign In Page</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between bg-gradient-to-r from-navy-950 via-navy-900 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 shadow-card gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Platform Administration Console</span>
            </span>
            <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
              <Database className="w-3.5 h-3.5" />
              SQLite (travelora.db) & JWT Backend Active
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-sans">
            TRAVELORA Admin Operations
          </h1>
          <p className="text-xs text-slate-300">
            Monitor real-time simulated reservations, manage destination catalog records, and customize tour packages.
          </p>
        </div>

        <button
          onClick={resetAllDemoData}
          className="self-start md:self-auto px-4 py-2.5 rounded-xl bg-white/10 hover:bg-rose-500/20 hover:border-rose-400 border border-white/20 text-white text-xs font-bold transition-all flex items-center gap-2"
          title="Restore original sample destinations and packages"
        >
          <RotateCcw className="w-4 h-4 text-rose-400" />
          <span>Reset Sample Catalog</span>
        </button>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* KPI 1 */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-subtle space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Demo Bookings</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-navy-900 font-sans">{bookings.length}</p>
          <span className="text-[11px] text-emerald-600 font-semibold">
            {confirmedBookingsCount} Confirmed • {bookings.length - confirmedBookingsCount} Cancelled
          </span>
        </div>

        {/* KPI 2 */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-subtle space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Simulated Volume</span>
            <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-navy-900 font-sans">{formatCurrency(totalRevenue)}</p>
          <span className="text-[11px] text-slate-500 font-semibold">
            Across verified reservations
          </span>
        </div>

        {/* KPI 3 */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-subtle space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Registered Demo Users</span>
            <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-navy-900 font-sans">{registeredUsers.length}</p>
          <span className="text-[11px] text-sky-600 font-semibold">
            Active session profiles
          </span>
        </div>

        {/* KPI 4 */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-subtle space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Catalog Inventory</span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-navy-900 font-sans">{destinations.length + packages.length}</p>
          <span className="text-[11px] text-purple-600 font-semibold">
            {destinations.length} Spots • {packages.length} Tour Packages
          </span>
        </div>

      </div>

      {/* Analytics Chart */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-card space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-extrabold text-navy-900 font-sans">
              Booking Distribution by Destination Category
            </h3>
            <p className="text-xs text-slate-500">Live breakdown of bookings generated in the demo environment.</p>
          </div>
        </div>

        <div className="h-64 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={categoryStats}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="category" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} allowDecimals={false} />
              <Tooltip 
                formatter={(val) => [`${val} Bookings`, 'Total']}
                contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', color: '#fff', fontSize: '12px', border: 'none' }}
              />
              <Bar dataKey="bookings" fill="#059669" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="border-b border-slate-200 flex items-center gap-4 sm:gap-6 text-xs sm:text-sm font-bold overflow-x-auto">
        <button
          onClick={() => setActiveTab('bookings')}
          className={`pb-3 border-b-2 whitespace-nowrap transition-all ${
            activeTab === 'bookings'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-navy-900'
          }`}
        >
          Recent Bookings ({bookings.length})
        </button>
        <button
          onClick={() => setActiveTab('destinations')}
          className={`pb-3 border-b-2 whitespace-nowrap transition-all ${
            activeTab === 'destinations'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-navy-900'
          }`}
        >
          Destinations ({destinations.length})
        </button>
        <button
          onClick={() => setActiveTab('packages')}
          className={`pb-3 border-b-2 whitespace-nowrap transition-all ${
            activeTab === 'packages'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-navy-900'
          }`}
        >
          Tour Packages ({packages.length})
        </button>
        <button
          onClick={() => setActiveTab('inquiries')}
          className={`pb-3 border-b-2 whitespace-nowrap transition-all flex items-center gap-1.5 ${
            activeTab === 'inquiries'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-navy-900'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Inquiries ({inquiries.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('subscribers')}
          className={`pb-3 border-b-2 whitespace-nowrap transition-all flex items-center gap-1.5 ${
            activeTab === 'subscribers'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-navy-900'
          }`}
        >
          <Mail className="w-3.5 h-3.5" />
          <span>Newsletter ({subscribers.length})</span>
        </button>
      </div>

      {/* Tab 1: Bookings Management Table */}
      {activeTab === 'bookings' && (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-100 text-slate-400 uppercase tracking-wider font-extrabold">
                <tr>
                  <th className="p-4">Reference</th>
                  <th className="p-4">Lead Traveller</th>
                  <th className="p-4">Package / Destination</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Travellers</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {bookings.map((booking) => (
                  <tr key={booking.bookingId} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-4 font-mono font-bold text-navy-900">
                      {booking.bookingId}
                    </td>
                    <td className="p-4">
                      <strong className="text-navy-900 block">{booking.leadTraveller?.fullName}</strong>
                      <span className="text-slate-400 text-[11px]">{booking.leadTraveller?.email}</span>
                    </td>
                    <td className="p-4 font-semibold text-navy-900">
                      {booking.packageTitle}
                    </td>
                    <td className="p-4 text-slate-600">
                      {formatDate(booking.travelDate)}
                    </td>
                    <td className="p-4 font-bold text-navy-900">
                      {booking.travellersCount}
                    </td>
                    <td className="p-4 font-extrabold text-navy-900">
                      {formatCurrency(booking.totalAmount)}
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        booking.status === 'Confirmed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      {booking.status === 'Confirmed' && (
                        <button
                          onClick={() => cancelBooking(booking.bookingId)}
                          className="px-2.5 py-1 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 text-[11px] font-bold"
                        >
                          Cancel
                        </button>
                      )}
                      <button
                        onClick={() => deleteBookingRecord(booking.bookingId)}
                        className="p-1 text-slate-400 hover:text-rose-600"
                        title="Delete record"
                      >
                        <Trash2 className="w-4 h-4 inline" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Destinations Catalog */}
      {activeTab === 'destinations' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-xs text-slate-500 font-semibold">
              Manage live destination cards rendered across the platform.
            </span>
            <button
              onClick={() => setShowAddDestModal(true)}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Add Destination</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {destinations.map((dest) => (
              <div
                key={dest.id}
                className="bg-white rounded-2xl p-4 border border-slate-100 shadow-subtle flex items-start justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={dest.bannerImage}
                    alt={dest.name}
                    className="w-14 h-14 rounded-xl object-cover flex-shrink-0"
                  />
                  <div>
                    <h4 className="font-bold text-navy-900 text-sm">{dest.name}</h4>
                    <p className="text-[11px] text-slate-400">{dest.region}, {dest.country}</p>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md inline-block mt-1">
                      {dest.category} • {formatCurrency(dest.pricePerDay)}/day
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => deleteDestination(dest.id)}
                  className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                  title="Delete destination"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Tour Packages */}
      {activeTab === 'packages' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-xs text-slate-500 font-semibold">
              Curate and configure holiday packages shown in the package marketplace.
            </span>
            <button
              onClick={() => setShowAddPkgModal(true)}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Add Package</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                className="bg-white rounded-2xl p-5 border border-slate-100 shadow-subtle flex items-start justify-between gap-4"
              >
                <div className="flex items-start gap-3">
                  <img
                    src={pkg.image}
                    alt={pkg.title}
                    className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                  />
                  <div className="space-y-1">
                    <h4 className="font-bold text-navy-900 text-sm">{pkg.title}</h4>
                    <p className="text-xs text-slate-500">{pkg.destination} • {pkg.duration}</p>
                    <p className="text-xs font-extrabold text-emerald-700">{formatCurrency(pkg.price)}</p>
                  </div>
                </div>

                <button
                  onClick={() => deletePackage(pkg.id)}
                  className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                  title="Delete package"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Contact Inquiries */}
      {activeTab === 'inquiries' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-xs text-slate-500 font-semibold">
              Live customer messages & inquiries submitted via the Contact page.
            </span>
            <span className="text-xs font-bold text-slate-400">Total: {inquiries.length}</span>
          </div>

          {inquiries.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-100">
              <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-navy-900">No Inquiries Received Yet</h3>
              <p className="text-xs text-slate-400 mt-1">Submitted messages through /contact will appear here in real time.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {inquiries.map((inq) => (
                <div key={inq.id} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-subtle space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h4 className="font-bold text-navy-900 text-sm">{inq.name}</h4>
                      <a href={`mailto:${inq.email}`} className="text-xs text-emerald-600 hover:underline">{inq.email}</a>
                    </div>
                    <span className="text-[10px] text-slate-400 font-semibold bg-slate-100 px-2 py-0.5 rounded-full">
                      {formatDate(inq.created_at)}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-slate-100">
                    <p className="text-xs font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1">
                      Subject: {inq.subject}
                    </p>
                    <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl">
                      "{inq.message}"
                    </p>
                  </div>
                  <div className="flex items-center justify-end gap-2 pt-1">
                    <a
                      href={`mailto:${inq.email}?subject=Re: ${encodeURIComponent(inq.subject)}`}
                      className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-bold flex items-center gap-1.5 transition-colors"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Reply via Email</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 5: Newsletter Subscribers */}
      {activeTab === 'subscribers' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-xs text-slate-500 font-semibold">
              Verified email subscribers enrolled in weekly travel digest and discount alerts.
            </span>
            <span className="text-xs font-bold text-slate-400">Total: {subscribers.length}</span>
          </div>

          {subscribers.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-100">
              <Mail className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-navy-900">No Subscribers Yet</h3>
              <p className="text-xs text-slate-400 mt-1">Users who subscribe on the home page footer will be stored in SQLite.</p>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-100 shadow-card overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-100 text-slate-400 uppercase tracking-wider font-extrabold">
                  <tr>
                    <th className="p-4">#</th>
                    <th className="p-4">Subscriber Email</th>
                    <th className="p-4">Subscription Date</th>
                    <th className="p-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {subscribers.map((sub, idx) => (
                    <tr key={sub.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="p-4 font-bold text-slate-400">{idx + 1}</td>
                      <td className="p-4 font-semibold text-navy-900">{sub.email}</td>
                      <td className="p-4 text-slate-500">{formatDate(sub.created_at)}</td>
                      <td className="p-4 text-right">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          Active
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Add Destination Modal */}
      {showAddDestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-navy-950/70 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 space-y-4 my-auto max-h-[92vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-navy-900">Add New Destination</h3>
            
            <form onSubmit={handleCreateDestination} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-navy-900 block mb-1">Destination Name</label>
                <input
                  type="text"
                  placeholder="e.g. Rishikesh"
                  value={newDestName}
                  onChange={(e) => setNewDestName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-navy-900 block mb-1">Region / State</label>
                  <input
                    type="text"
                    placeholder="e.g. Uttarakhand"
                    value={newDestRegion}
                    onChange={(e) => setNewDestRegion(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="font-bold text-navy-900 block mb-1">Country</label>
                  <input
                    type="text"
                    value={newDestCountry}
                    onChange={(e) => setNewDestCountry(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-navy-900 block mb-1">Category</label>
                  <select
                    value={newDestCategory}
                    onChange={(e) => setNewDestCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  >
                    <option value="Mountains">Mountains</option>
                    <option value="Beaches">Beaches</option>
                    <option value="Adventure">Adventure</option>
                    <option value="Historical">Historical</option>
                    <option value="Wildlife">Wildlife</option>
                    <option value="City Tours">City Tours</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-navy-900 block mb-1">Est. Price / Day (₹)</label>
                  <input
                    type="number"
                    value={newDestPrice}
                    onChange={(e) => setNewDestPrice(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-navy-900 block mb-1">Description</label>
                <textarea
                  rows="2"
                  placeholder="Brief overview of highlights and atmosphere..."
                  value={newDestDesc}
                  onChange={(e) => setNewDestDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 resize-none"
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddDestModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 text-white font-bold"
                >
                  Add Destination
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Package Modal */}
      {showAddPkgModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-navy-950/70 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 space-y-4 my-auto max-h-[92vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-navy-900">Add New Tour Package</h3>
            
            <form onSubmit={handleCreatePackage} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-navy-900 block mb-1">Package Title</label>
                <input
                  type="text"
                  placeholder="e.g. Himalayan Spiritual Expedition"
                  value={newPkgTitle}
                  onChange={(e) => setNewPkgTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-navy-900 block mb-1">Destination</label>
                  <input
                    type="text"
                    placeholder="e.g. Rishikesh & Haridwar"
                    value={newPkgDest}
                    onChange={(e) => setNewPkgDest(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="font-bold text-navy-900 block mb-1">Price (₹)</label>
                  <input
                    type="number"
                    value={newPkgPrice}
                    onChange={(e) => setNewPkgPrice(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-navy-900 block mb-1">Duration</label>
                  <input
                    type="text"
                    placeholder="e.g. 5 Days / 4 Nights"
                    value={newPkgDuration}
                    onChange={(e) => setNewPkgDuration(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="font-bold text-navy-900 block mb-1">Category</label>
                  <select
                    value={newPkgCategory}
                    onChange={(e) => setNewPkgCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  >
                    <option value="Mountains">Mountains</option>
                    <option value="Beaches">Beaches</option>
                    <option value="Adventure">Adventure</option>
                    <option value="Historical">Historical</option>
                    <option value="Wildlife">Wildlife</option>
                    <option value="City Tours">City Tours</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddPkgModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 text-white font-bold"
                >
                  Add Package
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
