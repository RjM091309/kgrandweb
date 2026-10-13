import React, { useState } from 'react';
import { useHotel, Page } from '../context/HotelContext';
import { HOTEL_INFO } from '../data/hotelData';
import { Phone, Mail, MapPin, ArrowRight, Check, Clock, Navigation } from 'lucide-react';

const EXPLORE_LINKS: { label: string; page: Page }[] = [
  { label: 'Rooms', page: 'rooms' },
  { label: 'Amenities', page: 'amenities' },
  { label: 'Special Offers', page: 'offers' },
  { label: 'Gallery', page: 'gallery' },
  { label: 'About Us', page: 'about' },
];

const SERVICE_LINKS: { label: string; page: Page }[] = [
  { label: 'Contact Us', page: 'contact' },
  { label: 'FAQs', page: 'faqs' },
  { label: 'Manage Reservations', page: 'my-bookings' },
  { label: 'Guest Sign In', page: 'signin' },
];

const directionsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(HOTEL_INFO.mapsQuery)}`;

export const Footer: React.FC = () => {
  const { navigateTo } = useHotel();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      setSubscribed(true);
      setTimeout(() => {
        setNewsletterEmail('');
        setSubscribed(false);
      }, 5000);
    }
  };

  const linkClass =
    'text-sm text-stone-400 hover:text-amber-200 transition-colors text-left';
  const headingClass =
    'text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-300 mb-5';

  return (
    <footer className="relative bg-stone-950 text-stone-300">
      {/* Gold hairline across the top */}
      <div className="h-px bg-linear-to-r from-transparent via-amber-400/70 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top band: logo + tagline + CTA */}
        <div className="py-12 flex flex-col md:flex-row items-center md:items-center justify-between gap-8 border-b border-stone-800/80">
          <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
            <img src="/images/kgrand-logo-dark.png" alt="The K Grand Hotel" className="h-28 md:h-24 w-auto" />
            <div className="hidden md:block h-16 w-px bg-stone-800" />
            {/* The logo image already carries the tagline at small sizes, so only repeat it large on desktop */}
            <div className="hidden md:block">
              <p className="font-serif text-2xl text-white font-light">Inspired by Comfort,</p>
              <p className="font-serif text-2xl text-amber-200 italic font-light">Defined by Care.</p>
            </div>
          </div>
          <button
            onClick={() => navigateTo('rooms')}
            className="btn-gold px-8 py-3.5 text-xs font-semibold uppercase tracking-widest shrink-0"
          >
            Book Your Stay
          </button>
        </div>

        {/* Main columns */}
        <div className="py-12 grid grid-cols-2 lg:grid-cols-12 gap-x-6 gap-y-10 lg:gap-8 border-b border-stone-800/80">
          {/* Contact */}
          <div className="col-span-2 lg:col-span-4">
            <h4 className={headingClass}>Visit & Contact</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                <div>
                  <p className="text-stone-300 leading-relaxed">{HOTEL_INFO.address}</p>
                  <a
                    href={directionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 mt-1.5 text-xs text-amber-300 hover:text-amber-200 transition-colors"
                  >
                    <Navigation className="w-3 h-3" />
                    Get Directions
                  </a>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-amber-300 shrink-0" />
                <a href={HOTEL_INFO.phoneHref} className="text-stone-300 hover:text-amber-200 transition-colors">
                  {HOTEL_INFO.phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-amber-300 shrink-0" />
                <a
                  href={`mailto:${HOTEL_INFO.reservationsEmail}`}
                  className="text-stone-300 hover:text-amber-200 transition-colors break-all"
                >
                  {HOTEL_INFO.reservationsEmail}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-amber-300 shrink-0" />
                <span className="text-stone-400">
                  Check-in {HOTEL_INFO.checkInTime} · Check-out {HOTEL_INFO.checkOutTime}
                </span>
              </li>
            </ul>
          </div>

          {/* Explore */}
          <div className="lg:col-span-2">
            <h4 className={headingClass}>Explore</h4>
            <ul className="space-y-3">
              {EXPLORE_LINKS.map((link) => (
                <li key={link.page}>
                  <button onClick={() => navigateTo(link.page)} className={linkClass}>
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Guest Services */}
          <div className="lg:col-span-2">
            <h4 className={headingClass}>Guest Services</h4>
            <ul className="space-y-3">
              {SERVICE_LINKS.map((link) => (
                <li key={link.page}>
                  <button onClick={() => navigateTo(link.page)} className={linkClass}>
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="col-span-2 lg:col-span-4">
            <h4 className={headingClass}>Stay in Touch</h4>
            <p className="text-sm text-stone-400 leading-relaxed mb-4">{HOTEL_INFO.welcomeText}</p>
            {subscribed ? (
              <div className="p-3 bg-stone-900 border border-stone-800 rounded-xs text-xs text-amber-200 flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Thank you! We'll keep you posted on promos and updates.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe}>
                <div className="flex">
                  <input
                    type="email"
                    required
                    placeholder="Your email address"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    className="w-full min-w-0 bg-stone-900 border border-stone-800 border-r-0 rounded-l-xs px-4 py-3 text-sm text-stone-100 placeholder:text-stone-500 focus:outline-none focus:border-amber-400"
                  />
                  <button
                    type="submit"
                    className="btn-gold rounded-l-none px-4 flex items-center justify-center shrink-0"
                    aria-label="Subscribe"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-[11px] text-stone-500 mt-2">Get promos and updates. No spam, unsubscribe anytime.</p>
              </form>
            )}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-500">
          <p>© {new Date().getFullYear()} The K Grand Hotel. All rights reserved.</p>
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            <button onClick={() => navigateTo('privacy')} className="hover:text-stone-300 transition-colors">
              Privacy Policy
            </button>
            <button onClick={() => navigateTo('terms')} className="hover:text-stone-300 transition-colors">
              Terms & Conditions
            </button>
            <span className="text-stone-600">Clark Freeport Zone, Pampanga</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
