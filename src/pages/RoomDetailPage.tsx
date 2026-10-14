import React, { useEffect, useRef, useState } from 'react';
import { DateRangePicker } from '../components/DateRangePicker';
import { useHotel } from '../context/HotelContext';
import { ROOMS, Room, HOTEL_INFO, IMAGES } from '../data/hotelData';
import {
  Star,
  Users,
  Maximize2,
  Bed,
  Check,
  Calendar,
  ShieldCheck,
  Clock,
  Sparkles,
  ArrowRight,
  ChevronLeft,
  Share2,
  Heart,
  Eye,
  Info
} from 'lucide-react';
import { Select } from '../components/Select';

export const RoomDetailPage: React.FC = () => {
  const { selectedRoom, selectRoom, searchState, updateSearch, navigateTo, openLightbox, showNotification } = useHotel();
  const room = selectedRoom || ROOMS[0];

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const bookingCardRef = useRef<HTMLDivElement>(null);
  const [showMobileBar, setShowMobileBar] = useState(true);

  // On mobile the booking card sits below all the room details; show a sticky
  // reserve bar until the card itself scrolls into view.
  useEffect(() => {
    const update = () => {
      const card = bookingCardRef.current;
      if (card) setShowMobileBar(card.getBoundingClientRect().top > window.innerHeight);
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  // Calculate stay duration and costs
  const checkInDate = new Date(searchState.checkIn);
  const checkOutDate = new Date(searchState.checkOut);
  const diffTime = Math.max(1, checkOutDate.getTime() - checkInDate.getTime());
  const nightsCount = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  const basePrice = room.pricePerNight * nightsCount * searchState.roomsCount;
  const taxes = Math.round(basePrice * 0.10);
  const serviceCharge = Math.round(basePrice * 0.05);
  const totalAmount = basePrice + taxes + serviceCharge;

  const relatedRooms = ROOMS.filter((r) => r.id !== room.id).slice(0, 3);

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    showNotification('Suite link copied to clipboard.');
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
    showNotification(!isSaved ? 'Suite saved to your wishlist.' : 'Removed from wishlist.');
  };

  const handleReserve = () => {
    selectRoom(room);
    navigateTo('booking', { roomId: room.id });
  };

  return (
    <div className="space-y-12 pb-20 pt-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Breadcrumb & Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigateTo('rooms')}
            className="flex items-center gap-1.5 text-xs font-medium text-stone-600 hover:text-stone-900 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to All Accommodations</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSave}
              className={`p-2 rounded-full border transition-colors ${
                isSaved ? 'bg-rose-50 border-rose-200 text-rose-600' : 'border-stone-200 text-stone-600 hover:bg-stone-50'
              }`}
              title="Save to Wishlist"
            >
              <Heart className={`w-4 h-4 ${isSaved ? 'fill-rose-600' : ''}`} />
            </button>
            <button
              onClick={handleShare}
              className="p-2 rounded-full border border-stone-200 text-stone-600 hover:bg-stone-50 transition-colors"
              title="Share Room"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 1. Large Photo Gallery & Thumbnails */}
        <div className="space-y-4">
          {/* Main Large Photo */}
          <div
            className="relative aspect-[16/9] md:aspect-[21/9] rounded-2xl overflow-hidden bg-stone-900 shadow-xl group cursor-pointer"
            onClick={() => openLightbox(room.images[activeImageIndex], room.name, room.tagline)}
          >
            <img
              src={room.images[activeImageIndex] || room.images[0]}
              alt={room.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-102"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-40" />

            <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 flex items-end justify-between gap-3 text-white">
              <span className="min-w-0 truncate text-xs sm:text-sm font-serif italic text-amber-200">
                {room.tagline}
              </span>
              <div className="shrink-0 bg-stone-950/80 p-2 sm:px-3 sm:py-1.5 rounded-md text-xs flex items-center gap-1.5 text-stone-200">
                <Eye className="w-3.5 h-3.5 text-amber-300" />
                <span className="hidden sm:inline">Click to view full screen</span>
              </div>
            </div>
          </div>

          {/* Thumbnails row */}
          <div className="grid grid-cols-4 gap-2 sm:gap-4">
            {room.images.map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveImageIndex(idx)}
                className={`relative aspect-[16/10] rounded-lg overflow-hidden border-2 transition-all ${
                  activeImageIndex === idx ? 'border-amber-500 ring-2 ring-amber-300/40' : 'border-transparent opacity-75 hover:opacity-100'
                }`}
              >
                <img
                  src={img}
                  alt={`${room.name} photo ${idx + 1}`}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
            {/* Additional view from resort */}
            <button
              type="button"
              onClick={() => openLightbox(IMAGES.hero, 'The Aurelia Estate Panorama', 'Panoramic cliffside view')}
              className="relative aspect-[16/10] rounded-lg overflow-hidden border border-stone-200 bg-stone-900 group"
            >
              <img
                src={IMAGES.hero}
                alt="Estate grounds"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform"
              />
              <div className="absolute inset-0 flex items-center justify-center text-center text-white text-[10px] sm:text-xs font-medium leading-tight">
                <span>View Grounds</span>
              </div>
            </button>
          </div>
        </div>

        {/* 2. Room Information + Interactive Booking Calculator */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Specifications & Editorial Description */}
          <div className="lg:col-span-7 space-y-10">
            {/* Title & Metadata Strip */}
            <div className="space-y-3 pb-6 border-b border-stone-200">
              <div className="flex items-center gap-3">
                <span className="text-xs uppercase font-mono tracking-widest text-amber-800">
                  {room.category}
                </span>
                <span aria-hidden="true" className="text-stone-300">·</span>
                <div className="flex items-center gap-1 text-xs text-stone-600">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span className="font-semibold text-stone-900 tabular-nums">{room.rating.toFixed(2)}</span>
                  <span>({room.reviewCount} reviews)</span>
                </div>
              </div>

              <h1 className="text-3xl sm:text-4xl font-serif text-stone-900 font-light">
                {room.name}
              </h1>

              {/* Clean unboxed metadata strip */}
              <div className="flex items-center gap-3 text-xs text-stone-600 flex-wrap pt-1">
                <span>{room.sizeSqM} m² ({room.sizeSqFt} sq ft)</span>
                <span aria-hidden="true">·</span>
                <span>{room.bedConfiguration}</span>
                <span aria-hidden="true">·</span>
                <span>Max {room.maxAdults} Adults + {room.maxChildren} Children</span>
                <span aria-hidden="true">·</span>
                <span>{room.view}</span>
              </div>
            </div>

            {/* Editorial Description */}
            <div className="space-y-4">
              <h2 className="text-xl font-serif text-stone-900 font-normal">
                Residence Overview
              </h2>
              {room.longDescription.map((p, i) => (
                <p key={i} className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                  {p}
                </p>
              ))}
            </div>

            {/* Room Features */}
            <div className="space-y-4 pt-4 border-t border-stone-200">
              <h3 className="text-lg font-serif text-stone-900">
                Sanctuary Highlights
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {room.features.map((feat, i) => (
                  <div key={i} className="flex items-center gap-2.5 p-3 rounded-lg bg-stone-50 border border-stone-200/60 text-xs text-stone-800">
                    <Sparkles className="w-4 h-4 text-amber-700 shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* In-Suite Amenities */}
            <div className="space-y-4 pt-4 border-t border-stone-200">
              <h3 className="text-lg font-serif text-stone-900">
                In-Suite Luxuries & Amenities
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs text-stone-600">
                {room.amenities.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Policies: Check-in / Cancellation */}
            <div className="space-y-4 pt-4 border-t border-stone-200 bg-stone-50 p-5 rounded-xl border border-stone-200/80">
              <h3 className="text-base font-serif text-stone-900 flex items-center gap-2">
                <Info className="w-4 h-4 text-amber-700" />
                <span>Stay Policies & Inclusions</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-stone-600">
                <div>
                  <p className="font-semibold text-stone-800">Check-In & Departure</p>
                  <p className="mt-0.5">Check-in: from {HOTEL_INFO.checkInTime}</p>
                  <p>Check-out: until {HOTEL_INFO.checkOutTime}</p>
                </div>
                <div>
                  <p className="font-semibold text-stone-800">Cancellation Terms</p>
                  <p className="mt-0.5 leading-relaxed">{HOTEL_INFO.cancellationPolicyDefault}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Sticky Reservation Purchase Module */}
          <div ref={bookingCardRef} className="lg:col-span-5 lg:sticky lg:top-24 scroll-mt-24">
            <div className="bg-white rounded-2xl p-6 sm:p-7 border border-stone-200 shadow-xl space-y-6">
              {/* Header Price */}
              <div className="flex items-baseline justify-between pb-4 border-b border-stone-100">
                <div>
                  <span className="text-[11px] text-stone-400 uppercase tracking-wider block">Nightly Rate</span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-3xl font-serif font-bold text-stone-900 tabular-nums">
                      ₱{room.pricePerNight.toLocaleString()}
                    </span>
                    <span className="text-xs text-stone-500">/ night</span>
                  </div>
                </div>
                {room.originalPrice && (
                  <div className="text-right">
                    <span className="text-xs text-stone-400 line-through tabular-nums">₱{room.originalPrice.toLocaleString()}</span>
                    <span className="text-[11px] text-emerald-700 block font-medium">Save ₱{(room.originalPrice - room.pricePerNight).toLocaleString()}</span>
                  </div>
                )}
              </div>

              {/* Date and Guest Pickers */}
              <div className="space-y-3">
                <DateRangePicker
                  variant="compact"
                  checkIn={searchState.checkIn}
                  checkOut={searchState.checkOut}
                  onChange={updateSearch}
                />

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="border border-stone-200 rounded-lg p-2.5">
                    <label className="block text-[10px] uppercase tracking-wider text-stone-500">Guests</label>
                    <Select
                      value={String(searchState.adults)}
                      onChange={(v) => updateSearch({ adults: Number(v) })}
                      options={[
                        { value: "1", label: "1 Adult" },
                        { value: "2", label: "2 Adults" },
                        { value: "3", label: "3 Adults" },
                        { value: "4", label: "4 Adults" },
                      ]}
                      variant="bare"
                      className="font-semibold mt-0.5"
                    />
                  </div>
                  <div className="border border-stone-200 rounded-lg p-2.5">
                    <label className="block text-[10px] uppercase tracking-wider text-stone-500">Rooms</label>
                    <Select
                      value={String(searchState.roomsCount)}
                      onChange={(v) => updateSearch({ roomsCount: Number(v) })}
                      options={[
                        { value: "1", label: "1 Room" },
                        { value: "2", label: "2 Rooms" },
                        { value: "3", label: "3 Rooms" },
                      ]}
                      variant="bare"
                      className="font-semibold mt-0.5"
                    />
                  </div>
                </div>
              </div>

              {/* Price Calculation Breakdown */}
              <div className="space-y-2.5 pt-3 border-t border-stone-100 text-xs text-stone-600">
                <div className="flex justify-between">
                  <span>₱{room.pricePerNight.toLocaleString()} × {nightsCount} nights {searchState.roomsCount > 1 ? `× ${searchState.roomsCount} suites` : ''}</span>
                  <span className="font-semibold text-stone-900 tabular-nums">₱{basePrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>State & Hospitality Tax (10%)</span>
                  <span className="font-semibold text-stone-900 tabular-nums">₱{taxes.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Estate Service & Butler Fee (5%)</span>
                  <span className="font-semibold text-stone-900 tabular-nums">₱{serviceCharge.toLocaleString()}</span>
                </div>
                <div className="pt-2 border-t border-stone-200 flex justify-between text-sm">
                  <span className="font-semibold text-stone-900">Total Price</span>
                  <span className="font-bold text-stone-950 font-serif text-lg tabular-nums">₱{totalAmount.toLocaleString()}</span>
                </div>
              </div>

              {/* Primary Reserve CTA Button */}
              <button
                type="button"
                onClick={handleReserve}
                className="w-full py-3.5 px-4 bg-amber-300 hover:bg-amber-200 active:bg-amber-400 text-stone-950 font-semibold text-xs tracking-wider uppercase rounded-lg transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Reserve This Suite</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="space-y-1.5 text-center text-[11px] text-stone-400">
                <p>No immediate payment required for flexible reservations.</p>
                <p className="text-emerald-700 font-medium">Free cancellation until 48 hours before arrival</p>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Related Rooms Section */}
        <div className="pt-16 border-t border-stone-200 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
            <div>
              <span className="text-xs uppercase tracking-widest text-amber-700 font-semibold block">
                Alternate Residences
              </span>
              <h3 className="text-2xl font-serif text-stone-900">
                Other Accommodations You May Love
              </h3>
            </div>
            <button
              onClick={() => navigateTo('rooms')}
              className="self-start sm:self-auto text-xs font-semibold uppercase tracking-wider text-amber-800 hover:text-stone-900"
            >
              View All {ROOMS.length} Rooms
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedRooms.map((relRoom) => (
              <div
                key={relRoom.id}
                onClick={() => {
                  selectRoom(relRoom);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="bg-white rounded-xl overflow-hidden border border-stone-200 shadow-sm hover:shadow-lg transition-all group cursor-pointer flex flex-col justify-between"
              >
                <div className="aspect-[16/10] overflow-hidden bg-stone-100">
                  <img
                    src={relRoom.images[0]}
                    alt={relRoom.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-4 space-y-2">
                  <span className="text-[10px] font-mono uppercase text-amber-800">
                    {relRoom.category}
                  </span>
                  <h4 className="font-serif text-base text-stone-900 group-hover:text-amber-900 transition-colors">
                    {relRoom.name}
                  </h4>
                  <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-xs">
                    <span className="font-bold font-serif text-stone-900 tabular-nums">
                      ₱{relRoom.pricePerNight.toLocaleString()} <span className="font-sans font-normal text-stone-500 text-[10px]">/ night</span>
                    </span>
                    <span className="text-amber-700 font-semibold text-[11px] group-hover:translate-x-0.5 transition-transform inline-flex items-center">
                      Explore Suite →
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile sticky reserve bar */}
      <div
        className={`lg:hidden fixed inset-x-3 bottom-[calc(96px+env(safe-area-inset-bottom))] z-30 rounded-2xl border border-stone-200 bg-white/95 backdrop-blur-md px-4 py-3 shadow-[0_8px_24px_rgb(0_0_0/0.18)] transition-all duration-300 ${
          showMobileBar ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0 pointer-events-none'
        }`}
        aria-hidden={!showMobileBar}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="font-serif text-lg font-bold text-stone-900 tabular-nums leading-tight">
              ₱{room.pricePerNight.toLocaleString()} <span className="font-sans text-xs font-normal text-stone-500">/ night</span>
            </p>
            <p className="text-[11px] text-stone-500 truncate">
              ₱{totalAmount.toLocaleString()} total · {nightsCount} {nightsCount === 1 ? 'night' : 'nights'}
            </p>
          </div>
          <button
            type="button"
            onClick={handleReserve}
            tabIndex={showMobileBar ? 0 : -1}
            className="shrink-0 py-3 px-5 bg-amber-300 hover:bg-amber-200 active:bg-amber-400 text-stone-950 font-semibold text-xs tracking-wider uppercase rounded-lg transition-colors shadow-md flex items-center gap-2 cursor-pointer"
          >
            <span>Reserve</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
