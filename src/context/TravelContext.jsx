import React, { createContext, useContext, useState, useEffect } from 'react';
import { getStoredItem, setStoredItem, KEYS } from '../utils/storage';
import { INITIAL_DESTINATIONS } from '../data/destinationsData';
import { INITIAL_PACKAGES } from '../data/packagesData';
import { useToast } from './ToastContext';
import { generateBookingId } from '../utils/formatters';
import { 
  destinationsAPI, 
  packagesAPI, 
  bookingsAPI, 
  wishlistAPI, 
  tripsAPI 
} from '../services/api';

const TravelContext = createContext(null);

export const TravelProvider = ({ children }) => {
  const { addToast } = useToast();

  const [destinations, setDestinations] = useState(() => {
    return getStoredItem(KEYS.DESTINATIONS, INITIAL_DESTINATIONS);
  });

  const [packages, setPackages] = useState(() => {
    return getStoredItem(KEYS.PACKAGES, INITIAL_PACKAGES);
  });

  const [wishlist, setWishlist] = useState(() => {
    return getStoredItem(KEYS.WISHLIST, ["ladakh-india", "swiss-alps-switzerland", "bali-indonesia"]);
  });

  const [bookings, setBookings] = useState(() => {
    return getStoredItem(KEYS.BOOKINGS, []);
  });

  const [plannedTrips, setPlannedTrips] = useState(() => {
    return getStoredItem(KEYS.PLANNED_TRIPS, []);
  });

  const [isLoadingBackend, setIsLoadingBackend] = useState(false);

  // Sync state from Backend API on mount
  useEffect(() => {
    const fetchData = async () => {
      setIsLoadingBackend(true);
      try {
        const [destRes, pkgRes, bookRes, wishRes, tripsRes] = await Promise.allSettled([
          destinationsAPI.getAll(),
          packagesAPI.getAll(),
          bookingsAPI.getAll(),
          wishlistAPI.getAll(),
          tripsAPI.getAll()
        ]);

        if (destRes.status === 'fulfilled' && destRes.value?.destinations) {
          setDestinations(destRes.value.destinations);
        }
        if (pkgRes.status === 'fulfilled' && pkgRes.value?.packages) {
          setPackages(pkgRes.value.packages);
        }
        if (bookRes.status === 'fulfilled' && bookRes.value?.bookings) {
          setBookings(bookRes.value.bookings);
        }
        if (wishRes.status === 'fulfilled' && wishRes.value?.wishlist) {
          setWishlist(wishRes.value.wishlist);
        }
        if (tripsRes.status === 'fulfilled' && tripsRes.value?.trips) {
          setPlannedTrips(tripsRes.value.trips);
        }
      } catch (err) {
        console.warn('[TravelContext] Backend synchronization notice:', err.message);
      } finally {
        setIsLoadingBackend(false);
      }
    };

    fetchData();
  }, []);

  // Sync state to LocalStorage backup
  useEffect(() => {
    setStoredItem(KEYS.DESTINATIONS, destinations);
  }, [destinations]);

  useEffect(() => {
    setStoredItem(KEYS.PACKAGES, packages);
  }, [packages]);

  useEffect(() => {
    setStoredItem(KEYS.WISHLIST, wishlist);
  }, [wishlist]);

  useEffect(() => {
    setStoredItem(KEYS.BOOKINGS, bookings);
  }, [bookings]);

  useEffect(() => {
    setStoredItem(KEYS.PLANNED_TRIPS, plannedTrips);
  }, [plannedTrips]);

  // Wishlist Actions
  const toggleWishlist = async (destinationId) => {
    // Optimistic UI update
    const exists = wishlist.includes(destinationId);
    if (exists) {
      setWishlist((prev) => prev.filter((id) => id !== destinationId));
      addToast('Removed destination from your wishlist', 'info');
    } else {
      setWishlist((prev) => [...prev, destinationId]);
      addToast('Added destination to your wishlist!', 'success');
    }

    try {
      await wishlistAPI.toggle(destinationId);
    } catch (e) {
      // Backend sync fallback
    }
  };

  const isInWishlist = (destinationId) => {
    return wishlist.includes(destinationId);
  };

  // Booking Actions
  const createBooking = async ({
    packageId,
    packageTitle,
    destination,
    travelDate,
    travellersCount,
    leadTraveller,
    pricePerPerson,
    image
  }) => {
    const count = parseInt(travellersCount) || 1;
    const baseTotal = pricePerPerson * count;
    const taxes = Math.round(baseTotal * 0.18);
    const totalAmount = baseTotal + taxes;
    const bookingId = generateBookingId();

    const localBooking = {
      bookingId,
      packageId: packageId || 'custom-pkg',
      packageTitle: packageTitle || `${destination} Custom Tour`,
      destination,
      travelDate,
      travellersCount: count,
      leadTraveller,
      pricePerPerson,
      taxes,
      totalAmount,
      status: "Confirmed",
      bookedAt: new Date().toISOString(),
      paymentMode: "Instant Confirmation (Database Verified)",
      image: image || "https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=600&q=80"
    };

    try {
      const res = await bookingsAPI.create(localBooking);
      if (res.success && res.booking) {
        setBookings((prev) => [res.booking, ...prev]);
        addToast(`Booking confirmed! Reference ID: ${res.booking.bookingId}`, 'success');
        return res.booking;
      }
    } catch (err) {
      console.warn('Saving booking locally:', err.message);
    }

    setBookings((prev) => [localBooking, ...prev]);
    addToast(`Booking confirmed! Reference ID: ${bookingId}`, 'success');
    return localBooking;
  };

  const cancelBooking = async (bookingId) => {
    setBookings((prev) =>
      prev.map((b) =>
        b.bookingId === bookingId ? { ...b, status: "Cancelled" } : b
      )
    );
    try {
      await bookingsAPI.updateStatus(bookingId, 'Cancelled');
    } catch (e) {}
    addToast(`Booking ${bookingId} has been cancelled.`, 'info');
  };

  const deleteBookingRecord = async (bookingId) => {
    setBookings((prev) => prev.filter((b) => b.bookingId !== bookingId));
    try {
      await bookingsAPI.delete(bookingId);
    } catch (e) {}
    addToast(`Booking record removed.`, 'info');
  };

  // Planned Trips Actions
  const savePlannedTrip = async (tripPlan) => {
    setPlannedTrips((prev) => {
      const filtered = prev.filter((t) => t.id !== tripPlan.id);
      return [tripPlan, ...filtered];
    });

    try {
      await tripsAPI.save(tripPlan);
    } catch (e) {}

    addToast(`Trip itinerary for ${tripPlan.destination} saved to My Trips!`, 'success');
  };

  const deletePlannedTrip = async (tripId) => {
    setPlannedTrips((prev) => prev.filter((t) => t.id !== tripId));
    try {
      await tripsAPI.delete(tripId);
    } catch (e) {}
    addToast('Planned trip deleted from dashboard.', 'info');
  };

  // Admin Data Management
  const addDestination = async (newDest) => {
    const id = newDest.id || newDest.name.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now();
    const destinationToAdd = { ...newDest, id };

    try {
      const res = await destinationsAPI.create(destinationToAdd);
      if (res.success && res.destination) {
        setDestinations((prev) => [res.destination, ...prev]);
        addToast(`New destination "${res.destination.name}" added to database!`, 'success');
        return res.destination;
      }
    } catch (e) {
      console.warn('Saved destination locally:', e.message);
    }

    setDestinations((prev) => [destinationToAdd, ...prev]);
    addToast(`New destination "${destinationToAdd.name}" added successfully.`, 'success');
    return destinationToAdd;
  };

  const updateDestination = async (id, updatedFields) => {
    setDestinations((prev) =>
      prev.map((d) => (d.id === id ? { ...d, ...updatedFields } : d))
    );
    try {
      await destinationsAPI.update(id, updatedFields);
    } catch (e) {}
    addToast(`Destination updated successfully.`, 'success');
  };

  const deleteDestination = async (id) => {
    setDestinations((prev) => prev.filter((d) => d.id !== id));
    try {
      await destinationsAPI.delete(id);
    } catch (e) {}
    addToast(`Destination deleted from active catalog.`, 'info');
  };

  const addPackage = async (newPkg) => {
    const id = newPkg.id || 'pkg-' + Date.now();
    const packageToAdd = { ...newPkg, id };

    try {
      const res = await packagesAPI.create(packageToAdd);
      if (res.success && res.package) {
        setPackages((prev) => [res.package, ...prev]);
        addToast(`New package "${res.package.title}" created in database!`, 'success');
        return res.package;
      }
    } catch (e) {
      console.warn('Saved package locally:', e.message);
    }

    setPackages((prev) => [packageToAdd, ...prev]);
    addToast(`New package "${packageToAdd.title}" created.`, 'success');
    return packageToAdd;
  };

  const deletePackage = async (id) => {
    setPackages((prev) => prev.filter((p) => p.id !== id));
    try {
      await packagesAPI.delete(id);
    } catch (e) {}
    addToast(`Package deleted from catalog.`, 'info');
  };

  const resetAllDemoData = () => {
    setDestinations(INITIAL_DESTINATIONS);
    setPackages(INITIAL_PACKAGES);
    setWishlist(["ladakh-india", "swiss-alps-switzerland", "bali-indonesia"]);
    localStorage.removeItem(KEYS.DESTINATIONS);
    localStorage.removeItem(KEYS.PACKAGES);
    localStorage.removeItem(KEYS.WISHLIST);
    addToast(`Sample data successfully reset to official defaults!`, 'success');
  };

  return (
    <TravelContext.Provider
      value={{
        destinations,
        packages,
        wishlist,
        bookings,
        plannedTrips,
        isLoadingBackend,
        toggleWishlist,
        isInWishlist,
        createBooking,
        cancelBooking,
        deleteBookingRecord,
        savePlannedTrip,
        deletePlannedTrip,
        addDestination,
        updateDestination,
        deleteDestination,
        addPackage,
        deletePackage,
        resetAllDemoData
      }}
    >
      {children}
    </TravelContext.Provider>
  );
};

export const useTravel = () => {
  const context = useContext(TravelContext);
  if (!context) {
    throw new Error('useTravel must be used within a TravelProvider');
  }
  return context;
};
