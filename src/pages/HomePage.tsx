import React, { useEffect, useState } from 'react';
import { useHotel } from '../context/HotelContext';
import {
  ROOMS,
  AMENITIES,
  SPECIAL_OFFERS,
  REVIEWS,
  GALLERY_ITEMS,
  NEARBY_ATTRACTIONS,
  HOTEL_INFO,
  IMAGES,
  Room
} from '../data/hotelData';
import { HeroSearchPanel } from '../components/HeroSearchPanel';
import {
  Flame,
  BedDouble,
  Zap,
  Sparkles,
  Waves,
  Utensils,
  Sun,
  Activity,
  Compass,
  Star,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  MapPin,
  Clock,
  Car,
  Wifi,
  Eye,
  CalendarCheck
} from 'lucide-react';

// Home page "Special Offers" banner is hidden until K Grand packages are ready.
const SHOW_OFFERS_BANNER = false;

const HERO_SLIDES = [
  { src: IMAGES.entrance, alt: 'The K Grand Hotel entrance at night' },
  { src: IMAGES.entrance2, alt: 'The K Grand Hotel' },
  { src: IMAGES.entrance3, alt: 'The K Grand Hotel' },
];

export const HomePage: React.FC = () => {
  const { navigateTo, selectRoom, openLightbox } = useHotel();
  const [selectedOfferIndex, setSelectedOfferIndex] = useState(0);
  const [heroSlide, setHeroSlide] = useState(0);

  // Hero background crossfade; paused for users who prefer reduced motion.
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = window.setInterval(() => setHeroSlide((i) => (i + 1) % HERO_SLIDES.length), 6000);
    return () => window.clearInterval(id);
  }, []);

  const featuredRooms = ROOMS.slice(0, 3);

  const getAmenityIcon = (iconName: string) => {
    switch (iconName) {
      case 'Waves':
        return <Waves className="w-5 h-5 text-amber-700" />;
      case 'Utensils':
        return <Utensils className="w-5 h-5 text-amber-700" />;
      case 'Sparkles':
        return <Sparkles className="w-5 h-5 text-amber-700" />;
      case 'Sun':
        return <Sun className="w-5 h-5 text-amber-700" />;
      case 'Activity':
        return <Activity className="w-5 h-5 text-amber-700" />;
      case 'Flame':
        return <Flame className="w-5 h-5 text-amber-700" />;
      case 'BedDouble':
        return <BedDouble className="w-5 h-5 text-amber-700" />;
      case 'Car':
        return <Car className="w-5 h-5 text-amber-700" />;
      case 'Zap':
        return <Zap className="w-5 h-5 text-amber-700" />;
      default:
        return <Compass className="w-5 h-5 text-amber-700" />;
    }
  };

  const handleBookRoom = (room: Room) => {
    selectRoom(room);
    navigateTo('booking', { roomId: room.id });
  };

  const handleViewRoomDetails = (room: Room) => {
    selectRoom(room);
    navigateTo('room-detail', { roomId: room.id });
  };

  return (
    <div className="space-y-16 sm:space-y-24">
      {/* 1. Hero Section */}
      <section className="relative min-h-[90vh] flex items-center py-16 lg:py-20">
        {/* Background Image with Measured Scrim */}
        <div className="absolute inset-0 z-0 overflow-hidden bg-stone-950">
          {HERO_SLIDES.map((slide, i) => (
            <img
              key={slide.src}
              src={slide.src}
              alt={i === heroSlide ? slide.alt : ''}
              aria-hidden={i !== heroSlide}
              className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-[1500ms] ease-in-out ${
                i === heroSlide ? 'opacity-100' : 'opacity-0'
              }`}
            />
          ))}
          {/* Scrim: darker on the left where the copy sits, lighter on the right to let the photo show */}
          <div className="absolute inset-0 bg-gradient-to-r from-stone-950/90 via-stone-950/55 to-stone-950/25" />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-stone-950/40" />
        </div>

        {/* Hero Content: copy on the left, booking card on the right */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="flex items-center gap-3">
              <span className="h-px w-10 bg-amber-300" />
              <span className="text-xs uppercase tracking-[0.3em] font-medium text-amber-300">
                Clark Freeport Zone, Pampanga
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl text-white font-serif tracking-tight font-light leading-[1.05] text-balance">
              Discover Your <span className="italic text-amber-200">Perfect</span> Escape.
            </h1>
            <p className="text-sm sm:text-base text-stone-200/90 font-light max-w-xl leading-relaxed">
              {HOTEL_INFO.welcomeText}
            </p>

            {/* Value Highlights */}
            <ul className="pt-4 space-y-3 text-sm text-stone-200 font-light">
              <li className="flex items-center gap-3">
                <ShieldCheck className="w-4 h-4 text-amber-300 shrink-0" />
                <span>Best Direct Booking Rates</span>
              </li>
              <li className="flex items-center gap-3">
                <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
                <span>Minutes from Clark International Airport</span>
              </li>
              <li className="flex items-center gap-3">
                <Sun className="w-4 h-4 text-amber-300 shrink-0" />
                <span>Sauna, Pool, Free Parking & EV Charging</span>
              </li>
            </ul>
          </div>

          {/* Booking Card */}
          <div className="lg:col-span-5 xl:pl-6">
            <HeroSearchPanel layout="card" />
          </div>
        </div>
      </section>

      {/* 2. Featured Rooms */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs uppercase tracking-widest text-amber-700 font-semibold block mb-2">
              Our Rooms
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif text-stone-900 font-normal">
              Featured Rooms
            </h2>
          </div>
          <button
            onClick={() => navigateTo('rooms')}
            className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-800 hover:text-amber-950 group cursor-pointer"
          >
            <span>View All {ROOMS.length} Room Types</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        {/* Room Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredRooms.map((room, index) => (
            <div
              key={room.id}
              className={`group bg-white rounded-xl overflow-hidden border border-stone-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col ${
                index === 2 ? 'md:col-span-2 md:justify-self-center md:w-[calc(50%-1rem)] lg:col-span-1 lg:justify-self-stretch lg:w-auto' : ''
              }`}
            >
              {/* Image Container */}
              <div className="relative aspect-[4/3] overflow-hidden bg-stone-100">
                <img
                  src={room.images[0]}
                  alt={room.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />

                <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white text-xs">
                  <span className="font-serif italic text-amber-200">{room.category}</span>
                  <div className="flex items-center gap-1 bg-stone-950/70 px-2 py-0.5 rounded text-[11px]">
                    <Star className="w-3 h-3 text-amber-300 fill-amber-300" />
                    <span className="font-semibold tabular-nums">{room.rating.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="font-serif text-xl text-stone-900 group-hover:text-amber-900 transition-colors">
                    {room.name}
                  </h3>

                  {/* Clean unboxed metadata discipline */}
                  <div className="flex items-center gap-2 text-xs text-stone-500 flex-wrap">
                    <span>{room.sizeSqM} m² ({room.sizeSqFt} sq ft)</span>
                    <span aria-hidden="true">·</span>
                    <span>{room.bedConfiguration}</span>
                    <span aria-hidden="true">·</span>
                    <span>Up to {room.maxAdults} Guests</span>
                  </div>

                  <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed pt-1">
                    {room.description}
                  </p>
                </div>

                {/* Price and Action Buttons */}
                <div className="pt-4 border-t border-stone-100 flex items-center justify-between gap-3">
                  <div>
                    <span className="text-[11px] text-stone-400 block uppercase tracking-wider">From</span>
                    <div className="flex items-baseline gap-1 whitespace-nowrap">
                      <span className="text-xl font-serif font-bold text-stone-900 tabular-nums">
                        ₱{room.pricePerNight.toLocaleString()}
                      </span>
                      <span className="text-[11px] text-stone-500">/ night</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleViewRoomDetails(room)}
                      className="px-3 py-2 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded transition-colors"
                    >
                      Details
                    </button>
                    <button
                      onClick={() => handleBookRoom(room)}
                      className="px-4 py-2 text-xs font-semibold text-stone-950 bg-amber-300 hover:bg-amber-200 rounded transition-colors whitespace-nowrap shadow-sm"
                    >
                      Reserve
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. About the Hotel & Brand Story */}
      <section className="bg-stone-100 py-20 border-y border-stone-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Story Copy */}
            <div className="space-y-6">
              <div>
                <span className="text-xs uppercase tracking-widest text-amber-700 font-semibold block mb-2">
                  The K Grand Story
                </span>
                <h2 className="text-3xl sm:text-4xl font-serif text-stone-900 font-normal leading-tight">
                  Inspired by Comfort, Defined by Care
                </h2>
              </div>
              <p className="text-stone-700 text-sm sm:text-base leading-relaxed">
                Set in the heart of Clark Freeport Zone, The K Grand Hotel offers apartment-style accommodations made for both short getaways and longer stays, just minutes from Clark International Airport.
              </p>
              <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
                Every room comes with air-conditioning, a private bathroom, and its own terrace or balcony. Unwind in the sauna or by the pool, and arrive with ease thanks to free on-site parking and electric vehicle charging. Whether you are in Clark for business, family, or leisure, we take care of the details so you can feel at home.
              </p>

              {/* Highlights List */}
              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-stone-200">
                <div className="space-y-1">
                  <p className="text-xl sm:text-2xl font-serif font-semibold text-stone-900 tabular-nums">~4 km</p>
                  <p className="text-xs text-stone-500">From Clark International Airport</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xl sm:text-2xl font-serif font-semibold text-stone-900">Apartment-Style</p>
                  <p className="text-xs text-stone-500">Rooms with Terrace or Balcony</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xl sm:text-2xl font-serif font-semibold text-stone-900">Sauna & Pool</p>
                  <p className="text-xs text-stone-500">For Rest and Recovery</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xl sm:text-2xl font-serif font-semibold text-stone-900">Free Parking</p>
                  <p className="text-xs text-stone-500">With EV Charging On Site</p>
                </div>
              </div>

              <div>
                <button
                  onClick={() => navigateTo('about')}
                  className="inline-flex items-center gap-2 text-xs uppercase tracking-wider font-semibold text-stone-900 hover:text-amber-800 transition-colors"
                >
                  <span>Read Our Complete Story</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Asymmetric Image Collage */}
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-[4/3] border border-stone-300">
                <img
                  src={IMAGES.storyRoom}
                  alt="Guest room at The K Grand Hotel"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 left-4 lg:-bottom-8 lg:-left-8 w-1/2 aspect-square rounded-xl overflow-hidden shadow-xl border-4 border-white hidden sm:block">
                <img
                  src={IMAGES.storyLounge}
                  alt="Lounge seating area at The K Grand Hotel"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Amenities and Facilities */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <span className="text-xs uppercase tracking-widest text-amber-700 font-semibold block">
            Comfort, Inside and Out
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif text-stone-900">
            Amenities & Facilities
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            From a relaxing sauna and pool to free parking and EV charging, everything at The K Grand Hotel is designed to make your stay in Clark easy and restful.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {AMENITIES.map((amenity) => (
            <div
              key={amenity.id}
              className="bg-white rounded-sm p-6 border border-stone-200/90 shadow-sm hover:border-amber-300 hover:shadow-md transition-all group flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="p-3 bg-amber-50 rounded-xs group-hover:bg-amber-100 transition-colors">
                    {getAmenityIcon(amenity.iconName)}
                  </div>
                  <span className="text-[11px] text-stone-400 font-medium">
                    {amenity.operatingHours}
                  </span>
                </div>

                <div>
                  <h3 className="font-serif text-lg text-stone-900 group-hover:text-amber-900 transition-colors">
                    {amenity.name}
                  </h3>
                  <p className="text-xs text-amber-800 font-medium mt-0.5">
                    {amenity.subtitle}
                  </p>
                  <p className="text-xs text-stone-600 leading-relaxed mt-2">
                    {amenity.description}
                  </p>
                </div>

                <div className="hidden sm:block space-y-1.5 pt-2 border-t border-stone-100">
                  {amenity.highlights.slice(0, 2).map((h, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-stone-500">
                      <div className="w-1 h-1 rounded-full bg-amber-600" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-stone-100">
                <button
                  onClick={() => navigateTo('amenities')}
                  className="text-xs font-semibold text-amber-900 hover:text-amber-700 inline-flex items-center gap-1 group-hover:translate-x-1 transition-all"
                >
                  <span>Learn More</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Special Offers Banner (hidden for now — set SHOW_OFFERS_BANNER to true to restore) */}
      {SHOW_OFFERS_BANNER && (
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative bg-stone-900 rounded-2xl overflow-hidden shadow-2xl text-stone-100 border border-stone-800">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
            {/* Offer Image */}
            <div className="lg:col-span-5 relative min-h-[300px] lg:min-h-full">
              <img
                src={SPECIAL_OFFERS[selectedOfferIndex].image}
                alt={SPECIAL_OFFERS[selectedOfferIndex].title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-stone-950/40" />
              <div className="absolute top-4 left-4 bg-amber-300 text-stone-950 font-bold text-xs px-3 py-1 rounded shadow">
                {SPECIAL_OFFERS[selectedOfferIndex].badge}
              </div>
            </div>

            {/* Offer Details */}
            <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs text-amber-300 uppercase tracking-widest font-medium">
                  <span>Exclusive Seasonal Package</span>
                  <span>·</span>
                  <span>Save {SPECIAL_OFFERS[selectedOfferIndex].discountPercentage}%</span>
                </div>
                <h3 className="font-serif text-2xl sm:text-3xl text-white">
                  {SPECIAL_OFFERS[selectedOfferIndex].title}
                </h3>
                <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                  {SPECIAL_OFFERS[selectedOfferIndex].description}
                </p>

                {/* Benefits */}
                <div className="space-y-2 pt-3">
                  <p className="text-xs font-semibold text-amber-200 uppercase tracking-wider">
                    Package Inclusions:
                  </p>
                  <ul className="space-y-1.5 text-xs text-stone-300">
                    {SPECIAL_OFFERS[selectedOfferIndex].benefits.slice(0, 3).map((b, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Offer Selector & CTA */}
              <div className="pt-4 border-t border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex gap-2">
                  {SPECIAL_OFFERS.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedOfferIndex(i)}
                      className={`h-2 rounded-full transition-all ${
                        selectedOfferIndex === i ? 'w-8 bg-amber-400' : 'w-2 bg-stone-700'
                      }`}
                      aria-label={`View offer ${i + 1}`}
                    />
                  ))}
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => navigateTo('offers')}
                    className="text-xs text-stone-400 hover:text-white px-3 py-2 transition-colors"
                  >
                    View All Offers
                  </button>
                  <button
                    onClick={() => {
                      navigateTo('rooms');
                    }}
                    className="px-5 py-2.5 text-xs font-semibold uppercase tracking-wider bg-amber-300 hover:bg-amber-200 text-stone-950 rounded transition-colors shadow"
                  >
                    Reserve This Package
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      )}

      {/* 6. Photo Gallery Showcase with Lightbox */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs uppercase tracking-widest text-amber-700 font-semibold block mb-1">
              Photo Gallery
            </span>
            <h2 className="text-3xl font-serif text-stone-900">
              A Look Inside K Grand
            </h2>
          </div>
          <button
            onClick={() => navigateTo('gallery')}
            className="text-xs font-semibold uppercase tracking-wider text-amber-800 hover:text-stone-900 inline-flex items-center gap-1.5"
          >
            <span>Open Complete Gallery</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {GALLERY_ITEMS.slice(0, 8).map((item, index) => (
            <div
              key={item.id}
              onClick={() => openLightbox(item.image, item.title, item.caption)}
              className={`relative rounded-xl overflow-hidden group cursor-pointer shadow-sm hover:shadow-lg transition-all duration-300 ${
                index === 0 ? 'col-span-2 row-span-2 aspect-square md:aspect-auto' : index === 7 ? 'hidden md:block aspect-square' : 'aspect-square'
              }`}
            >
              <img
                src={item.image}
                alt={item.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-stone-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4 text-white">
                <span className="text-[10px] text-amber-300 uppercase tracking-widest font-mono">
                  {item.category}
                </span>
                <p className="text-xs sm:text-sm font-serif font-medium mt-0.5">{item.title}</p>
                <div className="flex items-center gap-1 text-[11px] text-stone-300 mt-2">
                  <Eye className="w-3.5 h-3.5" />
                  <span>Click to expand</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. Guest Reviews and Testimonials (hidden until real reviews are added to REVIEWS) */}
      {REVIEWS.length > 0 && (
      <section className="bg-stone-100/80 py-20 border-y border-stone-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
            <span className="text-xs uppercase tracking-widest text-amber-700 font-semibold block">
              Guest Impressions
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif text-stone-900">
              What Our Guests Say
            </h2>
            <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 pt-1 text-xs text-stone-600">
              <div className="flex text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="font-semibold text-stone-900 tabular-nums">{HOTEL_INFO.rating} / 5.0</span>
              <span>·</span>
              <span>Based on {HOTEL_INFO.totalReviews} verified guest reviews</span>
            </div>
          </div>

          <div className="-mx-4 px-4 flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2 [scrollbar-width:none] md:mx-0 md:px-0 md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-6 md:overflow-visible md:pb-0">
            {REVIEWS.map((rev) => (
              <div
                key={rev.id}
                className="bg-white p-6 rounded-xl border border-stone-200/90 shadow-sm flex flex-col justify-between shrink-0 w-[85%] snap-center md:w-auto"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                      ))}
                    </div>
                    <span className="text-[10px] text-stone-400">{rev.date}</span>
                  </div>

                  <h4 className="font-serif text-sm font-semibold text-stone-900">
                    "{rev.title}"
                  </h4>

                  <p className="text-xs text-stone-600 leading-relaxed italic">
                    "{rev.content}"
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-semibold text-stone-900">{rev.author}</p>
                    <p className="text-[10px] text-stone-500">{rev.location}</p>
                  </div>
                  <span className="text-[10px] text-amber-800 bg-amber-50 px-2 py-0.5 rounded font-medium">
                    Verified Stay
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* 8. Location & Nearby Attractions */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Location Text */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <span className="text-xs uppercase tracking-widest text-amber-700 font-semibold block mb-1">
                Clark Freeport Zone, Pampanga
              </span>
              <h2 className="text-3xl font-serif text-stone-900">
                Your Gateway to Clark
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Located on E. Aguinaldo Street inside Clark Freeport Zone, The K Grand Hotel is about 4 km (2.5 miles) from Clark International Airport, with free parking and electric vehicle charging on site.
            </p>

            <div className="space-y-3 pt-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-stone-900">
                Nearby Places:
              </p>
              <div className="space-y-3">
                {NEARBY_ATTRACTIONS.map((att) => (
                  <div key={att.name} className="flex items-start gap-3 p-3 rounded-xs bg-white border border-stone-200/80">
                    <MapPin className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                    <div className="text-xs">
                      <div className="flex flex-wrap items-center gap-x-2">
                        <span className="font-semibold text-stone-900">{att.name}</span>
                        {att.distance && <span className="text-[10px] text-stone-400">({att.distance})</span>}
                      </div>
                      <p className="text-[11px] text-stone-500 mt-0.5">{att.driveTime}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Location photo with pin */}
          <div className="lg:col-span-7">
            <div className="relative rounded-sm overflow-hidden shadow-xl border border-stone-300 bg-stone-900 aspect-[3/4] sm:aspect-[16/10] text-white">
              <img
                src={IMAGES.location}
                alt="The K Grand Hotel building in Clark Freeport Zone at dusk"
                className="absolute inset-0 w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-stone-950/70 via-stone-950/10 to-stone-950/60" />

              <div className="absolute inset-x-0 top-0 p-5 sm:p-7 flex items-start justify-between gap-3">
                <div>
                  <span className="text-[10px] text-amber-300 uppercase tracking-widest font-mono">
                    Navigation & Access
                  </span>
                  <h3 className="font-serif text-xl sm:text-2xl mt-0.5">Clark Freeport Zone</h3>
                </div>
                <span className="bg-stone-950/80 px-3 py-1.5 rounded-xs border border-stone-700 text-[11px] text-stone-300 whitespace-nowrap">
                  ~4 km to Clark Airport
                </span>
              </div>

              {/* Bouncing pin */}
              <div className="absolute left-1/2 top-[38%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                <div className="flex flex-col items-center animate-bounce">
                  <div className="w-11 h-11 rounded-full btn-gold flex items-center justify-center shadow-lg font-serif font-bold text-xl ring-4 ring-amber-300/30">
                    K
                  </div>
                  <span className="w-0 h-0 -mt-1 border-x-[7px] border-x-transparent border-t-[9px] border-t-amber-500" />
                </div>
                <div className="bg-stone-950/90 text-stone-100 px-3 py-1 rounded-xs text-xs mt-2 border border-stone-700 whitespace-nowrap">
                  The K Grand Hotel
                </div>
              </div>

              <div className="absolute inset-x-3 bottom-3 sm:inset-x-5 sm:bottom-5 bg-stone-950/90 backdrop-blur-md p-4 rounded-xs border border-stone-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-white">
                <div className="min-w-0">
                  <p className="text-[10px] text-amber-300 uppercase tracking-widest mb-0.5">The K Grand Hotel</p>
                  <p className="font-semibold text-stone-100">{HOTEL_INFO.address}</p>
                  <a href={HOTEL_INFO.phoneHref} className="text-[11px] text-stone-400 hover:text-amber-200 transition-colors">
                    {HOTEL_INFO.phone} · Free parking & EV charging
                  </a>
                </div>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(HOTEL_INFO.mapsQuery)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-gold px-4 py-2 text-xs font-semibold uppercase tracking-wider shrink-0 whitespace-nowrap"
                >
                  Get Directions
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. Pre-Footer Call to Action */}
      <section className="bg-stone-900 text-stone-100 py-16 border-t border-stone-800">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
          <span className="text-xs uppercase tracking-[0.25em] text-amber-300 font-medium block">
            Begin Your Journey
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-light text-white leading-tight">
            Your Stay in Clark Starts Here
          </h2>
          <p className="text-stone-300 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
            Book directly with The K Grand Hotel for the best available rates, a warm welcome, and a comfortable stay minutes from Clark International Airport.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigateTo('rooms')}
              className="w-full sm:w-auto px-8 py-3 text-xs uppercase tracking-widest font-semibold bg-amber-300 hover:bg-amber-200 text-stone-950 rounded transition-colors shadow-lg"
            >
              Check Availability & Book
            </button>
            <button
              onClick={() => navigateTo('contact')}
              className="w-full sm:w-auto px-6 py-3 text-xs uppercase tracking-widest font-semibold border border-stone-600 hover:border-stone-400 text-stone-200 rounded transition-colors"
            >
              Contact Us
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
