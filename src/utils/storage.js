import { INITIAL_DESTINATIONS } from '../data/destinationsData';
import { INITIAL_PACKAGES } from '../data/packagesData';

const KEYS = {
  AUTH_USER: 'travelora_auth_user',
  WISHLIST: 'travelora_wishlist',
  BOOKINGS: 'travelora_bookings',
  PLANNED_TRIPS: 'travelora_planned_trips',
  DESTINATIONS: 'travelora_destinations_v1',
  PACKAGES: 'travelora_packages_v1'
};

export const getStoredItem = (key, fallback) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    console.error(`Error reading ${key} from localStorage:`, e);
    return fallback;
  }
};

export const setStoredItem = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error saving ${key} to localStorage:`, e);
  }
};

// Seed initial state if first visit
export const initializeStorage = () => {
  // 1. Initial user if not present
  if (!localStorage.getItem(KEYS.AUTH_USER)) {
    const demoUser = {
      id: "usr_demo_01",
      name: "Ansh Sharma",
      email: "ansh.sharma@travelora.demo",
      phone: "+91 98765 43210",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
      joinedDate: "January 2026",
      role: "Travel Explorer",
      passportReady: true
    };
    setStoredItem(KEYS.AUTH_USER, demoUser);
  }

  // 2. Initial Wishlist if not present
  if (!localStorage.getItem(KEYS.WISHLIST)) {
    setStoredItem(KEYS.WISHLIST, ["ladakh-india", "swiss-alps-switzerland", "bali-indonesia"]);
  }

  // 3. Initial Bookings if not present
  if (!localStorage.getItem(KEYS.BOOKINGS)) {
    const sampleBookings = [
      {
        bookingId: "TRV-2026-LD789A",
        packageId: "pkg-ladakh-expedition",
        packageTitle: "Magical Ladakh Expedition",
        destination: "Ladakh, India",
        travelDate: "2026-11-15",
        travellersCount: 2,
        leadTraveller: {
          fullName: "Ansh Sharma",
          email: "ansh.sharma@travelora.demo",
          phone: "+91 98765 43210",
          specialRequests: "Twin sharing room with mountain view"
        },
        pricePerPerson: 28999,
        taxes: 5219,
        totalAmount: 63217,
        status: "Confirmed",
        bookedAt: "2026-10-24T14:30:00.000Z",
        paymentMode: "Demo Instant Confirmation (No Real Charge)",
        image: "https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=600&q=80"
      },
      {
        bookingId: "TRV-2026-GA421C",
        packageId: "pkg-goa-bliss",
        packageTitle: "Goa Coastal Bliss & Heritage Retreat",
        destination: "Goa, India",
        travelDate: "2026-12-05",
        travellersCount: 1,
        leadTraveller: {
          fullName: "Ansh Sharma",
          email: "ansh.sharma@travelora.demo",
          phone: "+91 98765 43210",
          specialRequests: "High floor quiet room"
        },
        pricePerPerson: 16499,
        taxes: 2969,
        totalAmount: 19468,
        status: "Confirmed",
        bookedAt: "2026-10-28T09:15:00.000Z",
        paymentMode: "Demo Instant Confirmation (No Real Charge)",
        image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=600&q=80"
      }
    ];
    setStoredItem(KEYS.BOOKINGS, sampleBookings);
  }

  // 4. Initial Destinations
  if (!localStorage.getItem(KEYS.DESTINATIONS)) {
    setStoredItem(KEYS.DESTINATIONS, INITIAL_DESTINATIONS);
  }

  // 5. Initial Packages
  if (!localStorage.getItem(KEYS.PACKAGES)) {
    setStoredItem(KEYS.PACKAGES, INITIAL_PACKAGES);
  }
};

export { KEYS };
