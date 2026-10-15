/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AnimatePresence, MotionConfig, motion } from 'motion/react';
import { HotelProvider, useHotel } from './context/HotelContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { MobileBottomNav } from './components/MobileBottomNav';
import { LightboxModal } from './components/LightboxModal';
import { ToastNotification } from './components/ToastNotification';

// Pages
import { HomePage } from './pages/HomePage';
import { RoomsPage } from './pages/RoomsPage';
import { RoomDetailPage } from './pages/RoomDetailPage';
import { BookingFlowPage } from './pages/BookingFlowPage';
import {
  SignInPage,
  RegisterPage,
  ForgotPasswordPage,
  ProfilePage,
  MyBookingsPage
} from './pages/AccountPages';
import {
  AboutPage,
  AmenitiesPage,
  OffersPage,
  GalleryPage,
  ContactPage,
  FaqsPage,
  LegalPage
} from './pages/InformationPages';

const MainContent: React.FC = () => {
  const { currentPage } = useHotel();

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
        {currentPage === 'home' && <HomePage />}
        {currentPage === 'rooms' && <RoomsPage />}
        {currentPage === 'room-detail' && <RoomDetailPage />}
        {currentPage === 'booking' && <BookingFlowPage />}
        {currentPage === 'about' && <AboutPage />}
        {currentPage === 'amenities' && <AmenitiesPage />}
        {currentPage === 'offers' && <OffersPage />}
        {currentPage === 'gallery' && <GalleryPage />}
        {currentPage === 'contact' && <ContactPage />}
        {currentPage === 'faqs' && <FaqsPage />}
        {currentPage === 'signin' && <SignInPage />}
        {currentPage === 'register' && <RegisterPage />}
        {currentPage === 'forgot-password' && <ForgotPasswordPage />}
        {currentPage === 'profile' && <ProfilePage />}
        {currentPage === 'my-bookings' && <MyBookingsPage />}
        {currentPage === 'privacy' && <LegalPage type="privacy" />}
        {currentPage === 'terms' && <LegalPage type="terms" />}
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
