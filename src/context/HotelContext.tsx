import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { Room, ROOMS, applyHotelInfo } from '../data/hotelData';
import { fetchAvailability, fetchHotelInfo } from '../lib/bookingApi';

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

interface HotelContextType {
  currentPage: Page;
  selectedRoom: Room | null;
  searchState: SearchState;
  lightboxImage: { url: string; title: string; caption?: string } | null;
  notification: string | null;
  /** Free rooms per admin room type id for the searched dates, or null while loading / when the booking system can't be reached. */
  availability: Record<string, number> | null;
  /** Re-fetches availability for the searched dates (e.g. after a booking is refused for lack of rooms). */
  refreshAvailability: () => Promise<void>;
  navigateTo: (page: Page, params?: { roomId?: string; offerId?: string }) => void;
  updateSearch: (updates: Partial<SearchState>) => void;
  selectRoom: (room: Room | null) => void;
  openLightbox: (url: string, title: string, caption?: string) => void;
  closeLightbox: () => void;
  showNotification: (msg: string) => void;
}

/** yyyy-MM-dd of today + `days`, in the visitor's local time. */
const dayFromToday = (days: number) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

const defaultSearch: SearchState = {
  checkIn: dayFromToday(1),
  checkOut: dayFromToday(2),
  adults: 2,
  children: 0,
  roomsCount: 1,
  category: 'All',
};

const HotelContext = createContext<HotelContextType | undefined>(undefined);

export const HotelProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(ROOMS[0]);
  const [searchState, setSearchState] = useState<SearchState>(defaultSearch);
  const [lightboxImage, setLightboxImage] = useState<{ url: string; title: string; caption?: string } | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const [availability, setAvailability] = useState<Record<string, number> | null>(null);
  // Bumped once the admin system's rates and times are copied into ROOMS / HOTEL_INFO, so the pages re-render with them.
  const [, setInfoVersion] = useState(0);

  useEffect(() => {
    fetchHotelInfo()
      .then((info) => {
        applyHotelInfo(info);
        setInfoVersion((v) => v + 1);
      })
      .catch(() => {
        // The built-in rates stay on screen; booking itself reports the problem if the system is still unreachable.
      });
  }, []);

  // New dates: clear the old numbers so nothing stale is shown while the new ones load.
  useEffect(() => {
    setAvailability(null);
  }, [searchState.checkIn, searchState.checkOut]);

  // Fetch for the chosen dates, then keep it fresh: rooms can sell out while the page sits open, so refetch
  // on every page change, when the tab regains focus, and every 30 seconds. Refreshes keep the last numbers
  // on screen (no flicker) and keep them if a refresh fails.
  const datesKey = useRef('');
  datesKey.current = `${searchState.checkIn}|${searchState.checkOut}`;
  const refreshAvailability = useCallback(() => {
    const { checkIn, checkOut } = searchState;
    const key = `${checkIn}|${checkOut}`;
    return fetchAvailability(checkIn, checkOut)
      // Ignore an answer for dates the guest has since changed.
      .then((res) => { if (datesKey.current === key) setAvailability(res.available); })
      .catch(() => {});
  }, [searchState.checkIn, searchState.checkOut]);

  useEffect(() => {
    refreshAvailability();
    const onVisible = () => document.visibilityState === 'visible' && refreshAvailability();
    const timer = window.setInterval(onVisible, 30000);
    document.addEventListener('visibilitychange', onVisible);
    window.addEventListener('focus', onVisible);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener('visibilitychange', onVisible);
      window.removeEventListener('focus', onVisible);
    };
  }, [refreshAvailability, currentPage]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification((curr) => (curr === msg ? null : curr));
    }, 4000);
  };

  const navigateTo = (page: Page, params?: { roomId?: string; offerId?: string }) => {
    if (params?.roomId) {
      const found = ROOMS.find((r) => r.id === params.roomId);
      if (found) setSelectedRoom(found);
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

  return (
    <HotelContext.Provider
      value={{
        currentPage,
        selectedRoom,
        searchState,
        lightboxImage,
        notification,
        availability,
        refreshAvailability,
        navigateTo,
        updateSearch,
        selectRoom,
        openLightbox,
        closeLightbox,
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
