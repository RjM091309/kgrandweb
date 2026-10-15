import React, { useState, useEffect } from 'react';
import { useHotel, Page } from '../context/HotelContext';
import { User } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { currentPage, navigateTo, user, logoutUser } = useHotel();
  const [isScrolled, setIsScrolled] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks: { label: string; page: Page }[] = [
    { label: 'Rooms', page: 'rooms' },
    { label: 'Amenities', page: 'amenities' },
    { label: 'Special Offers', page: 'offers' },
    { label: 'Gallery', page: 'gallery' },
    { label: 'Contact', page: 'contact' },
  ];

  return (
    <>
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-stone-900/95 backdrop-blur-md text-stone-100 shadow-md border-b border-stone-800/80 py-3 lg:py-3.5'
            : 'bg-stone-950 text-stone-100 border-b border-stone-900 py-3 lg:py-4.5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3 sm:gap-8">
          {/* Zone 1: Logo */}
          <button
            onClick={() => navigateTo('home')}
            className="shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-400 transition-opacity hover:opacity-85"
          >
            <img
              src="/images/kgrand-logo-dark.png"
              alt="The K Grand Hotel"
              className={`w-auto transition-all duration-300 h-10 min-[360px]:h-12 ${isScrolled ? 'lg:h-12' : 'lg:h-14'}`}
            />
          </button>

          {/* Zone 2: 4–5 clean single-line text navigation links */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-10 text-[13px] xl:text-sm tracking-[0.14em] uppercase font-medium">
            {navLinks.map((item) => {
              const isActive = currentPage === item.page;
              return (
                <button
                  key={item.page}
                  onClick={() => navigateTo(item.page)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`group relative py-2 whitespace-nowrap shrink-0 transition-colors duration-300 ${
                    isActive ? 'text-amber-300' : 'text-stone-200 hover:text-amber-200'
                  }`}
                >
                  {item.label}
                  {/* Gold underline that grows from the center on hover, stays full on the active page */}
                  <span
                    className={`absolute left-0 right-0 -bottom-0.5 mx-auto h-px bg-linear-to-r from-transparent via-amber-300 to-transparent transition-all duration-300 ${
                      isActive ? 'w-full opacity-100' : 'w-0 opacity-0 group-hover:w-full group-hover:opacity-100'
                    }`}
                  />
                </button>
              );
            })}
          </nav>

          {/* Zone 3: 1 primary action + guest account shortcut */}
          <div className="flex items-center gap-1.5 min-[360px]:gap-3 sm:gap-4 shrink-0">
            {/* Account trigger */}
            <div className="relative">
              {user.isLoggedIn ? (
                <button
                  onClick={() => setAccountMenuOpen(!accountMenuOpen)}
                  className="flex items-center justify-center gap-2 h-10 w-10 rounded-full sm:h-auto sm:w-auto sm:rounded sm:px-3 sm:py-1.5 text-xs text-stone-200 hover:text-white bg-stone-800/80 hover:bg-stone-800 border border-stone-700/80 transition-colors whitespace-nowrap shrink-0"
                >
                  <User className="w-5 h-5 sm:w-3.5 sm:h-3.5 text-amber-300" />
                  <span className="hidden sm:inline font-sans">{user.firstName}</span>
                  <span className="text-[10px] text-amber-300/90 hidden md:inline">({user.membershipTier.split(' ')[1]})</span>
                </button>
              ) : (
                <button
                  onClick={() => navigateTo('signin')}
                  aria-label="Sign in"
                  className="flex items-center justify-center gap-1.5 h-10 w-10 rounded-full border border-stone-700/80 bg-stone-900/60 sm:h-auto sm:w-auto sm:rounded-none sm:border-0 sm:bg-transparent sm:px-3 sm:py-1.5 text-xs text-stone-300 hover:text-white transition-colors whitespace-nowrap shrink-0"
                >
                  <User className="w-5 h-5 sm:w-3.5 sm:h-3.5 text-amber-300" />
                  <span className="hidden sm:inline">Sign In</span>
                </button>
              )}

              {/* Account Dropdown */}
              {accountMenuOpen && user.isLoggedIn && (
                <div
                  className="absolute right-0 mt-2 w-56 bg-stone-900 border border-stone-800 shadow-xl rounded-md py-2 text-xs text-stone-200 z-50 animate-in fade-in slide-in-from-top-1"
                  onMouseLeave={() => setAccountMenuOpen(false)}
                >
                  <div className="px-4 py-2 border-b border-stone-800">
                    <p className="font-semibold text-stone-100">{user.title} {user.firstName} {user.lastName}</p>
                    <p className="text-[11px] text-amber-300">{user.membershipTier}</p>
                  </div>
                  <button
                    onClick={() => {
                      setAccountMenuOpen(false);
                      navigateTo('profile');
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-stone-800 transition-colors block"
                  >
                    Guest Profile & Preferences
                  </button>
                  <button
                    onClick={() => {
                      setAccountMenuOpen(false);
                      navigateTo('my-bookings');
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-stone-800 transition-colors block"
                  >
                    My Reservations
                  </button>
                  <div className="border-t border-stone-800 my-1"></div>
                  <button
                    onClick={() => {
                      setAccountMenuOpen(false);
                      logoutUser();
                    }}
                    className="w-full text-left px-4 py-2 text-stone-400 hover:text-red-300 hover:bg-stone-800 transition-colors block"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>

            {/* Primary Action Button */}
            <button
              onClick={() => navigateTo('rooms')}
              className="btn-gold hidden lg:inline-flex px-5 py-2 text-xs tracking-wider uppercase font-semibold whitespace-nowrap shrink-0"
            >
              Book Now
            </button>

          </div>
        </div>
      </header>

    </>
  );
};
