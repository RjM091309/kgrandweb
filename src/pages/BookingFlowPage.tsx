import React, { useState } from 'react';
import { DateRangePicker } from '../components/DateRangePicker';
import { useHotel } from '../context/HotelContext';
import { ROOMS, HOTEL_INFO } from '../data/hotelData';
import { createBooking, BookingResponse } from '../lib/bookingApi';
import {
  Check,
  ShieldCheck,
  ArrowRight,
  ChevronLeft,
  Info,
  Printer,
  Loader2,
  AlertCircle,
  Wallet,
  Phone,
  Mail
} from 'lucide-react';
import { Select } from '../components/Select';

interface GuestForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  estimatedArrival: string;
  specialRequests: string;
  /** Honeypot: hidden from people, so only bots fill it in. */
  website: string;
}

const peso = (n: number) => `₱${n.toLocaleString()}`;

const inputClass =
  'w-full bg-stone-50 border border-stone-200 rounded-lg p-2.5 text-xs text-stone-900 focus:outline-none focus:border-amber-500';

/**
 * Books a stay straight into the K Grand admin system (see lib/bookingApi). The booking arrives at the front desk on hold, the
 * guest pays at the hotel, and the front desk confirms it with the guest.
 */
export const BookingFlowPage: React.FC = () => {
  const { selectedRoom, selectRoom, searchState, updateSearch, navigateTo, showNotification, availability } = useHotel();

  const currentRoom = selectedRoom || ROOMS[0];

  // Steps: 1 Stay & Room, 2 Guest Details, 3 Review & Confirm, 4 Confirmation
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [guestForm, setGuestForm] = useState<GuestForm>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    country: 'Philippines',
    estimatedArrival: HOTEL_INFO.checkInTime,
    specialRequests: '',
    website: '',
  });
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [confirmed, setConfirmed] = useState<BookingResponse | null>(null);

  // Nights, guests and price (the admin system bills nights × nightly rate per room, with no added taxes or fees)
  const checkInDate = new Date(searchState.checkIn);
  const checkOutDate = new Date(searchState.checkOut);
  const nightsCount = Math.max(1, Math.round((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24)));
  const guestCount = searchState.adults + searchState.children;
  const capacity = currentRoom.maxAdults * searchState.roomsCount;
  const totalDue = currentRoom.pricePerNight * nightsCount * searchState.roomsCount;
  const roomsLeft = availability?.[currentRoom.apiTypeId];

  const stayProblem =
    guestCount > capacity
      ? `A ${currentRoom.name} takes up to ${currentRoom.maxAdults} guests per room. Add a room or choose fewer guests.`
      : searchState.adults < searchState.roomsCount
      ? 'Each room needs at least one adult.'
      : roomsLeft !== undefined && roomsLeft < searchState.roomsCount
      ? roomsLeft === 0
        ? `The ${currentRoom.name} is sold out for these dates. Please choose other dates or another room.`
        : `Only ${roomsLeft} ${currentRoom.name}${roomsLeft === 1 ? ' is' : 's are'} left for these dates.`
      : '';

  const guestProblem = !guestForm.firstName.trim() || !guestForm.lastName.trim()
    ? 'Please enter your first and last name.'
    : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guestForm.email.trim())
    ? 'Please enter a valid email address.'
    : !guestForm.phone.trim()
    ? 'Please enter your phone number.'
    : '';

  const goTo = (step: number) => {
    setError('');
    setCurrentStep(step);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleConfirmReservation = async () => {
    setError('');
    setSubmitting(true);
    try {
      const result = await createBooking({
        roomTypeId: currentRoom.apiTypeId,
        checkIn: searchState.checkIn,
        checkOut: searchState.checkOut,
        rooms: searchState.roomsCount,
        adults: searchState.adults,
        children: searchState.children,
        guest: {
          name: `${guestForm.firstName.trim()} ${guestForm.lastName.trim()}`,
          email: guestForm.email.trim(),
          phone: guestForm.phone.trim(),
          country: guestForm.country.trim(),
        },
        specialRequests: guestForm.specialRequests.trim(),
        estimatedArrival: guestForm.estimatedArrival,
        website: guestForm.website,
      });
      setConfirmed(result);
      showNotification(`Booking ${result.codes.join(', ')} received!`);
      goTo(4);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const stepTitles = ['Stay & Room', 'Guest Details', 'Review & Confirm'];

  const errorBox = error && (
    <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-800 flex items-start gap-2">
      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
      <span>{error}</span>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Step Tracker Indicator */}
      {currentStep < 4 && (
        <div className="bg-white rounded-xl p-4 sm:p-5 border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            {stepTitles.map((title, idx) => {
              const stepNumber = idx + 1;
              const isPassed = currentStep > stepNumber;
              const isCurrent = currentStep === stepNumber;

              return (
                <div key={idx} className="flex items-center gap-2">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-colors ${
                      isPassed
                        ? 'bg-emerald-700 text-white'
                        : isCurrent
                        ? 'bg-amber-300 text-stone-950 font-bold ring-2 ring-amber-400/40'
                        : 'bg-stone-100 text-stone-400'
                    }`}
                  >
                    {isPassed ? <Check className="w-3.5 h-3.5" /> : stepNumber}
                  </div>
                  <span
                    className={`text-xs hidden sm:inline ${
                      isCurrent ? 'font-semibold text-stone-900' : 'text-stone-500'
                    }`}
                  >
                    {title}
                  </span>
                  {idx < stepTitles.length - 1 && (
                    <div className="w-8 sm:w-16 h-0.5 bg-stone-200 hidden md:block mx-1" />
                  )}
                </div>
              );
            })}
          </div>
          <p className="sm:hidden mt-3 text-center text-xs text-stone-500">
            Step {currentStep} of 3 · <span className="font-semibold text-stone-900">{stepTitles[currentStep - 1]}</span>
          </p>
        </div>
      )}

      {/* Main Multi-step Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Interactive Column */}
        <div className={currentStep === 4 ? 'lg:col-span-12' : 'lg:col-span-8'}>
          {/* STEP 1: Dates & Room Selection */}
          {currentStep === 1 && (
            <div className="bg-white rounded-2xl p-5 sm:p-8 border border-stone-200 shadow-sm space-y-6">
              <div>
                <span className="text-xs uppercase tracking-widest text-amber-700 font-semibold block mb-1">
                  Step 1 of 3
                </span>
                <h2 className="text-2xl font-serif text-stone-900">
                  Confirm Dates & Choose Your Room
                </h2>
                <p className="text-xs text-stone-500 mt-1">
                  Check your dates and pick the room that suits your stay.
                </p>
              </div>

              {/* Dates, guests and rooms */}
              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200/80 grid grid-cols-1 sm:grid-cols-5 gap-3 text-xs">
                <DateRangePicker
                  variant="compact"
                  checkIn={searchState.checkIn}
                  checkOut={searchState.checkOut}
                  onChange={updateSearch}
                  className="sm:col-span-2"
                />
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-stone-500 mb-1">Adults</label>
                  <Select
                    value={String(searchState.adults)}
                    onChange={(v) => updateSearch({ adults: Number(v) })}
                    options={[1, 2, 3, 4, 5, 6, 7, 8].map((n) => ({ value: String(n), label: String(n) }))}
                    className="text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-stone-500 mb-1">Children</label>
                  <Select
                    value={String(searchState.children)}
                    onChange={(v) => updateSearch({ children: Number(v) })}
                    options={[0, 1, 2, 3, 4, 5, 6].map((n) => ({ value: String(n), label: String(n) }))}
                    className="text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-stone-500 mb-1">Rooms</label>
                  <Select
                    value={String(searchState.roomsCount)}
                    onChange={(v) => updateSearch({ roomsCount: Number(v) })}
                    options={[1, 2, 3, 4].map((n) => ({ value: String(n), label: String(n) }))}
                    className="text-xs"
                  />
                </div>
              </div>

              {/* Room type selection */}
              <div className="space-y-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-stone-800">
                  Select Your Room:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {ROOMS.map((r) => {
                    const isSelected = r.id === currentRoom.id;
                    const left = availability?.[r.apiTypeId];
                    const soldOut = left === 0;
                    return (
                      <button
                        type="button"
                        key={r.id}
                        onClick={() => !soldOut && selectRoom(r)}
                        disabled={soldOut}
                        className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between ${
                          soldOut
                            ? 'border-stone-200 bg-stone-50 opacity-60 cursor-not-allowed'
                            : isSelected
                            ? 'border-amber-400 bg-amber-50/40 ring-2 ring-amber-300/40 shadow-sm cursor-pointer'
                            : 'border-stone-200 hover:border-stone-300 bg-white cursor-pointer'
                        }`}
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[10px] font-mono text-amber-800 uppercase">
                              {r.category}
                            </span>
                            {isSelected && !soldOut && (
                              <span className="text-[10px] bg-amber-300 text-stone-950 px-2 py-0.5 rounded font-bold">
                                Selected
                              </span>
                            )}
                          </div>
                          <h4 className="font-serif text-base font-semibold text-stone-900">
                            {r.name}
                          </h4>
                          <p className="text-xs text-stone-500">
                            {r.bedConfiguration} · Up to {r.maxAdults} guests
                          </p>
                          <p className={`text-[11px] font-medium ${soldOut ? 'text-rose-700' : left !== undefined && left <= 3 ? 'text-amber-800' : 'text-emerald-700'}`}>
                            {left === undefined ? 'Checking availability…' : soldOut ? 'Sold out for these dates' : left <= 3 ? `Only ${left} left` : 'Available'}
                          </p>
                        </div>
                        <div className="pt-3 mt-3 border-t border-stone-100 flex items-baseline justify-between text-xs">
                          <span className="text-stone-500">Per night</span>
                          <span className="font-serif text-base font-bold text-stone-900 tabular-nums">
                            {peso(r.pricePerNight)}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {stayProblem && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900 flex items-start gap-2">
                  <Info className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{stayProblem}</span>
                </div>
              )}

              {/* Continue button */}
              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => goTo(2)}
                  disabled={Boolean(stayProblem)}
                  className="w-full sm:w-auto justify-center px-6 py-3 text-xs uppercase tracking-wider font-semibold bg-stone-900 hover:bg-stone-800 text-white rounded-lg transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <span>Continue<span className="hidden min-[400px]:inline"> to Guest Details</span></span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Guest Details Form */}
          {currentStep === 2 && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!guestProblem) goTo(3);
              }}
              className="bg-white rounded-2xl p-5 sm:p-8 border border-stone-200 shadow-sm space-y-6"
            >
              <div>
                <span className="text-xs uppercase tracking-widest text-amber-700 font-semibold block mb-1">
                  Step 2 of 3
                </span>
                <h2 className="text-2xl font-serif text-stone-900">
                  Guest Information
                </h2>
                <p className="text-xs text-stone-500 mt-1">
                  Tell us who is staying. Our front desk will use these details to confirm your booking.
                </p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-stone-700 mb-1">First Name</label>
                    <input
                      type="text"
                      required
                      autoComplete="given-name"
                      value={guestForm.firstName}
                      onChange={(e) => setGuestForm({ ...guestForm, firstName: e.target.value })}
                      placeholder="Juan"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-stone-700 mb-1">Last Name</label>
                    <input
                      type="text"
                      required
                      autoComplete="family-name"
                      value={guestForm.lastName}
                      onChange={(e) => setGuestForm({ ...guestForm, lastName: e.target.value })}
                      placeholder="Dela Cruz"
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-stone-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      autoComplete="email"
                      value={guestForm.email}
                      onChange={(e) => setGuestForm({ ...guestForm, email: e.target.value })}
                      placeholder="juan@example.com"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-stone-700 mb-1">Mobile Number</label>
                    <input
                      type="tel"
                      required
                      autoComplete="tel"
                      value={guestForm.phone}
                      onChange={(e) => setGuestForm({ ...guestForm, phone: e.target.value })}
                      placeholder="+63 917 123 4567"
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-stone-700 mb-1">Country / Region of Residence</label>
                    <input
                      type="text"
                      autoComplete="country-name"
                      value={guestForm.country}
                      onChange={(e) => setGuestForm({ ...guestForm, country: e.target.value })}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-stone-700 mb-1">Estimated Arrival Time</label>
                    <Select
                      value={guestForm.estimatedArrival}
                      onChange={(v) => setGuestForm({ ...guestForm, estimatedArrival: v })}
                      options={[
                        { value: HOTEL_INFO.checkInTime, label: `${HOTEL_INFO.checkInTime} (Standard Check-in)` },
                        { value: '16:00 – 18:00', label: '16:00 – 18:00' },
                        { value: '19:00 – 21:00', label: '19:00 – 21:00' },
                        { value: 'After 21:00', label: 'Late Evening (After 21:00)' },
                        { value: `Early arrival (before ${HOTEL_INFO.checkInTime})`, label: `Early Arrival Request (Before ${HOTEL_INFO.checkInTime})` },
                      ]}
                      className="text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-stone-700 mb-1">
                    Special Requests (optional)
                  </label>
                  <textarea
                    rows={3}
                    value={guestForm.specialRequests}
                    onChange={(e) => setGuestForm({ ...guestForm, specialRequests: e.target.value })}
                    placeholder="e.g. Early check-in, airport pickup, extra pillows, a room on a higher floor..."
                    className={inputClass}
                  />
                </div>

                {/* Honeypot: off-screen and skipped by keyboard and screen readers, so only bots fill it in. */}
                <div aria-hidden="true" className="absolute -left-[9999px] w-px h-px overflow-hidden">
                  <label>
                    Website
                    <input
                      type="text"
                      tabIndex={-1}
                      autoComplete="off"
                      value={guestForm.website}
                      onChange={(e) => setGuestForm({ ...guestForm, website: e.target.value })}
                    />
                  </label>
                </div>
              </div>

              {/* Navigation buttons */}
              <div className="pt-4 flex items-center justify-between border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => goTo(1)}
                  className="px-4 py-2 text-xs text-stone-600 hover:text-stone-900 flex items-center gap-1.5 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 text-xs uppercase tracking-wider font-semibold bg-stone-900 hover:bg-stone-800 text-white rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <span>Continue<span className="hidden min-[400px]:inline"> to Review</span></span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: Review & Confirm */}
          {currentStep === 3 && (
            <div className="bg-white rounded-2xl p-5 sm:p-8 border border-stone-200 shadow-sm space-y-6">
              <div>
                <span className="text-xs uppercase tracking-widest text-amber-700 font-semibold block mb-1">
                  Step 3 of 3
                </span>
                <h2 className="text-2xl font-serif text-stone-900">
                  Review & Confirm
                </h2>
              </div>

              {/* Pay at hotel */}
              <div className="p-4 bg-amber-50 border border-amber-200/80 rounded-xl text-xs text-amber-950 flex items-start gap-3">
                <Wallet className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-semibold">Pay at the hotel, no payment needed now</p>
                  <p className="text-amber-900/90 leading-relaxed">
                    You will pay at the front desk during your stay (cash, card, GCash, or bank transfer). After you confirm, our front
                    desk will contact you to confirm your booking.
                  </p>
                </div>
              </div>

              {/* Summary of who and when */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-stone-700">
                <div className="p-4 bg-stone-50 rounded-xl border border-stone-200/80 space-y-1.5">
                  <p className="font-semibold text-stone-900 font-serif text-sm">Your Stay</p>
                  <p>{currentRoom.name} × {searchState.roomsCount}</p>
                  <p>{searchState.checkIn} → {searchState.checkOut} ({nightsCount} {nightsCount === 1 ? 'night' : 'nights'})</p>
                  <p>{searchState.adults} {searchState.adults === 1 ? 'adult' : 'adults'}{searchState.children > 0 ? `, ${searchState.children} ${searchState.children === 1 ? 'child' : 'children'}` : ''}</p>
                  <p>Check-in from {HOTEL_INFO.checkInTime} · Check-out until {HOTEL_INFO.checkOutTime}</p>
                </div>
                <div className="p-4 bg-stone-50 rounded-xl border border-stone-200/80 space-y-1.5">
                  <p className="font-semibold text-stone-900 font-serif text-sm">Guest</p>
                  <p>{guestForm.firstName} {guestForm.lastName}</p>
                  <p className="break-all">{guestForm.email}</p>
                  <p>{guestForm.phone}</p>
                  {guestForm.specialRequests && <p className="italic text-stone-500">"{guestForm.specialRequests}"</p>}
                </div>
              </div>

              {/* Terms Checkbox */}
              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200/60 text-xs text-stone-600">
                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={acceptedTerms}
                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                    className="mt-0.5 accent-amber-600"
                  />
                  <span>
                    I accept The K Grand Hotel{' '}
                    <button type="button" onClick={() => navigateTo('terms')} className="underline underline-offset-2 hover:text-amber-800">
                      terms of stay
                    </button>{' '}
                    (free cancellation up to 48 hours before check-in) and{' '}
                    <button type="button" onClick={() => navigateTo('privacy')} className="underline underline-offset-2 hover:text-amber-800">
                      privacy policy
                    </button>
                    .
                  </span>
                </label>
              </div>

              {errorBox}

              {/* Complete Booking CTA Button */}
              <div className="pt-4 flex items-center justify-between border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => goTo(2)}
                  disabled={submitting}
                  className="px-4 py-2 text-xs text-stone-600 hover:text-stone-900 flex items-center gap-1.5 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={handleConfirmReservation}
                  disabled={!acceptedTerms || submitting}
                  className="px-5 sm:px-8 py-3.5 text-xs uppercase tracking-widest font-semibold bg-amber-300 hover:bg-amber-200 text-stone-950 rounded-lg transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                  <span>{submitting ? 'Sending…' : <>Confirm<span className="hidden min-[400px]:inline"> Booking</span></>}</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Booking received */}
          {currentStep === 4 && confirmed && (
            <div className="bg-white rounded-2xl p-6 sm:p-10 border border-stone-200 shadow-xl space-y-8 animate-in fade-in">
              <div className="text-center space-y-3 pb-6 border-b border-stone-100">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto shadow-xs">
                  <Check className="w-7 h-7" />
                </div>
                <span className="text-xs uppercase tracking-widest text-emerald-700 font-semibold block">
                  Booking Received
                </span>
                <h2 className="text-3xl sm:text-4xl font-serif text-stone-900">
                  Thank You, {guestForm.firstName}!
                </h2>
                <p className="text-xs sm:text-sm text-stone-600 max-w-lg mx-auto leading-relaxed">
                  Your booking {confirmed.codes.length > 1 ? 'references are' : 'reference is'}{' '}
                  {confirmed.codes.map((code) => (
                    <span key={code} className="inline-block font-mono font-bold text-stone-900 text-sm px-2 py-0.5 mx-0.5 bg-stone-100 rounded border border-stone-200">
                      {code}
                    </span>
                  ))}
                  . Our front desk will contact you at {guestForm.phone} or {guestForm.email} to confirm your booking.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs text-stone-700">
                <div className="space-y-2 p-5 bg-stone-50 rounded-xl border border-stone-200/80">
                  <h3 className="font-serif text-base font-semibold text-stone-900 mb-2">Stay Details</h3>
                  <div className="flex justify-between gap-4"><span className="text-stone-500">Room:</span><span className="font-semibold text-stone-900 text-right">{confirmed.roomType} × {confirmed.rooms}</span></div>
                  <div className="flex justify-between gap-4"><span className="text-stone-500">Dates:</span><span className="font-semibold text-stone-900 text-right">{confirmed.checkIn} to {confirmed.checkOut} ({confirmed.nights} {confirmed.nights === 1 ? 'night' : 'nights'})</span></div>
                  <div className="flex justify-between gap-4"><span className="text-stone-500">Guests:</span><span className="font-semibold text-stone-900 text-right">{confirmed.adults} Adults{confirmed.children > 0 ? `, ${confirmed.children} Children` : ''}</span></div>
                  <div className="flex justify-between gap-4"><span className="text-stone-500">Check-in:</span><span className="font-semibold text-stone-900 text-right">From {HOTEL_INFO.checkInTime}</span></div>
                  <div className="flex justify-between gap-4"><span className="text-stone-500">Status:</span><span className="font-semibold text-amber-800 text-right">Awaiting front desk confirmation</span></div>
                </div>

                <div className="space-y-2 p-5 bg-stone-50 rounded-xl border border-stone-200/80">
                  <h3 className="font-serif text-base font-semibold text-stone-900 mb-2">Payment</h3>
                  <div className="flex justify-between gap-4"><span className="text-stone-500">Rate:</span><span className="tabular-nums font-semibold text-stone-900">{peso(confirmed.rate)} / night / room</span></div>
                  <div className="pt-2 border-t border-stone-200 flex justify-between text-sm">
                    <span className="font-semibold text-stone-900">Total to Pay at Hotel:</span>
                    <span className="font-bold font-serif text-stone-950 text-base tabular-nums">{peso(confirmed.total)}</span>
                  </div>
                  <div className="mt-3 pt-3 border-t border-stone-200 space-y-2">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-stone-500">Questions About Your Booking?</p>
                    <a
                      href={HOTEL_INFO.phoneHref}
                      className="flex items-center gap-2.5 p-2.5 rounded-lg bg-white border border-stone-200 hover:border-amber-400 transition-colors"
                    >
                      <Phone className="w-4 h-4 text-amber-700 shrink-0" />
                      <span className="font-semibold text-stone-900">{HOTEL_INFO.phone}</span>
                    </a>
                    <a
                      href={`mailto:${HOTEL_INFO.reservationsEmail}?subject=${encodeURIComponent(`Booking ${confirmed.codes.join(', ')}`)}`}
                      className="flex items-center gap-2.5 p-2.5 rounded-lg bg-white border border-stone-200 hover:border-amber-400 transition-colors"
                    >
                      <Mail className="w-4 h-4 text-amber-700 shrink-0" />
                      <span className="font-semibold text-stone-900 break-all">{HOTEL_INFO.reservationsEmail}</span>
                    </a>
                    <p className="text-[11px] text-stone-500">Please mention your booking reference when you contact us.</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-stone-100">
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 px-4 py-2 border border-stone-200 rounded-lg text-xs font-medium text-stone-700 hover:bg-stone-50 transition-colors"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Summary</span>
                </button>
                <button
                  onClick={() => navigateTo('home')}
                  className="px-5 py-2.5 text-xs font-semibold bg-amber-300 hover:bg-amber-200 text-stone-950 rounded-lg transition-colors"
                >
                  Return to Homepage
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Sticky Sidebar: Summary (steps 1-3) */}
        {currentStep < 4 && (
          <div className="lg:col-span-4 lg:sticky lg:top-24">
            <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-md space-y-5">
              <h3 className="font-serif text-lg text-stone-900 pb-3 border-b border-stone-100">
                Reservation Summary
              </h3>

              {/* Room preview */}
              <div className="flex gap-3">
                <img
                  src={currentRoom.images[0]}
                  alt={currentRoom.name}
                  referrerPolicy="no-referrer"
                  className="w-20 h-16 object-cover rounded-lg shrink-0"
                />
                <div className="text-xs">
                  <span className="text-[10px] uppercase font-mono text-amber-800">{currentRoom.category}</span>
                  <p className="font-serif font-semibold text-stone-900 leading-snug">{currentRoom.name}</p>
                  <p className="text-stone-500 mt-0.5">{currentRoom.bedConfiguration}</p>
                </div>
              </div>

              {/* Stay timeline */}
              <div className="space-y-2 py-3 border-y border-stone-100 text-xs text-stone-600">
                <div className="flex justify-between">
                  <span>Dates:</span>
                  <span className="font-semibold text-stone-900">{searchState.checkIn} → {searchState.checkOut}</span>
                </div>
                <div className="flex justify-between">
                  <span>Duration:</span>
                  <span className="font-semibold text-stone-900">{nightsCount} {nightsCount === 1 ? 'night' : 'nights'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Guests:</span>
                  <span className="font-semibold text-stone-900">{searchState.adults} Adults{searchState.children > 0 ? `, ${searchState.children} Children` : ''}</span>
                </div>
                <div className="flex justify-between">
                  <span>Rooms:</span>
                  <span className="font-semibold text-stone-900">{searchState.roomsCount}</span>
                </div>
              </div>

              {/* Pricing */}
              <div className="space-y-2 text-xs text-stone-600">
                <div className="flex justify-between gap-3">
                  <span>{peso(currentRoom.pricePerNight)} × {nightsCount} {nightsCount === 1 ? 'night' : 'nights'}{searchState.roomsCount > 1 ? ` × ${searchState.roomsCount} rooms` : ''}</span>
                  <span className="font-semibold text-stone-900 tabular-nums">{peso(totalDue)}</span>
                </div>
                <div className="pt-2 border-t border-stone-200 flex justify-between text-sm">
                  <span className="font-semibold text-stone-900">Total:</span>
                  <span className="font-serif font-bold text-stone-950 text-base tabular-nums">{peso(totalDue)}</span>
                </div>
              </div>

              <div className="p-3 bg-stone-50 rounded-lg text-[11px] text-stone-500 border border-stone-200/60 leading-relaxed">
                <p className="font-semibold text-stone-800 mb-0.5">Pay at the Hotel</p>
                No payment is needed to book. You will pay at the front desk during your stay.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
