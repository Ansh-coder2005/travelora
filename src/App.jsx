import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { TravelProvider } from './context/TravelContext';

import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';

import { HomePage } from './pages/HomePage';
import { ExplorePage } from './pages/ExplorePage';
import { DestinationDetailsPage } from './pages/DestinationDetailsPage';
import { TourPackagesPage } from './pages/TourPackagesPage';
import { AIPlannerPage } from './pages/AIPlannerPage';
import { BudgetCalculatorPage } from './pages/BudgetCalculatorPage';
import { MyTripsPage } from './pages/MyTripsPage';
import { AuthPage } from './pages/AuthPage';
import { BookingConfirmationPage } from './pages/BookingConfirmationPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';

// Scroll to top upon route transition
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant'
    });
  }, [pathname]);

  return null;
}

export function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <TravelProvider>
          <Router>
            <ScrollToTop />
            <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-emerald-500 selection:text-white">
              
              {/* Sticky Glass Navbar */}
              <Navbar />

              {/* Main Content Area */}
              <main className="flex-grow">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/explore" element={<ExplorePage />} />
                  <Route path="/destination/:id" element={<DestinationDetailsPage />} />
                  <Route path="/packages" element={<TourPackagesPage />} />
                  <Route path="/planner" element={<AIPlannerPage />} />
                  <Route path="/calculator" element={<BudgetCalculatorPage />} />
                  <Route path="/trips" element={<MyTripsPage />} />
                  <Route path="/auth" element={<AuthPage />} />
                  <Route path="/booking-confirmation/:bookingId" element={<BookingConfirmationPage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/admin" element={<AdminDashboardPage />} />
                  <Route path="*" element={<HomePage />} />
                </Routes>
              </main>

              {/* Comprehensive Travel Platform Footer */}
              <Footer />

            </div>
          </Router>
        </TravelProvider>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
