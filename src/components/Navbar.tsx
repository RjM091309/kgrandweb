import React, { useState, useEffect } from 'react';
import { useHotel, Page } from '../context/HotelContext';

export const Navbar: React.FC = () => {
  const { currentPage, navigateTo } = useHotel();
  const [isScrolled, setIsScrolled] = useState(false);

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
