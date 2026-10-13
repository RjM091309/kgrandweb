import React, { createContext, useContext, useState, useEffect } from 'react';
import { Room, ROOMS, SPECIAL_OFFERS, SpecialOffer, BookingAddOn, BOOKING_ADDONS } from '../data/hotelData';

export type Page =
  | 'home'
  | 'rooms'
  | 'room-detail'
  | 'booking'
  | 'amenities'
  | 'offers'
  | 'gallery'
  | 'about'
  | 'contact'
  | 'faqs'
  | 'signin'
  | 'register'
  | 'forgot-password'
  | 'profile'
  | 'my-bookings'
  | 'privacy'
  | 'terms';

export interface SearchState {
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  roomsCount: number;
  category: string;
}

export interface GuestInfo {
  title: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  specialRequests: string;
  estimatedArrival: string;
}

export interface BookingRecord {
  reference: string;
  room: Room;
  checkIn: string;
  checkOut: string;
  nights: number;
  adults: number;
  children: number;
  roomsCount: number;
  guestInfo: GuestInfo;
  addons: BookingAddOn[];
  appliedOffer?: SpecialOffer | null;
  baseAmount: number;
  taxAmount: number;
  serviceCharge: number;
  totalAmount: number;
  status: 'Confirmed' | 'Completed' | 'Cancelled';
  createdAt: string;
  paymentMethod: string;
}

export interface UserProfile {
  isLoggedIn: boolean;
  title: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  membershipTier: 'Aurelia Ambassador' | 'Aurelia Elite' | 'Aurelia Member';
  memberSince: string;
  stayCount: number;
  preferences: {
    pillow: string;
    floor: string;
    newspaper: string;
    dietary: string;
    specialOccasion: string;
  };
}

interface HotelContextType {
  currentPage: Page;
  selectedRoom: Room | null;
  searchState: SearchState;
  user: UserProfile;
  userBookings: BookingRecord[];
  activeBooking: BookingRecord | null;
  lightboxImage: { url: string; title: string; caption?: string } | null;
  notification: string | null;
  navigateTo: (page: Page, params?: { roomId?: string; offerId?: string; bookingRef?: string }) => void;
  updateSearch: (updates: Partial<SearchState>) => void;
  selectRoom: (room: Room | null) => void;
  openLightbox: (url: string, title: string, caption?: string) => void;
  closeLightbox: () => void;
  loginUser: (email: string, name?: string) => void;
  logoutUser: () => void;
  updateUserProfile: (updates: Partial<UserProfile>) => void;
  completeNewBooking: (booking: BookingRecord) => void;
  cancelBooking: (reference: string) => void;
  showNotification: (msg: string) => void;
}

const defaultSearch: SearchState = {
  checkIn: '2026-10-18',
  checkOut: '2026-10-22',
  adults: 2,
  children: 0,
  roomsCount: 1,
  category: 'All',
};

const defaultUser: UserProfile = {
  isLoggedIn: false,
  title: 'Lord',
  firstName: 'Alexander',
  lastName: 'Vane-Tempest',
  email: 'alexander.vane@heritage.co.uk',
  phone: '+44 20 7946 0912',
  country: 'United Kingdom',
  membershipTier: 'Aurelia Elite',
  memberSince: '2024',
  stayCount: 3,
  preferences: {
    pillow: 'Feather & Goose Down (Firm)',
    floor: 'High Floor (Penthouse / Top Tier)',
    newspaper: 'Financial Times & Le Figaro',
    dietary: 'No shellfish, sparkling mineral water on arrival',
    specialOccasion: 'Wedding Anniversary'
  }
};

const initialBookings: BookingRecord[] = [
  {
    reference: 'AUR-8429-X',
    room: ROOMS[0], // Presidential Suite
    checkIn: '2026-11-12',
    checkOut: '2026-11-16',
    nights: 4,
    adults: 2,
    children: 0,
    roomsCount: 1,
    guestInfo: {
      title: 'Lord',
      firstName: 'Alexander',
      lastName: 'Vane-Tempest',
      email: 'alexander.vane@heritage.co.uk',
      phone: '+44 20 7946 0912',
      country: 'United Kingdom',
      specialRequests: 'High floor preferred, sparkling San Pellegrino in suite on arrival.',
      estimatedArrival: '15:30'
    },
    addons: [BOOKING_ADDONS[0], BOOKING_ADDONS[1]], // Breakfast + Limousine
    appliedOffer: SPECIAL_OFFERS[0],
    baseAmount: 3800,
    taxAmount: 380,
    serviceCharge: 190,
    totalAmount: 4370,
    status: 'Confirmed',
    createdAt: '2026-09-15',
    paymentMethod: 'Credit Card (ending in 8842)'
  },
  {
    reference: 'AUR-3105-V',
    room: ROOMS[1], // Deluxe Ocean Villa
    checkIn: '2026-06-20',
    checkOut: '2026-06-25',
    nights: 5,
    adults: 2,
    children: 1,
    roomsCount: 1,
    guestInfo: {
      title: 'Lord',
      firstName: 'Alexander',
      lastName: 'Vane-Tempest',
      email: 'alexander.vane@heritage.co.uk',
      phone: '+44 20 7946 0912',
      country: 'United Kingdom',
      specialRequests: 'Baby cot setup in second dressing quarter.',
      estimatedArrival: '14:00'
    },
    addons: [BOOKING_ADDONS[0]],
    baseAmount: 6750,
    taxAmount: 675,
    serviceCharge: 337,
    totalAmount: 7762,
    status: 'Completed',
    createdAt: '2026-05-10',
    paymentMethod: 'American Express (ending in 1004)'
  }
];

const HotelContext = createContext<HotelContextType | undefined>(undefined);

export const HotelProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(ROOMS[0]);
  const [searchState, setSearchState] = useState<SearchState>(defaultSearch);
  const [user, setUser] = useState<UserProfile>(defaultUser);
  const [userBookings, setUserBookings] = useState<BookingRecord[]>(initialBookings);
  const [activeBooking, setActiveBooking] = useState<BookingRecord | null>(null);
  const [lightboxImage, setLightboxImage] = useState<{ url: string; title: string; caption?: string } | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification((curr) => (curr === msg ? null : curr));
    }, 4000);
  };

  const navigateTo = (page: Page, params?: { roomId?: string; offerId?: string; bookingRef?: string }) => {
    if (params?.roomId) {
      const found = ROOMS.find((r) => r.id === params.roomId);
      if (found) setSelectedRoom(found);
    }
    if (params?.bookingRef) {
      const found = userBookings.find((b) => b.reference === params.bookingRef);
      if (found) setActiveBooking(found);
    }
    setCurrentPage(page);
  };

  const updateSearch = (updates: Partial<SearchState>) => {
    setSearchState((prev) => ({ ...prev, ...updates }));
  };

  const selectRoom = (room: Room | null) => {
    setSelectedRoom(room);
  };

  const openLightbox = (url: string, title: string, caption?: string) => {
    setLightboxImage({ url, title, caption });
  };

  const closeLightbox = () => {
    setLightboxImage(null);
  };

  const loginUser = (email: string, name?: string) => {
    setUser((prev) => ({
      ...prev,
      isLoggedIn: true,
      email: email || prev.email,
      firstName: name ? name.split(' ')[0] : prev.firstName,
      lastName: name && name.split(' ').length > 1 ? name.split(' ').slice(1).join(' ') : prev.lastName,
    }));
    showNotification('Welcome back to Aurelia Grand Hotel & Residences.');
  };

  const logoutUser = () => {
    setUser((prev) => ({ ...prev, isLoggedIn: false }));
    showNotification('You have been signed out successfully.');
    if (currentPage === 'profile' || currentPage === 'my-bookings') {
      setCurrentPage('home');
    }
  };

  const updateUserProfile = (updates: Partial<UserProfile>) => {
    setUser((prev) => ({ ...prev, ...updates }));
    showNotification('Your preferences and profile were updated.');
  };

  const completeNewBooking = (booking: BookingRecord) => {
    setUserBookings((prev) => [booking, ...prev]);
    setActiveBooking(booking);
    showNotification(`Reservation ${booking.reference} confirmed!`);
  };

  const cancelBooking = (reference: string) => {
    setUserBookings((prev) =>
      prev.map((b) => (b.reference === reference ? { ...b, status: 'Cancelled' as const } : b))
    );
    showNotification(`Reservation ${reference} has been cancelled in accordance with our terms.`);
  };

  return (
    <HotelContext.Provider
      value={{
        currentPage,
        selectedRoom,
        searchState,
        user,
        userBookings,
        activeBooking,
        lightboxImage,
        notification,
        navigateTo,
        updateSearch,
        selectRoom,
        openLightbox,
        closeLightbox,
        loginUser,
        logoutUser,
        updateUserProfile,
        completeNewBooking,
        cancelBooking,
        showNotification,
      }}
    >
      {children}
    </HotelContext.Provider>
  );
};

export const useHotel = () => {
  const context = useContext(HotelContext);
  if (!context) throw new Error('useHotel must be used within HotelProvider');
  return context;
};
