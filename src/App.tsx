/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Suspense, lazy, useEffect } from 'react';
import { AnimatePresence, MotionConfig, motion } from 'motion/react';
import { HotelProvider, useHotel } from './context/HotelContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { MobileBottomNav } from './components/MobileBottomNav';
import { LightboxModal } from './components/LightboxModal';
import { ToastNotification } from './components/ToastNotification';

// Pages. Home is in the main bundle (it is the first page); the others load on demand, and are fetched in the
// background once the home page has loaded so moving between pages stays instant.
import { HomePage } from './pages/HomePage';

const loaders = {
  rooms: () => import('./pages/RoomsPage'),
  roomDetail: () => import('./pages/RoomDetailPage'),
  booking: () => import('./pages/BookingFlowPage'),
  info: () => import('./pages/InformationPages'),
  checkBooking: () => import('./pages/CheckBookingPage'),
};

const RELOAD_FLAG = 'kgrand-chunk-reload';

/**
 * A page loaded on demand. If its file is gone (a new version was deployed while this tab was open), the page is reloaded once
 * to pick up the new version instead of showing a broken page.
 */
function page<M, K extends keyof M>(load: () => Promise<M>, name: K) {
  return lazy(() =>
    load().then(
      (m) => {
        sessionStorage.removeItem(RELOAD_FLAG);
        return { default: m[name] as React.ComponentType<any> };
      },
      (err) => {
        if (!sessionStorage.getItem(RELOAD_FLAG)) {
          sessionStorage.setItem(RELOAD_FLAG, '1');
          window.location.reload();
          return new Promise<never>(() => {});
        }
        throw err;
      },
    ),
  );
}

const RoomsPage = page(loaders.rooms, 'RoomsPage');
const RoomDetailPage = page(loaders.roomDetail, 'RoomDetailPage');
const BookingFlowPage = page(loaders.booking, 'BookingFlowPage');
const AboutPage = page(loaders.info, 'AboutPage');
const AmenitiesPage = page(loaders.info, 'AmenitiesPage');
const OffersPage = page(loaders.info, 'OffersPage');
const GalleryPage = page(loaders.info, 'GalleryPage');
const ContactPage = page(loaders.info, 'ContactPage');
const FaqsPage = page(loaders.info, 'FaqsPage');
const LegalPage = page(loaders.info, 'LegalPage');
const CheckBookingPage = page(loaders.checkBooking, 'CheckBookingPage');

/** Shown in the rare case a page is still downloading. */
const PageLoading = () => <div className="min-h-[60vh]" aria-busy="true" />;

const MainContent: React.FC = () => {
  const { currentPage } = useHotel();

  // Fetch the other pages in the background once the browser is idle after the first page.
  useEffect(() => {
    const preload = () => Object.values(loaders).forEach((load) => load().catch(() => {}));
    if ('requestIdleCallback' in window) {
      const id = window.requestIdleCallback(preload, { timeout: 3000 });
      return () => window.cancelIdleCallback(id);
    }
    const timer = setTimeout(preload, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="min-h-screen flex flex-col justify-between bg-stone-950">
      {/* Fade between pages through the dark backdrop of <main>; keyed on the page so each navigation replays it. */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={currentPage}
          className="flex-1 bg-stone-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.3, ease: 'easeOut' } }}
          exit={{ opacity: 0, transition: { duration: 0.15, ease: 'easeIn' } }}
        >
        <Suspense fallback={<PageLoading />}>
        {currentPage === 'home' && <HomePage />}
        {currentPage === 'rooms' && <RoomsPage />}
        {currentPage === 'room-detail' && <RoomDetailPage />}
        {currentPage === 'booking' && <BookingFlowPage />}
        {currentPage === 'check-booking' && <CheckBookingPage />}
        {currentPage === 'about' && <AboutPage />}
        {currentPage === 'amenities' && <AmenitiesPage />}
        {currentPage === 'offers' && <OffersPage />}
        {currentPage === 'gallery' && <GalleryPage />}
        {currentPage === 'contact' && <ContactPage />}
        {currentPage === 'faqs' && <FaqsPage />}
        {currentPage === 'privacy' && <LegalPage type="privacy" />}
        {currentPage === 'terms' && <LegalPage type="terms" />}
        </Suspense>
        </motion.div>
      </AnimatePresence>
      <Footer />
    </main>
  );
};

export default function App() {
  return (
    <HotelProvider>
      <MotionConfig reducedMotion="user">
      <div className="min-h-screen bg-stone-50 text-stone-900 selection:bg-amber-200 selection:text-stone-900 flex flex-col">
        <Navbar />
        <div className="flex-1">
          <MainContent />
        </div>
        <MobileBottomNav />
        <LightboxModal />
        <ToastNotification />
      </div>
      </MotionConfig>
    </HotelProvider>
  );
}
