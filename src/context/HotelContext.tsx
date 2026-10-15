import React, { createContext, useContext, useState, useEffect } from 'react';
import { Room, ROOMS, SpecialOffer, BookingAddOn } from '../data/hotelData';

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
  membershipTier: 'K Grand Member';
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

// Demo guest used by the sign-in prototype until real accounts are connected.
const defaultUser: UserProfile = {
  isLoggedIn: false,
  title: 'Mr.',
  firstName: 'Juan',
  lastName: 'Dela Cruz',
  email: 'juan.delacruz@example.com',
  phone: '+63 917 123 4567',
  country: 'Philippines',
  membershipTier: 'K Grand Member',
  memberSince: '2026',
  stayCount: 0,
  preferences: {
    pillow: 'Standard',
    floor: 'No Preference',
    newspaper: '',
    dietary: '',
    specialOccasion: ''
  }
};

const initialBookings: BookingRecord[] = [];

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
    showNotification('Welcome back to The K Grand Hotel.');
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
