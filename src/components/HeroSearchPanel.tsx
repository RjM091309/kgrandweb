import React, { useEffect, useRef, useState } from 'react';
import { useHotel } from '../context/HotelContext';
import { Users, Search, ChevronDown, Plus, Minus, ShieldCheck } from 'lucide-react';
import { DateRangePicker } from './DateRangePicker';
import { ROOM_CATEGORIES } from '../data/hotelData';

interface HeroSearchPanelProps {
  compact?: boolean;
  /** `bar` = horizontal strip (rooms page); `card` = stacked booking card for the home hero. */
  layout?: 'bar' | 'card';
}

const CATEGORIES = ROOM_CATEGORIES;

export const HeroSearchPanel: React.FC<HeroSearchPanelProps> = ({ compact = false, layout = 'bar' }) => {
  const { searchState, updateSearch, navigateTo } = useHotel();
  const [showGuestDropdown, setShowGuestDropdown] = useState(false);
  const guestRef = useRef<HTMLDivElement>(null);
  const guestTotal = searchState.adults + searchState.children;
  const isCard = layout === 'card';

  const guestRows = [
    { key: 'adults', label: 'Adults', hint: 'Ages 13 and above', min: 1, max: 8 },
    { key: 'children', label: 'Children', hint: 'Ages 0 to 12', min: 0, max: 6 },
    { key: 'roomsCount', label: 'Rooms', hint: 'Number of rooms', min: 1, max: 4 },
  ] as const;

  useEffect(() => {
    if (!showGuestDropdown) return;
    const onPointer = (e: MouseEvent) => {
      if (guestRef.current && !guestRef.current.contains(e.target as Node)) setShowGuestDropdown(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setShowGuestDropdown(false);
    document.addEventListener('mousedown', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [showGuestDropdown]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowGuestDropdown(false);
    navigateTo('rooms');
  };

  const dateField = (
    <DateRangePicker
      checkIn={searchState.checkIn}
      checkOut={searchState.checkOut}
      onChange={updateSearch}
      align={isCard ? 'right' : 'left'}
      className={isCard ? 'h-[68px]' : 'sm:col-span-2 lg:col-span-6 h-[68px]'}
    />
  );

  const guestField = (
    <div ref={guestRef} className={`relative h-[68px] ${isCard ? '' : 'lg:col-span-3'}`}>
      <button
        type="button"
        onClick={() => setShowGuestDropdown(!showGuestDropdown)}
        aria-expanded={showGuestDropdown}
        className={`w-full h-full text-left rounded-xs border px-4 py-3 transition-colors cursor-pointer focus:outline-none ${
          showGuestDropdown ? 'border-amber-500 bg-amber-50/80' : 'border-stone-200 bg-white hover:border-amber-400'
        }`}
      >
        <span className="block text-[11px] font-medium uppercase tracking-wider text-stone-500 mb-1">
          Guests & Rooms
        </span>
        <span className="flex items-center justify-between gap-2">
          <span className="flex items-center gap-2 min-w-0">
            <Users className="w-4 h-4 text-amber-700 shrink-0" />
            <span className="text-sm font-semibold text-stone-900 truncate">
              {guestTotal} {guestTotal === 1 ? 'Guest' : 'Guests'} · {searchState.roomsCount} {searchState.roomsCount === 1 ? 'Room' : 'Rooms'}
            </span>
          </span>
          <ChevronDown
            className={`w-4 h-4 text-stone-400 shrink-0 transition-transform ${showGuestDropdown ? 'rotate-180 text-amber-600' : ''}`}
          />
        </span>
      </button>

      {showGuestDropdown && (
        <div className="absolute top-full right-0 mt-2 z-50 w-[min(calc(100vw-2rem),20rem)] rounded-sm border border-stone-200 bg-white p-5 shadow-2xl animate-in fade-in slide-in-from-top-1">
          <div className="divide-y divide-stone-100">
            {guestRows.map((row) => (
              <div key={row.key} className="flex items-center justify-between gap-4 py-3.5 first:pt-0">
                <div>
                  <p className="text-sm font-semibold text-stone-900">{row.label}</p>
                  <p className="text-[11px] text-stone-500">{row.hint}</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    aria-label={`Decrease ${row.label}`}
                    disabled={searchState[row.key] <= row.min}
                    onClick={() => updateSearch({ [row.key]: searchState[row.key] - 1 })}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-stone-300 text-stone-700 transition-colors hover:border-amber-500 hover:bg-amber-50 hover:text-amber-800 disabled:border-stone-200 disabled:text-stone-300 disabled:hover:bg-transparent disabled:cursor-not-allowed cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-5 text-center text-sm font-bold tabular-nums text-stone-900">
                    {searchState[row.key]}
                  </span>
                  <button
                    type="button"
                    aria-label={`Increase ${row.label}`}
                    disabled={searchState[row.key] >= row.max}
                    onClick={() => updateSearch({ [row.key]: searchState[row.key] + 1 })}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-stone-300 text-stone-700 transition-colors hover:border-amber-500 hover:bg-amber-50 hover:text-amber-800 disabled:border-stone-200 disabled:text-stone-300 disabled:hover:bg-transparent disabled:cursor-not-allowed cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between gap-3 mt-2 pt-4 border-t border-stone-100">
            <p className="text-xs text-stone-500">
              {searchState.adults} {searchState.adults === 1 ? 'adult' : 'adults'}
              {searchState.children > 0 && `, ${searchState.children} ${searchState.children === 1 ? 'child' : 'children'}`}
            </p>
            <button
              type="button"
              onClick={() => setShowGuestDropdown(false)}
              className="shrink-0 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-amber-200 bg-stone-900 hover:bg-stone-800 rounded-xs transition-colors cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );

  if (isCard) {
    return (
      <div className="relative w-full bg-white/95 backdrop-blur-md rounded-sm shadow-2xl border border-white/40 p-6 sm:p-7">
        <div className="mb-5">
          <div className="flex items-center gap-2.5">
            <p className="text-[11px] uppercase tracking-[0.25em] font-semibold text-amber-700">Book Direct</p>
            <span className="inline-flex items-center px-2 py-0.5 rounded-xs border border-amber-300 bg-amber-50 text-[9px] font-bold uppercase tracking-[0.2em] text-amber-800">
              Best Rate
            </span>
          </div>
          <h2 className="font-serif text-2xl text-stone-900 mt-1">Reserve Your Stay</h2>
        </div>

        <form onSubmit={handleSearchSubmit} className="space-y-3">
          {dateField}
          {guestField}

          {/* Category chips */}
          <div className="pt-2">
            <p className="text-[11px] font-medium uppercase tracking-wider text-stone-500 mb-2">Room Type</p>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => {
                const isActive = searchState.category === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => updateSearch({ category: cat })}
                    aria-pressed={isActive}
                    className={`px-3 py-1.5 text-xs rounded-xs border transition-colors ${
                      isActive
                        ? 'border-stone-900 bg-stone-900 text-amber-200 font-semibold'
                        : 'border-stone-200 text-stone-600 hover:border-amber-400 hover:text-stone-900'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          <button
            type="submit"
            className="btn-gold w-full h-14 mt-3 flex items-center justify-center gap-2 text-sm font-semibold tracking-wider uppercase"
          >
            <Search className="w-4 h-4" />
            <span>Check Availability</span>
          </button>

          <p className="flex items-center justify-center gap-1.5 pt-1 text-[11px] text-stone-500">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
            Best Rate Guarantee · Flexible Cancellation
          </p>
        </form>
      </div>
    );
  }

  return (
    <div
      className={`w-full bg-white/95 backdrop-blur-md rounded-sm shadow-2xl border border-stone-200/80 ${
        compact ? 'p-4' : 'p-4 sm:p-6 lg:p-7'
      }`}
    >
      <form onSubmit={handleSearchSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3">
          {dateField}
          {guestField}

          {/* Search Button */}
          <div className="lg:col-span-3">
            <button
              type="submit"
              className="w-full h-[68px] bg-stone-900 hover:bg-stone-800 active:bg-stone-950 text-white font-medium text-xs sm:text-sm tracking-wider uppercase rounded-xs transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg cursor-pointer"
            >
              <Search className="w-4 h-4 text-amber-300" />
              <span>Search Availability</span>
            </button>
          </div>
        </div>

        {/* Category Quick Selector */}
        {!compact && (
          <div className="flex items-center justify-between pt-1 border-t border-stone-100 text-xs text-stone-500">
            <div className="flex items-center gap-4 overflow-x-auto py-1 scrollbar-none">
              <span className="text-[11px] font-medium text-stone-400 uppercase tracking-wider shrink-0">
                Category:
              </span>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => updateSearch({ category: cat })}
                  className={`text-xs whitespace-nowrap transition-colors ${
                    searchState.category === cat
                      ? 'text-amber-800 font-bold underline underline-offset-4 decoration-amber-500'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className="hidden md:flex items-center gap-3 text-[11px] text-stone-400">
              <span>Best Rate Guarantee</span>
              <span>·</span>
              <span>Flexible Cancellation</span>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};
