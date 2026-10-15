import React, { useState, useMemo } from 'react';
import { useHotel } from '../context/HotelContext';
import { ROOMS, ROOM_CATEGORIES, Room, IMAGES } from '../data/hotelData';
import { HeroSearchPanel } from '../components/HeroSearchPanel';
import {
  LayoutGrid,
  List,
  SlidersHorizontal,
  Star,
  Users,
  Maximize2,
  Bed,
  Check,
  ChevronDown,
  ArrowRight,
  Sparkles,
  Wifi,
  Coffee,
  RotateCcw
} from 'lucide-react';
import { Select } from '../components/Select';

// Nightly rate slider bounds (PHP)
const MIN_RATE = 2000;
const MAX_RATE = 10000;

export const RoomsPage: React.FC = () => {
  const { searchState, updateSearch, selectRoom, navigateTo } = useHotel();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'popularity' | 'price-asc' | 'price-desc' | 'size'>('popularity');
  const [maxPrice, setMaxPrice] = useState<number>(MAX_RATE);
  const [selectedCategory, setSelectedCategory] = useState<string>(searchState.category || 'All');
  const [minGuests, setMinGuests] = useState<number>(1);
  const [selectedBedType, setSelectedBedType] = useState<string>('all');
  // Filters panel is collapsed by default below lg so the rooms show up first on phones/tablets.
  const [showFilters, setShowFilters] = useState(false);

  const categories = ROOM_CATEGORIES;

  const filteredAndSortedRooms = useMemo(() => {
    return ROOMS.filter((room) => {
      // Category filter
      if (selectedCategory !== 'All' && room.category !== selectedCategory) {
        return false;
      }
      // Price filter
      if (room.pricePerNight > maxPrice) {
        return false;
      }
      // Guest capacity
      if (room.maxAdults < minGuests) {
        return false;
      }
      // Bed type filter
      if (selectedBedType === 'king' && !room.bedConfiguration.toLowerCase().includes('king')) {
        return false;
      }
      if (selectedBedType === 'queen' && !room.bedConfiguration.toLowerCase().includes('queen')) {
        return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.pricePerNight - b.pricePerNight;
      if (sortBy === 'price-desc') return b.pricePerNight - a.pricePerNight;
      if (sortBy === 'size') return b.sizeSqM - a.sizeSqM;
      // Popularity default
      return (b.popular ? 1 : 0) - (a.popular ? 1 : 0);
    });
  }, [selectedCategory, maxPrice, minGuests, selectedBedType, sortBy]);

  const resetFilters = () => {
    setSelectedCategory('All');
    setMaxPrice(MAX_RATE);
    setMinGuests(1);
    setSelectedBedType('all');
    setSortBy('popularity');
    updateSearch({ category: 'All' });
  };

  const handleSelectRoom = (room: Room) => {
    selectRoom(room);
    navigateTo('room-detail', { roomId: room.id });
  };

  const handleBookNow = (room: Room) => {
    selectRoom(room);
    navigateTo('booking', { roomId: room.id });
  };

  return (
    <div className="space-y-12 pb-20">
      {/* 1. Header Banner */}
      <section className="relative h-72 sm:h-80 lg:h-96 flex items-center justify-center overflow-hidden bg-stone-950">
        <img
          src={IMAGES.galleryRoom2}
          alt="Guest room at The K Grand Hotel"
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover opacity-45"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/40 to-stone-950/80" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center space-y-3">
          <span className="text-xs uppercase tracking-[0.25em] text-amber-300 font-medium">
            Accommodations
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-white font-light">
            Our Rooms
          </h1>
          <p className="text-xs sm:text-sm text-stone-300 max-w-xl mx-auto leading-relaxed">
            Apartment-style rooms with air-conditioning, a private bathroom, a work desk, and your own terrace or balcony.
          </p>
        </div>
      </section>

      {/* 2. Floating Search Bar Component */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-20">
        <HeroSearchPanel compact />
      </div>

      {/* 3. Main Content: Filter & Listing */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Controls Toolbar: Categories, View Toggle, Sorting */}
        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
          {/* Category Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto w-full md:w-auto scrollbar-none pb-1 md:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  updateSearch({ category: cat });
                }}
                className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                  selectedCategory === cat
                    ? 'bg-stone-900 text-white shadow-sm'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Right Toolbar: Sort and Grid/List View */}
          <div className="flex items-center justify-between w-full md:w-auto gap-4">
            {/* Sorting Dropdown */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-stone-500 hidden sm:inline">Sort:</span>
              <Select
                value={String(sortBy)}
                onChange={(v) => setSortBy(v as any)}
                options={[
                  { value: "popularity", label: "Most Recommended" },
                  { value: "price-asc", label: "Price: Low to High" },
                  { value: "price-desc", label: "Price: High to Low" },
                  { value: "size", label: "Largest Area (m²)" },
                ]}
                align="right"
                aria-label="Sort rooms"
                className="text-xs w-48"
              />
            </div>

            {/* Grid vs List View Toggle */}
            <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-lg border border-stone-200">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded transition-colors ${
                  viewMode === 'grid' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500 hover:text-stone-900'
                }`}
                aria-label="Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded transition-colors ${
                  viewMode === 'list' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500 hover:text-stone-900'
                }`}
                aria-label="List View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Layout Grid: Sidebar Filters (desktop) + Room List */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1 space-y-6">
            <div
              className={`bg-white p-5 rounded-sm border border-stone-200/90 shadow-sm ${
                showFilters ? 'space-y-6' : 'lg:space-y-6 [&>*:not(:first-child)]:hidden lg:[&>*:not(:first-child)]:block'
              }`}
            >
              <div className={`flex items-center justify-between ${showFilters ? 'pb-3 border-b border-stone-100' : 'lg:pb-3 lg:border-b lg:border-stone-100'}`}>
                <button
                  type="button"
                  onClick={() => setShowFilters((v) => !v)}
                  aria-expanded={showFilters}
                  className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-stone-900 lg:pointer-events-none"
                >
                  <SlidersHorizontal className="w-4 h-4 text-amber-700" />
                  <span>Filters</span>
                  <ChevronDown className={`w-4 h-4 text-stone-400 transition-transform lg:hidden ${showFilters ? 'rotate-180' : ''}`} />
                </button>
                <button
                  onClick={resetFilters}
                  className="text-[11px] text-stone-400 hover:text-stone-700 flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              </div>

              {/* Price Filter Slider */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-stone-700">Nightly Rate (Max)</span>
                  <span className="font-bold text-stone-900 tabular-nums">₱{maxPrice.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min={MIN_RATE}
                  max={MAX_RATE}
                  step="250"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-amber-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-stone-400">
                  <span>₱{MIN_RATE.toLocaleString()}</span>
                  <span>₱{MAX_RATE.toLocaleString()}+</span>
                </div>
              </div>

              {/* Minimum Guest Capacity */}
              <div className="space-y-2 pt-2 border-t border-stone-100">
                <span className="block text-xs font-medium text-stone-700">Guest Capacity</span>
                <div className="grid grid-cols-4 gap-1.5">
                  {[1, 2, 4, 6].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setMinGuests(num)}
                      className={`py-1 text-xs rounded border transition-colors ${
                        minGuests === num
                          ? 'bg-amber-100 border-amber-300 text-amber-900 font-semibold'
                          : 'border-stone-200 text-stone-600 hover:border-stone-300'
                      }`}
                    >
                      {num}+
                    </button>
                  ))}
                </div>
              </div>

              {/* Bed Type */}
              <div className="space-y-2 pt-2 border-t border-stone-100">
                <span className="block text-xs font-medium text-stone-700">Bed Configuration</span>
                <div className="space-y-1.5 text-xs text-stone-600">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="bedType"
                      checked={selectedBedType === 'all'}
                      onChange={() => setSelectedBedType('all')}
                      className="accent-amber-600"
                    />
                    <span>All Configurations</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="bedType"
                      checked={selectedBedType === 'king'}
                      onChange={() => setSelectedBedType('king')}
                      className="accent-amber-600"
                    />
                    <span>King Bed</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="bedType"
                      checked={selectedBedType === 'queen'}
                      onChange={() => setSelectedBedType('queen')}
                      className="accent-amber-600"
                    />
                    <span>Queen Bed</span>
                  </label>
                </div>
              </div>

              {/* Inclusions summary */}
              <div className="p-3.5 bg-stone-50 rounded-lg space-y-2 text-xs text-stone-600 border border-stone-200/60">
                <p className="font-semibold text-stone-900 text-[11px] uppercase tracking-wider">
                  Always Included:
                </p>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Air-conditioning & private bathroom</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Sauna & pool access</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Free parking & EV charging</span>
                </div>
              </div>
            </div>
          </div>

          {/* Rooms Grid / List Display */}
          <div className="lg:col-span-3">
            {filteredAndSortedRooms.length === 0 ? (
              <div className="bg-white p-12 text-center rounded-xl border border-stone-200 space-y-4">
                <p className="font-serif text-lg text-stone-800">
                  No accommodations match your filter criteria.
                </p>
                <p className="text-xs text-stone-500 max-w-sm mx-auto">
                  Try adjusting your price ceiling or resetting filters to see all available rooms.
                </p>
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 bg-stone-900 text-white rounded text-xs font-semibold uppercase tracking-wider"
                >
                  Reset All Filters
                </button>
              </div>
            ) : viewMode === 'grid' ? (
              /* GRID VIEW */
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredAndSortedRooms.map((room) => (
                  <div
                    key={room.id}
                    className="bg-white rounded-xl overflow-hidden border border-stone-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
                  >
                    {/* Image */}
                    <div className="relative aspect-[16/10] overflow-hidden bg-stone-100">
                      <img
                        src={room.images[0]}
                        alt={room.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60" />

                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
                        <span className="font-serif italic text-amber-200">{room.category}</span>
                        <div className="flex items-center gap-1 bg-stone-950/70 px-2 py-0.5 rounded text-[11px]">
                          <Star className="w-3 h-3 text-amber-300 fill-amber-300" />
                          <span className="font-semibold tabular-nums">{room.rating.toFixed(2)}</span>
                          <span className="text-stone-400">({room.reviewCount})</span>
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                      <div className="space-y-2">
                        <h3 className="font-serif text-lg text-stone-900 group-hover:text-amber-900 transition-colors">
                          {room.name}
                        </h3>

                        {/* Metadata text without pills */}
                        <div className="flex items-center gap-2 text-xs text-stone-500 flex-wrap">
                          <span>{room.sizeSqM} m²</span>
                          <span aria-hidden="true">·</span>
                          <span>{room.bedConfiguration.split(' ')[1]} Bed</span>
                          <span aria-hidden="true">·</span>
                          <span>Up to {room.maxAdults} Adults</span>
                        </div>

                        <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                          {room.description}
                        </p>

                        {/* Top Features */}
                        <div className="space-y-1 pt-1">
                          {room.features.slice(0, 2).map((feat, i) => (
                            <div key={i} className="flex items-center gap-1.5 text-[11px] text-stone-600">
                              <Check className="w-3 h-3 text-amber-600 shrink-0" />
                              <span className="truncate">{feat}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Footer Actions */}
                      <div className="pt-4 border-t border-stone-100 flex items-center justify-between gap-3">
                        <div>
                          <span className="text-[10px] text-stone-400 block uppercase tracking-wider">Per Night</span>
                          <div className="flex items-baseline gap-1">
                            <span className="text-xl font-serif font-bold text-stone-900 tabular-nums">
                              ₱{room.pricePerNight.toLocaleString()}
                            </span>
                            {room.originalPrice && (
                              <span className="text-xs text-stone-400 line-through tabular-nums">
                                ₱{room.originalPrice.toLocaleString()}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleSelectRoom(room)}
                            className="px-3 py-2 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded transition-colors"
                          >
                            Details
                          </button>
                          <button
                            onClick={() => handleBookNow(room)}
                            className="px-4 py-2 text-xs font-semibold text-stone-950 bg-amber-300 hover:bg-amber-200 rounded transition-colors shadow-sm"
                          >
                            Reserve
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* LIST VIEW */
              <div className="space-y-6">
                {filteredAndSortedRooms.map((room) => (
                  <div
                    key={room.id}
                    className="bg-white rounded-xl overflow-hidden border border-stone-200/90 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col md:flex-row group"
                  >
                    {/* Image */}
                    <div className="md:w-5/12 relative aspect-[16/10] md:aspect-auto overflow-hidden bg-stone-100 min-h-[220px]">
                      <img
                        src={room.images[0]}
                        alt={room.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute bottom-3 left-3 bg-stone-950/80 px-2 py-0.5 rounded text-[11px] text-white flex items-center gap-1">
                        <Star className="w-3 h-3 text-amber-300 fill-amber-300" />
                        <span className="tabular-nums font-semibold">{room.rating.toFixed(2)}</span>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="p-6 md:w-7/12 flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-mono text-amber-800 uppercase tracking-widest">
                            {room.category}
                          </span>
                          <span className="text-xs text-stone-500 font-medium">{room.view}</span>
                        </div>

                        <h3 className="font-serif text-xl text-stone-900 group-hover:text-amber-900 transition-colors">
                          {room.name}
                        </h3>

                        {/* Unboxed Metadata */}
                        <div className="flex items-center gap-2 text-xs text-stone-500">
                          <span>{room.sizeSqM} m² ({room.sizeSqFt} sq ft)</span>
                          <span aria-hidden="true">·</span>
                          <span>{room.bedConfiguration}</span>
                          <span aria-hidden="true">·</span>
                          <span>Max {room.maxAdults} Adults, {room.maxChildren} Children</span>
                        </div>

                        <p className="text-xs text-stone-600 leading-relaxed pt-1">
                          {room.description}
                        </p>

                        {/* Features grid */}
                        <div className="grid grid-cols-2 gap-1.5 pt-2">
                          {room.features.slice(0, 4).map((f, i) => (
                            <div key={i} className="flex items-center gap-1 text-[11px] text-stone-600">
                              <Check className="w-3 h-3 text-amber-700 shrink-0" />
                              <span className="truncate">{f}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Pricing and Actions */}
                      <div className="pt-4 border-t border-stone-100 flex items-center justify-between gap-4">
                        <div>
                          <span className="text-[11px] text-stone-400 block uppercase">Nightly Rate</span>
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-2xl font-serif font-bold text-stone-900 tabular-nums">
                              ₱{room.pricePerNight.toLocaleString()}
                            </span>
                            <span className="text-xs text-stone-500">/ night</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleSelectRoom(room)}
                            className="px-4 py-2 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded transition-colors"
                          >
                            View Details
                          </button>
                          <button
                            onClick={() => handleBookNow(room)}
                            className="px-5 py-2 text-xs font-semibold text-stone-950 bg-amber-300 hover:bg-amber-200 rounded transition-colors shadow-sm"
                          >
                            Reserve Room
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
