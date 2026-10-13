import React, { useState } from 'react';
import { useHotel } from '../context/HotelContext';
import {
  HOTEL_INFO,
  AMENITIES,
  SPECIAL_OFFERS,
  GALLERY_ITEMS,
  FAQS,
  IMAGES,
  SpecialOffer
} from '../data/hotelData';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Check,
  Send,
  Eye,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';
import { Select } from '../components/Select';

// ==========================================
// 1. ABOUT US PAGE
// ==========================================
export const AboutPage: React.FC = () => {
  const { navigateTo, openLightbox } = useHotel();

  return (
    <div className="space-y-16 pb-20">
      {/* Banner */}
      <section className="relative h-80 sm:h-96 flex items-center justify-center overflow-hidden bg-stone-950">
        <img
          src={IMAGES.hero}
          alt="Aurelia heritage architecture"
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover opacity-45"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/40 to-stone-950/80" />
        <div className="relative z-10 max-w-3xl mx-auto px-4 text-center space-y-3">
          <span className="text-xs uppercase tracking-[0.25em] text-amber-300 font-medium">
            Cap d'Or Riviera
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-white font-light">
            Our Heritage & Vision
          </h1>
          <p className="text-xs sm:text-sm text-stone-300 max-w-xl mx-auto leading-relaxed">
            A century of timeless coastal discretion, bespoke craftsmanship, and sensory hospitality.
          </p>
        </div>
      </section>

      {/* Main Story Narrative */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="space-y-4">
            <span className="text-xs uppercase tracking-widest text-amber-700 font-semibold block">
              Chapter I · Founded 1928
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif text-stone-900 leading-tight">
              A Private Aristocratic Sanctuary Reimagined
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Constructed in 1928 by Countess Hélène de San Pietro, Aurelia was originally conceived as an intimate summer retreat for writers, diplomats, and avant-garde artists seeking tranquility away from the bustling ports of Cannes and Monaco.
            </p>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Every archway, limestone retaining wall, and century-old olive grove was carefully oriented to capture the gentle sea breezes and the mesmerizing play of golden hour light across the Mediterranean horizon.
            </p>
          </div>
          <div
            className="rounded-2xl overflow-hidden shadow-xl aspect-[4/3] cursor-pointer"
            onClick={() => openLightbox(IMAGES.cliffsideVilla, 'Architectural Heritage', 'Limestone terraces')}
          >
            <img
              src={IMAGES.cliffsideVilla}
              alt="Aurelia historic terraces"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
            />
          </div>
        </div>

        {/* Chapter 2: The Culinary Brigade */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center md:flex-row-reverse">
          <div
            className="rounded-2xl overflow-hidden shadow-xl aspect-[4/3] order-2 md:order-1 cursor-pointer"
            onClick={() => openLightbox(IMAGES.fineDining, 'Chef Julien Moreau & L Aura', 'Two Michelin Stars')}
          >
            <img
              src={IMAGES.fineDining}
              alt="L'Aura dining room"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
            />
          </div>
          <div className="space-y-4 order-1 md:order-2">
            <span className="text-xs uppercase tracking-widest text-amber-700 font-semibold block">
              Chapter II · Gastronomic Terroir
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif text-stone-900 leading-tight">
              Culinary Artistry by Chef Julien Moreau
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Awarded two Michelin Stars in 2022, Chef Julien Moreau's cuisine at L'Aura is a celebration of the Côte d'Azur's bounty. Over 80% of our produce originates from our private 3-hectare biodynamic estate garden and small artisanal fishermen along the bay.
            </p>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              "We cook without haste, allowing the sea salt, wild thyme, and sun-ripened citrus to express their authentic purity."
            </p>
          </div>
        </div>

        {/* Sustainability & Environmental Pledge */}
        <div className="bg-stone-100 p-8 sm:p-10 rounded-2xl border border-stone-200 space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs uppercase tracking-widest text-amber-800 font-semibold block">
              Ecological Stewardship
            </span>
            <h3 className="text-2xl font-serif text-stone-900">
              Our Commitment to the Mediterranean
            </h3>
            <p className="text-xs text-stone-600">
              Preserving our marine sanctuary and heritage parklands for generations to come.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 text-xs text-stone-700">
            <div className="bg-white p-5 rounded-xl border border-stone-200/80 space-y-2">
              <span className="font-serif font-bold text-lg text-stone-900 block">100% Green Energy</span>
              <p className="text-stone-500 leading-relaxed">
                Powered completely by unobtrusive rooftop solar pergolas and seawater geothermal thermal loops.
              </p>
            </div>
            <div className="bg-white p-5 rounded-xl border border-stone-200/80 space-y-2">
              <span className="font-serif font-bold text-lg text-stone-900 block">Single-Use Plastic Free</span>
              <p className="text-stone-500 leading-relaxed">
                All guest amenities are packaged in refillable amber glass, recycled stone, and organic linen.
              </p>
            </div>
            <div className="bg-white p-5 rounded-xl border border-stone-200/80 space-y-2">
              <span className="font-serif font-bold text-lg text-stone-900 block">Posidonia Reef Protection</span>
              <p className="text-stone-500 leading-relaxed">
                We actively sponsor underwater seabed restoration across the Cap d'Or marine nature reserve.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center pt-8">
          <button
            onClick={() => navigateTo('rooms')}
            className="px-8 py-3 bg-amber-300 hover:bg-amber-200 text-stone-950 text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors shadow"
          >
            Explore Accommodations
          </button>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 2. AMENITIES & FACILITIES PAGE
// ==========================================
export const AmenitiesPage: React.FC = () => {
  const { navigateTo, openLightbox } = useHotel();

  return (
    <div className="space-y-16 pb-20">
      {/* Banner */}
      <section className="relative h-80 sm:h-96 flex items-center justify-center overflow-hidden bg-stone-950">
        <img
          src={IMAGES.spaPool}
          alt="Aurelia pool & spa"
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/40 to-stone-950/80" />
        <div className="relative z-10 max-w-3xl mx-auto px-4 text-center space-y-3">
          <span className="text-xs uppercase tracking-[0.25em] text-amber-300 font-medium">
            Estate Living
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-white font-light">
            Amenities & Facilities
          </h1>
          <p className="text-xs sm:text-sm text-stone-300 max-w-xl mx-auto leading-relaxed">
            Elevating your stay through holistic wellness, gastronomic marvels, and bespoke leisure.
          </p>
        </div>
      </section>

      {/* Deep-dive facilities list */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {AMENITIES.map((amenity, idx) => {
          const isReversed = idx % 2 === 1;

          return (
            <div
              key={amenity.id}
              className={`grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center ${
                isReversed ? 'lg:flex-row-reverse' : ''
              }`}
            >
              {/* Image */}
              <div
                className={`lg:col-span-6 rounded-2xl overflow-hidden shadow-xl aspect-[16/10] bg-stone-900 group cursor-pointer ${
                  isReversed ? 'lg:order-2' : 'lg:order-1'
                }`}
                onClick={() => openLightbox(amenity.image, amenity.name, amenity.subtitle)}
              >
                <img
                  src={amenity.image}
                  alt={amenity.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>

              {/* Text Information */}
              <div
                className={`lg:col-span-6 space-y-4 ${
                  isReversed ? 'lg:order-1' : 'lg:order-2'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase font-mono tracking-widest text-amber-700">
                    Facility · 0{idx + 1}
                  </span>
                  <span className="text-xs text-stone-400 font-medium">{amenity.operatingHours}</span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-serif text-stone-900">
                  {amenity.name}
                </h2>

                <p className="text-xs text-amber-800 font-semibold">{amenity.subtitle}</p>

                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  {amenity.description}
                </p>

                <div className="pt-2">
                  <p className="text-xs font-semibold text-stone-900 uppercase tracking-wider mb-2">
                    Key Features:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {amenity.highlights.map((h, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-stone-600">
                        <Check className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => navigateTo('contact')}
                    className="text-xs font-semibold uppercase tracking-wider text-stone-900 hover:text-amber-800 inline-flex items-center gap-1.5"
                  >
                    <span>Inquire with Concierge</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ==========================================
// 3. SPECIAL OFFERS PAGE
// ==========================================
export const OffersPage: React.FC = () => {
  const { navigateTo } = useHotel();

  return (
    <div className="space-y-16 pb-20">
      {/* Banner */}
      <section className="relative h-80 sm:h-96 flex items-center justify-center overflow-hidden bg-stone-950">
        <img
          src={IMAGES.oceanVilla}
          alt="Aurelia special offers"
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover opacity-45"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/40 to-stone-950/80" />
        <div className="relative z-10 max-w-3xl mx-auto px-4 text-center space-y-3">
          <span className="text-xs uppercase tracking-[0.25em] text-amber-300 font-medium">
            Exclusive Packages
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-white font-light">
            Seasonal Offers & Privileges
          </h1>
          <p className="text-xs sm:text-sm text-stone-300 max-w-xl mx-auto leading-relaxed">
            Curated stays pairing luxury suites with exceptional dining, thalasso spa therapies, and private excursions.
          </p>
        </div>
      </section>

      {/* Offers List */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {SPECIAL_OFFERS.map((offer) => (
          <div
            key={offer.id}
            className="bg-white rounded-2xl overflow-hidden border border-stone-200 shadow-md hover:shadow-xl transition-all grid grid-cols-1 lg:grid-cols-12"
          >
            {/* Image */}
            <div className="lg:col-span-5 relative min-h-[260px] lg:min-h-full">
              <img
                src={offer.image}
                alt={offer.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 bg-amber-300 text-stone-950 font-bold text-xs px-3 py-1 rounded shadow">
                {offer.badge}
              </div>
            </div>

            {/* Details */}
            <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs text-amber-800 font-medium">
                  <span>Save {offer.discountPercentage}%</span>
                  <span aria-hidden="true">·</span>
                  <span>Promo Code: <strong className="font-mono">{offer.promoCode}</strong></span>
                  <span aria-hidden="true">·</span>
                  <span>Min. {offer.minNights} Nights</span>
                </div>

                <h2 className="font-serif text-2xl text-stone-900">
                  {offer.title}
                </h2>

                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  {offer.description}
                </p>

                <div className="pt-2 space-y-1.5">
                  <p className="text-xs font-semibold text-stone-800 uppercase tracking-wider">
                    Package Inclusions:
                  </p>
                  <ul className="space-y-1 text-xs text-stone-600">
                    {offer.benefits.map((b, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                <span className="text-[11px] text-stone-400">
                  Valid until {offer.validUntil}
                </span>

                <button
                  onClick={() => navigateTo('rooms')}
                  className="px-6 py-2.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors shadow-sm"
                >
                  Book This Package
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ==========================================
// 4. PHOTO GALLERY PAGE
// ==========================================
export const GalleryPage: React.FC = () => {
  const { openLightbox } = useHotel();
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = ['All', 'Suites & Villas', 'Dining & Bars', 'Spa & Wellness', 'Resort Grounds'];

  const filteredItems = GALLERY_ITEMS.filter((item) => {
    if (activeCategory === 'All') return true;
    return item.category === activeCategory;
  });

  return (
    <div className="space-y-12 pb-20">
      {/* Banner */}
      <section className="relative h-72 sm:h-80 flex items-center justify-center overflow-hidden bg-stone-950">
        <img
          src={IMAGES.beachClub}
          alt="Aurelia photo gallery"
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover opacity-45"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/40 to-stone-950/80" />
        <div className="relative z-10 max-w-3xl mx-auto px-4 text-center space-y-3">
          <span className="text-xs uppercase tracking-[0.25em] text-amber-300 font-medium">
            Visual Story
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif text-white font-light">
            Estate Photo Gallery
          </h1>
          <p className="text-xs sm:text-sm text-stone-300 max-w-md mx-auto">
            Discover our seaside panoramas, bespoke living suites, and fine dining atmospheres.
          </p>
        </div>
      </section>

      {/* Gallery Filter Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="-mx-4 px-4 flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-2 [scrollbar-width:none]">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                activeCategory === cat
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'bg-white text-stone-600 hover:text-stone-900 border border-stone-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => openLightbox(item.image, item.title, item.caption)}
              className="group bg-white rounded-xl overflow-hidden border border-stone-200 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-stone-100">
                <img
                  src={item.image}
                  alt={item.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-stone-950/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                  <div className="flex items-center gap-1.5 bg-stone-950/80 px-3 py-1.5 rounded-md text-xs">
                    <Eye className="w-4 h-4 text-amber-300" />
                    <span>Expand Photo</span>
                  </div>
                </div>
              </div>

              <div className="p-4 space-y-1">
                <span className="text-[10px] uppercase font-mono text-amber-800">
                  {item.category}
                </span>
                <h3 className="font-serif text-base text-stone-900 group-hover:text-amber-900 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">
                  {item.caption}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 5. CONTACT US PAGE
// ==========================================
export const ContactPage: React.FC = () => {
  const { showNotification } = useHotel();
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Room Reservation',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    showNotification('Thank you! Our front desk team will get back to you soon.');
  };

  return (
    <div className="space-y-16 pb-20">
      {/* Banner */}
      <section className="relative h-72 sm:h-80 flex items-center justify-center overflow-hidden bg-stone-950">
        <img
          src={IMAGES.galleryLobby}
          alt="The K Grand Hotel lobby and reception"
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover opacity-45"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/40 to-stone-950/80" />
        <div className="relative z-10 max-w-3xl mx-auto px-4 text-center space-y-3">
          <span className="text-xs uppercase tracking-[0.25em] text-amber-300 font-medium">
            We're Here to Help
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif text-white font-light">
            Contact & Location
          </h1>
          <p className="text-xs sm:text-sm text-stone-300 max-w-md mx-auto">
            Questions about rooms, rates, or getting here? Call, email, or send us a message and our team will take care of you.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Contact Details & Coordinates */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-3">
              <span className="text-xs uppercase tracking-widest text-amber-700 font-semibold block">
                Direct Contact
              </span>
              <h2 className="text-2xl font-serif text-stone-900">
                The K Grand Hotel
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                Inspired by comfort, defined by care. Whether you are booking a room, planning a long stay, or need help finding us in Clark, we are happy to help.
              </p>
            </div>

            <div className="space-y-4 text-xs text-stone-700">
              <div className="flex items-start gap-3 p-4 bg-white rounded-sm border border-stone-200">
                <MapPin className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-stone-900">Address</p>
                  <p className="text-stone-600 mt-0.5">{HOTEL_INFO.address}</p>
                  <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(HOTEL_INFO.mapsQuery)}`} target="_blank" rel="noopener noreferrer" className="inline-block text-[11px] text-amber-700 hover:text-amber-800 underline underline-offset-2 mt-1">View on Google Maps</a>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-white rounded-sm border border-stone-200">
                <Phone className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-stone-900">Phone</p>
                  <a href={HOTEL_INFO.phoneHref} className="text-stone-600 hover:text-amber-800 mt-0.5 inline-block">
                    {HOTEL_INFO.phone}
                  </a>
                  <p className="text-[11px] text-stone-400">Tap to call on mobile</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-white rounded-sm border border-stone-200">
                <Mail className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-stone-900">Email</p>
                  <a href={`mailto:${HOTEL_INFO.reservationsEmail}`} className="text-stone-600 hover:text-amber-800 mt-0.5 inline-block break-all">
                    {HOTEL_INFO.reservationsEmail}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Form */}
          <div className="lg:col-span-7">
            <div className="bg-white p-6 sm:p-8 rounded-sm border border-stone-200 shadow-sm space-y-6">
              <div>
                <h3 className="text-xl font-serif text-stone-900">
                  Send Us a Message
                </h3>
                <p className="text-xs text-stone-500 mt-1">
                  Fill out the form and our front desk team will get back to you as soon as possible.
                </p>
              </div>

              {formSubmitted ? (
                <div className="p-8 text-center bg-stone-50 rounded-sm border border-stone-200 space-y-3">
                  <Check className="w-10 h-10 text-emerald-600 mx-auto" />
                  <h4 className="font-serif text-lg text-stone-900">Message Sent</h4>
                  <p className="text-xs text-stone-600 max-w-sm mx-auto">
                    Thank you, {contactForm.name}. We have received your message and will reply to {contactForm.email}.
                  </p>
                  <button
                    onClick={() => {
                      setFormSubmitted(false);
                      setContactForm({ name: '', email: '', phone: '', subject: 'Room Reservation', message: '' });
                    }}
                    className="mt-2 px-4 py-2 text-xs font-semibold bg-stone-900 text-amber-200 rounded-xs"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-sm">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1.5">Full Name</label>
                      <input
                        type="text"
                        required
                        value={contactForm.name}
                        onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                        placeholder="Juan Dela Cruz"
                        className="w-full bg-stone-50 border border-stone-200 rounded-xs px-3 py-2.5 text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-amber-500 focus:bg-white transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1.5">Email Address</label>
                      <input
                        type="email"
                        required
                        value={contactForm.email}
                        onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                        placeholder="juan@example.com"
                        className="w-full bg-stone-50 border border-stone-200 rounded-xs px-3 py-2.5 text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-amber-500 focus:bg-white transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1.5">Phone Number</label>
                      <input
                        type="tel"
                        value={contactForm.phone}
                        onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                        placeholder="+63 917 123 4567"
                        className="w-full bg-stone-50 border border-stone-200 rounded-xs px-3 py-2.5 text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-amber-500 focus:bg-white transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1.5">Subject</label>
                      <Select
                        value={String(contactForm.subject)}
                        onChange={(v) => setContactForm({ ...contactForm, subject: v })}
                        options={[
                          { value: "Room Reservation", label: "Room Reservation" },
                          { value: "Long-Stay Inquiry", label: "Long-Stay Inquiry" },
                          { value: "Group or Corporate Booking", label: "Group or Corporate Booking" },
                          { value: "Existing Reservation", label: "Existing Reservation" },
                          { value: "General Question", label: "General Question" },
                        ]}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1.5">Message</label>
                    <textarea
                      rows={4}
                      required
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      placeholder="Tell us your preferred dates, number of guests, room type, and any special requests..."
                      className="w-full bg-stone-50 border border-stone-200 rounded-xs px-3 py-2.5 text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-amber-500 focus:bg-white transition-colors"
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn-gold w-full py-3.5 font-semibold text-xs uppercase tracking-widest flex items-center justify-center gap-2"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Message</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 6. FREQUENTLY ASKED QUESTIONS PAGE
// ==========================================
export const FaqsPage: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleIndex = (i: number) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      <div className="text-center space-y-2">
        <span className="text-xs uppercase tracking-widest text-amber-700 font-semibold block">
          Guest Information
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif text-stone-900">
          Frequently Asked Questions
        </h1>
        <p className="text-xs text-stone-500 max-w-md mx-auto">
          Answers to common questions regarding check-in procedures, transfers, dining, and policies.
        </p>
      </div>

      <div className="space-y-4">
        {FAQS.map((faq, i) => {
          const isOpen = openIndex === i;

          return (
            <div
              key={i}
              className="bg-white rounded-sm border border-stone-200 overflow-hidden shadow-xs transition-colors"
            >
              <button
                type="button"
                onClick={() => toggleIndex(i)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 font-serif text-base text-stone-900 hover:text-amber-900 transition-colors"
              >
                <span>{faq.question}</span>
                {isOpen ? (
                  <ChevronUp className="w-5 h-5 text-amber-700 shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-stone-400 shrink-0" />
                )}
              </button>

              {isOpen && (
                <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-stone-600 leading-relaxed border-t border-stone-100 bg-stone-50/50">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ==========================================
// 7. LEGAL: PRIVACY & TERMS
// ==========================================
export const LegalPage: React.FC<{ type: 'privacy' | 'terms' }> = ({ type }) => {
  const isPrivacy = type === 'privacy';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
      <div>
        <span className="text-xs uppercase tracking-widest text-amber-700 font-semibold block mb-1">
          Estate Governance
        </span>
        <h1 className="text-3xl font-serif text-stone-900">
          {isPrivacy ? 'Guest Privacy Policy' : 'Terms & Conditions of Stay'}
        </h1>
        <p className="text-xs text-stone-500 mt-1">
          Last revised: October 2026 · French Riviera Estate Jurisdictions
        </p>
      </div>

      <div className="bg-white p-8 rounded-2xl border border-stone-200 shadow-sm space-y-6 text-xs sm:text-sm text-stone-700 leading-relaxed">
        {isPrivacy ? (
          <>
            <p>
              At Aurelia Grand Hotel & Residences, we hold the discretion and confidential privacy of our guests as a foundational cornerstone of luxury hospitality.
            </p>
            <h3 className="font-serif text-base text-stone-900 font-semibold">1. Collection of Stay Information</h3>
            <p>
              We collect guest personal information solely to facilitate seamless reservations, personalize in-suite amenities (such as pillow menu choices and dietary requirements), and ensure the security of our private estate.
            </p>
            <h3 className="font-serif text-base text-stone-900 font-semibold">2. Confidentiality & Non-Disclosure</h3>
            <p>
              We maintain a strict non-disclosure protocol. Guest identities, booking records, and itineraries are never sold, rented, or distributed to third parties.
            </p>
          </>
        ) : (
          <>
            <p>
              Welcome to Aurelia Grand Hotel & Residences. By confirming a reservation via this prototype platform or directly through our concierge, you agree to our standard terms of stay.
            </p>
            <h3 className="font-serif text-base text-stone-900 font-semibold">1. Check-In & Check-Out Schedule</h3>
            <p>
              Official check-in commences at 15:00 local time. Check-out is scheduled for 12:00 noon. Complimentary early check-in or late check-out may be granted subject to suite availability and confirmed by the Front Office.
            </p>
            <h3 className="font-serif text-base text-stone-900 font-semibold">2. Flexible Cancellation Guarantee</h3>
            <p>
              Standard flexible reservations may be cancelled without penalty up to 48 hours prior to arrival (15:00 local French time). Cancellations within 48 hours will incur a fee equivalent to one night's room charge.
            </p>
          </>
        )}
      </div>
    </div>
  );
};
