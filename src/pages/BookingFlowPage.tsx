import React, { useState } from 'react';
import { DateRangePicker } from '../components/DateRangePicker';
import { useHotel, BookingRecord, GuestInfo } from '../context/HotelContext';
import { ROOMS, Room, BOOKING_ADDONS, BookingAddOn, SPECIAL_OFFERS, SpecialOffer, HOTEL_INFO } from '../data/hotelData';
import {
  Calendar,
  Users,
  Check,
  CreditCard,
  ShieldCheck,
  ArrowRight,
  ChevronLeft,
  Sparkles,
  Info,
  Clock,
  Printer,
  Download,
  CalendarPlus,
  Share2
} from 'lucide-react';
import { Select } from '../components/Select';

export const BookingFlowPage: React.FC = () => {
  const {
    selectedRoom,
    selectRoom,
    searchState,
    updateSearch,
    user,
    completeNewBooking,
    navigateTo,
    showNotification
  } = useHotel();

  const currentRoom = selectedRoom || ROOMS[0];

  // Steps: 1: Stay & Room, 2: Add-ons & Offers, 3: Guest Details, 4: Payment Preview, 5: Confirmation
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [selectedAddonIds, setSelectedAddonIds] = useState<string[]>([]);
  const [promoCodeInput, setPromoCodeInput] = useState<string>('');
  const [appliedPromo, setAppliedPromo] = useState<SpecialOffer | null>(null);
  const [promoError, setPromoError] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'pay_at_hotel' | 'apple_pay'>('card');
  const [confirmedRecord, setConfirmedRecord] = useState<BookingRecord | null>(null);

  // Guest details form state
  const [guestForm, setGuestForm] = useState<GuestInfo>({
    title: user.isLoggedIn ? user.title : 'Mr.',
    firstName: user.isLoggedIn ? user.firstName : '',
    lastName: user.isLoggedIn ? user.lastName : '',
    email: user.isLoggedIn ? user.email : '',
    phone: user.isLoggedIn ? user.phone : '',
    country: user.isLoggedIn ? user.country : 'Philippines',
    specialRequests: user.isLoggedIn && user.preferences.specialOccasion ? `Celebrating ${user.preferences.specialOccasion}.` : '',
    estimatedArrival: '15:00',
  });

  // Calculate nights
  const checkInDate = new Date(searchState.checkIn);
  const checkOutDate = new Date(searchState.checkOut);
  const diffTime = Math.max(1, checkOutDate.getTime() - checkInDate.getTime());
  const nightsCount = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  // Calculations
  const roomRatePerNight = appliedPromo
    ? Math.round(currentRoom.pricePerNight * (1 - appliedPromo.discountPercentage / 100))
    : currentRoom.pricePerNight;

  const roomSubtotal = roomRatePerNight * nightsCount * searchState.roomsCount;

  // Add-ons subtotal
  const selectedAddons = BOOKING_ADDONS.filter((a) => selectedAddonIds.includes(a.id));
  const addonsSubtotal = selectedAddons.reduce((sum, item) => {
    let price = item.price;
    if (item.perPerson) {
      price = price * (searchState.adults + searchState.children);
    }
    return sum + price;
  }, 0);

  const subtotalBeforeTax = roomSubtotal + addonsSubtotal;
  const taxes = Math.round(subtotalBeforeTax * 0.10);
  const serviceCharge = Math.round(subtotalBeforeTax * 0.05);
  const totalDue = subtotalBeforeTax + taxes + serviceCharge;

  const toggleAddon = (id: string) => {
    setSelectedAddonIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError('');
    const code = promoCodeInput.trim().toUpperCase();
    const foundOffer = SPECIAL_OFFERS.find((o) => o.promoCode.toUpperCase() === code);
    if (foundOffer) {
      setAppliedPromo(foundOffer);
      showNotification(`Offer applied: ${foundOffer.discountPercentage}% discount on your room rate!`);
    } else {
      setPromoError('Invalid promotion code. Please check the code and try again.');
    }
  };

  const handleConfirmReservation = () => {
    const randomRefNum = Math.floor(1000 + Math.random() * 9000);
    const newRef = `KGH-${randomRefNum}`;

    const record: BookingRecord = {
      reference: newRef,
      room: currentRoom,
      checkIn: searchState.checkIn,
      checkOut: searchState.checkOut,
      nights: nightsCount,
      adults: searchState.adults,
      children: searchState.children,
      roomsCount: searchState.roomsCount,
      guestInfo: guestForm,
      addons: selectedAddons,
      appliedOffer: appliedPromo,
      baseAmount: roomSubtotal + addonsSubtotal,
      taxAmount: taxes,
      serviceCharge: serviceCharge,
      totalAmount: totalDue,
      status: 'Confirmed',
      createdAt: new Date().toISOString().split('T')[0],
      paymentMethod:
        paymentMethod === 'card'
          ? 'Credit Card (ending in 8842)'
          : paymentMethod === 'apple_pay'
          ? 'Apple Pay (Verified)'
          : 'Pay on Arrival at the Front Desk'
    };

    setConfirmedRecord(record);
    completeNewBooking(record);
    setCurrentStep(5);
  };

  const stepTitles = [
    'Stay & Room',
    'Add-Ons',
    'Guest Details',
    'Payment Preview',
    'Confirmation'
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Step Tracker Indicator */}
      {currentStep < 5 && (
        <div className="bg-white rounded-xl p-4 sm:p-5 border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between max-w-3xl mx-auto">
            {stepTitles.slice(0, 4).map((title, idx) => {
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
                  {idx < 3 && (
                    <div className="w-8 sm:w-16 h-0.5 bg-stone-200 hidden md:block mx-1" />
                  )}
                </div>
              );
            })}
          </div>
          <p className="sm:hidden mt-3 text-center text-xs text-stone-500">
            Step {currentStep} of 4 · <span className="font-semibold text-stone-900">{stepTitles[currentStep - 1]}</span>
          </p>
        </div>
      )}

      {/* Main Multi-step Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Interactive Column */}
        <div className={currentStep === 5 ? 'lg:col-span-12' : 'lg:col-span-8'}>
          {/* STEP 1: Dates & Room Selection */}
          {currentStep === 1 && (
            <div className="bg-white rounded-2xl p-5 sm:p-8 border border-stone-200 shadow-sm space-y-6">
              <div>
                <span className="text-xs uppercase tracking-widest text-amber-700 font-semibold block mb-1">
                  Step 1 of 4
                </span>
                <h2 className="text-2xl font-serif text-stone-900">
                  Confirm Dates & Choose Your Room
                </h2>
                <p className="text-xs text-stone-500 mt-1">
                  Check your dates and pick the room that suits your stay.
                </p>
              </div>

              {/* Date & Guest modification strip */}
              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200/80 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <DateRangePicker
                  variant="compact"
                  checkIn={searchState.checkIn}
                  checkOut={searchState.checkOut}
                  onChange={updateSearch}
                  className="sm:col-span-2"
                />
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-stone-500">Guests & Rooms</label>
                  <p className="font-semibold text-stone-900 mt-1">
                    {searchState.adults} Adults · {searchState.roomsCount} {searchState.roomsCount > 1 ? 'Rooms' : 'Room'}
                  </p>
                </div>
              </div>

              {/* Room Card Selection Carousel / List */}
              <div className="space-y-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-stone-800">
                  Select Room or Upgrade:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {ROOMS.map((r) => {
                    const isSelected = r.id === currentRoom.id;
                    return (
                      <div
                        key={r.id}
                        onClick={() => selectRoom(r)}
                        className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? 'border-amber-400 bg-amber-50/40 ring-2 ring-amber-300/40 shadow-sm'
                            : 'border-stone-200 hover:border-stone-300 bg-white'
                        }`}
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-mono text-amber-800 uppercase">
                              {r.category}
                            </span>
                            {isSelected && (
                              <span className="text-[10px] bg-amber-300 text-stone-950 px-2 py-0.5 rounded font-bold">
                                Selected
                              </span>
                            )}
                          </div>
                          <h4 className="font-serif text-base font-semibold text-stone-900">
                            {r.name}
                          </h4>
                          <p className="text-xs text-stone-500">
                            {r.sizeSqM} m² · {r.bedConfiguration}
                          </p>
                        </div>
                        <div className="pt-3 mt-3 border-t border-stone-100 flex items-baseline justify-between text-xs">
                          <span className="text-stone-500">Nightly Rate</span>
                          <span className="font-serif text-base font-bold text-stone-900 tabular-nums">
                            ₱{r.pricePerNight.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Continue button */}
              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="w-full sm:w-auto justify-center px-6 py-3 text-xs uppercase tracking-wider font-semibold bg-stone-900 hover:bg-stone-800 text-white rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <span>Continue<span className="hidden min-[400px]:inline"> to Add-Ons</span></span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Add-ons & Promotional Offers */}
          {currentStep === 2 && (
            <div className="bg-white rounded-2xl p-5 sm:p-8 border border-stone-200 shadow-sm space-y-6">
              <div>
                <span className="text-xs uppercase tracking-widest text-amber-700 font-semibold block mb-1">
                  Step 2 of 4
                </span>
                <h2 className="text-2xl font-serif text-stone-900">
                  Add-Ons & Promo Code
                </h2>
                <p className="text-xs text-stone-500 mt-1">
                  Add extras to make your stay easier. All add-ons are optional.
                </p>
              </div>

              {/* Addons List */}
              <div className="space-y-3">
                {BOOKING_ADDONS.map((addon) => {
                  const isChecked = selectedAddonIds.includes(addon.id);
                  return (
                    <div
                      key={addon.id}
                      onClick={() => toggleAddon(addon.id)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-4 ${
                        isChecked
                          ? 'border-amber-400 bg-amber-50/30'
                          : 'border-stone-200 hover:border-stone-300 bg-white'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-5 h-5 rounded border mt-0.5 flex items-center justify-center transition-colors ${
                            isChecked ? 'bg-amber-400 border-amber-500 text-stone-950' : 'border-stone-300'
                          }`}
                        >
                          {isChecked && <Check className="w-3.5 h-3.5" />}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-stone-900">{addon.name}</p>
                          <p className="text-xs text-stone-500 mt-0.5 leading-relaxed">
                            {addon.description}
                          </p>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-sm font-serif font-bold text-stone-900 tabular-nums">
                          +₱{addon.price.toLocaleString()}
                        </span>
                        <span className="block text-[10px] text-stone-400">
                          {addon.perPerson ? 'per person' : 'per stay'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Promotional code input */}
              <div className="pt-4 border-t border-stone-100">
                <form onSubmit={handleApplyPromo} className="space-y-2">
                  <label className="block text-xs font-semibold text-stone-700">
                    Have a Promo Code?
                  </label>
                  <div className="flex gap-2 max-w-md">
                    <input
                      type="text"
                      placeholder="Enter promo code"
                      value={promoCodeInput}
                      onChange={(e) => setPromoCodeInput(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs uppercase font-mono tracking-wider focus:outline-none focus:border-amber-500"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-semibold uppercase tracking-wider shrink-0 transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                  {appliedPromo && (
                    <p className="text-xs text-emerald-700 font-medium">
                      Applied: {appliedPromo.title} (-{appliedPromo.discountPercentage}%)
                    </p>
                  )}
                  {promoError && (
                    <p className="text-xs text-rose-600">{promoError}</p>
                  )}
                </form>
              </div>

              {/* Navigation buttons */}
              <div className="pt-4 flex items-center justify-between border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="px-4 py-2 text-xs text-stone-600 hover:text-stone-900 flex items-center gap-1.5 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="px-6 py-3 text-xs uppercase tracking-wider font-semibold bg-stone-900 hover:bg-stone-800 text-white rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <span>Continue<span className="hidden min-[400px]:inline"> to Guest Details</span></span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Guest Details Form */}
          {currentStep === 3 && (
            <div className="bg-white rounded-2xl p-5 sm:p-8 border border-stone-200 shadow-sm space-y-6">
              <div>
                <span className="text-xs uppercase tracking-widest text-amber-700 font-semibold block mb-1">
                  Step 3 of 4
                </span>
                <h2 className="text-2xl font-serif text-stone-900">
                  Guest Information
                </h2>
                <p className="text-xs text-stone-500 mt-1">
                  Tell us who is staying so we can prepare your room.
                </p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-stone-700 mb-1">Title</label>
                    <Select
                      value={String(guestForm.title)}
                      onChange={(v) => setGuestForm({ ...guestForm, title: v })}
                      options={[
                        { value: "Mr.", label: "Mr." },
                        { value: "Ms.", label: "Ms." },
                        { value: "Mrs.", label: "Mrs." },
                        { value: "Dr.", label: "Dr." },
                      ]}
                      className="text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-stone-700 mb-1">First Name</label>
                    <input
                      type="text"
                      required
                      value={guestForm.firstName}
                      onChange={(e) => setGuestForm({ ...guestForm, firstName: e.target.value })}
                      className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2.5 text-xs text-stone-900 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-stone-700 mb-1">Last Name</label>
                    <input
                      type="text"
                      required
                      value={guestForm.lastName}
                      onChange={(e) => setGuestForm({ ...guestForm, lastName: e.target.value })}
                      className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2.5 text-xs text-stone-900 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-stone-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={guestForm.email}
                      onChange={(e) => setGuestForm({ ...guestForm, email: e.target.value })}
                      className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2.5 text-xs text-stone-900 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-stone-700 mb-1">Telephone Number</label>
                    <input
                      type="tel"
                      required
                      value={guestForm.phone}
                      onChange={(e) => setGuestForm({ ...guestForm, phone: e.target.value })}
                      className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2.5 text-xs text-stone-900 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-stone-700 mb-1">Country / Region of Residence</label>
                    <input
                      type="text"
                      value={guestForm.country}
                      onChange={(e) => setGuestForm({ ...guestForm, country: e.target.value })}
                      className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2.5 text-xs text-stone-900 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-stone-700 mb-1">Estimated Arrival Time</label>
                    <Select
                      value={String(guestForm.estimatedArrival)}
                      onChange={(v) => setGuestForm({ ...guestForm, estimatedArrival: v })}
                      options={[
                        { value: "15:00", label: "15:00 (Standard Check-in)" },
                        { value: "16:00", label: "16:00 – 18:00" },
                        { value: "19:00", label: "19:00 – 21:00" },
                        { value: "Late", label: "Late Evening (After 21:00)" },
                        { value: "Early", label: "Early Arrival Request (Before 14:00)" },
                      ]}
                      className="text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-stone-700 mb-1">
                    Special Requests
                  </label>
                  <textarea
                    rows={3}
                    value={guestForm.specialRequests}
                    onChange={(e) => setGuestForm({ ...guestForm, specialRequests: e.target.value })}
                    placeholder="e.g. Early arrival, extra pillows, a room on a higher floor..."
                    className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2.5 text-xs text-stone-900 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Navigation buttons */}
              <div className="pt-4 flex items-center justify-between border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="px-4 py-2 text-xs text-stone-600 hover:text-stone-900 flex items-center gap-1.5 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(4)}
                  className="px-6 py-3 text-xs uppercase tracking-wider font-semibold bg-stone-900 hover:bg-stone-800 text-white rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <span>Continue<span className="hidden min-[400px]:inline"> to Payment Preview</span></span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Payment Preview Screen */}
          {currentStep === 4 && (
            <div className="bg-white rounded-2xl p-5 sm:p-8 border border-stone-200 shadow-sm space-y-6">
              <div>
                <span className="text-xs uppercase tracking-widest text-amber-700 font-semibold block mb-1">
                  Step 4 of 4
                </span>
                <h2 className="text-2xl font-serif text-stone-900">
                  Payment Method Preview
                </h2>
                <div className="mt-2 p-3 bg-amber-50 border border-amber-200/80 rounded-lg text-xs text-amber-900 flex items-start gap-2">
                  <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold">Interactive Prototype Preview:</span> No real financial transaction will occur. This step demonstrates the guest checkout preview.
                  </div>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="space-y-3">
                <label className="block text-xs font-semibold text-stone-800">
                  Select Guarantee / Payment Method:
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      paymentMethod === 'card'
                        ? 'border-amber-400 bg-amber-50/40 ring-2 ring-amber-300/40'
                        : 'border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <CreditCard className="w-5 h-5 text-amber-800 mb-2" />
                    <p className="text-xs font-semibold text-stone-900">Credit / Debit Card</p>
                    <p className="text-[10px] text-stone-500 mt-0.5">Visa, Mastercard, Amex</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('apple_pay')}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      paymentMethod === 'apple_pay'
                        ? 'border-amber-400 bg-amber-50/40 ring-2 ring-amber-300/40'
                        : 'border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <Sparkles className="w-5 h-5 text-stone-800 mb-2" />
                    <p className="text-xs font-semibold text-stone-900">Apple Pay / G-Pay</p>
                    <p className="text-[10px] text-stone-500 mt-0.5">Instant 1-Click Guarantee</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('pay_at_hotel')}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      paymentMethod === 'pay_at_hotel'
                        ? 'border-amber-400 bg-amber-50/40 ring-2 ring-amber-300/40'
                        : 'border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <Clock className="w-5 h-5 text-amber-800 mb-2" />
                    <p className="text-xs font-semibold text-stone-900">Pay on Arrival</p>
                    <p className="text-[10px] text-stone-500 mt-0.5">Settle during check-out</p>
                  </button>
                </div>
              </div>

              {/* Sample Card Form */}
              {paymentMethod === 'card' && (
                <div className="p-4 bg-stone-50 rounded-xl border border-stone-200/80 space-y-3 text-xs">
                  <div>
                    <label className="block text-[10px] font-medium text-stone-600 mb-1">Cardholder Name</label>
                    <input
                      type="text"
                      readOnly
                      value={`${guestForm.title} ${guestForm.firstName} ${guestForm.lastName}`}
                      className="w-full bg-white border border-stone-200 rounded p-2 text-stone-800"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-medium text-stone-600 mb-1">Card Number (Mock)</label>
                      <input
                        type="text"
                        readOnly
                        value="•••• •••• •••• 8842"
                        className="w-full bg-white border border-stone-200 rounded p-2 text-stone-800 font-mono"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-1.5">
                      <div>
                        <label className="block text-[10px] font-medium text-stone-600 mb-1">Expiry</label>
                        <input
                          type="text"
                          readOnly
                          value="11/29"
                          className="w-full bg-white border border-stone-200 rounded p-2 text-stone-800 font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-medium text-stone-600 mb-1">CVC</label>
                        <input
                          type="text"
                          readOnly
                          value="•••"
                          className="w-full bg-white border border-stone-200 rounded p-2 text-stone-800 font-mono"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Terms Checkbox */}
              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200/60 text-xs text-stone-600 space-y-2">
                <label className="flex items-start gap-2 cursor-pointer">
                  <input type="checkbox" defaultChecked className="mt-0.5 accent-amber-600" />
                  <span>
                    I accept The K Grand Hotel cancellation terms (Complimentary cancellation up to 48 hours before check-in) and privacy policy.
                  </span>
                </label>
              </div>

              {/* Complete Booking CTA Button */}
              <div className="pt-4 flex items-center justify-between border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="px-4 py-2 text-xs text-stone-600 hover:text-stone-900 flex items-center gap-1.5 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={handleConfirmReservation}
                  className="px-5 sm:px-8 py-3.5 text-xs uppercase tracking-widest font-semibold bg-amber-300 hover:bg-amber-200 text-stone-950 rounded-lg transition-all shadow-md flex items-center gap-2 cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Confirm<span className="hidden min-[400px]:inline"> Reservation (Preview)</span></span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: Final Confirmed Reservation Screen */}
          {currentStep === 5 && confirmedRecord && (
            <div className="bg-white rounded-2xl p-6 sm:p-10 border border-stone-200 shadow-xl space-y-8 animate-in fade-in">
              {/* Confirmed Header */}
              <div className="text-center space-y-3 pb-6 border-b border-stone-100">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto shadow-xs">
                  <Check className="w-7 h-7" />
                </div>
                <span className="text-xs uppercase tracking-widest text-emerald-700 font-semibold block">
                  Reservation Confirmed
                </span>
                <h2 className="text-3xl sm:text-4xl font-serif text-stone-900">
                  We Look Forward to Welcoming You
                </h2>
                <p className="text-xs sm:text-sm text-stone-600 max-w-lg mx-auto">
                  Your reservation reference is{' '}
                  <span className="font-mono font-bold text-stone-900 text-sm px-2 py-0.5 bg-stone-100 rounded border border-stone-200">
                    {confirmedRecord.reference}
                  </span>
                  . A confirmation has been sent to {confirmedRecord.guestInfo.email}.
                </p>
              </div>

              {/* Confirmation Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs text-stone-700">
                {/* Stay Summary */}
                <div className="space-y-4 p-5 bg-stone-50 rounded-xl border border-stone-200/80">
                  <h3 className="font-serif text-base font-semibold text-stone-900">
                    Stay Details
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-stone-500">Accommodation:</span>
                      <span className="font-semibold text-stone-900">{confirmedRecord.room.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500">Dates:</span>
                      <span className="font-semibold text-stone-900">
                        {confirmedRecord.checkIn} to {confirmedRecord.checkOut} ({confirmedRecord.nights} nights)
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500">Occupancy:</span>
                      <span className="font-semibold text-stone-900">
                        {confirmedRecord.adults} Adults, {confirmedRecord.children} Children ({confirmedRecord.roomsCount} {confirmedRecord.roomsCount > 1 ? 'Rooms' : 'Room'})
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500">Check-in Window:</span>
                      <span className="font-semibold text-stone-900">
                        From {HOTEL_INFO.checkInTime} ({confirmedRecord.guestInfo.estimatedArrival} estimated)
                      </span>
                    </div>
                  </div>

                  {confirmedRecord.addons.length > 0 && (
                    <div className="pt-3 border-t border-stone-200">
                      <p className="text-stone-500 font-medium mb-1">Requested Add-ons:</p>
                      <ul className="space-y-1">
                        {confirmedRecord.addons.map((a, i) => (
                          <li key={i} className="flex items-center gap-1.5 font-medium text-stone-800">
                            <Sparkles className="w-3 h-3 text-amber-600" />
                            <span>{a.name}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Billing Summary */}
                <div className="space-y-4 p-5 bg-stone-50 rounded-xl border border-stone-200/80">
                  <h3 className="font-serif text-base font-semibold text-stone-900">
                    Payment & Billing Breakdown
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-stone-500">Accommodation Subtotal:</span>
                      <span className="tabular-nums font-semibold text-stone-900">₱{roomSubtotal.toLocaleString()}</span>
                    </div>
                    {addonsSubtotal > 0 && (
                      <div className="flex justify-between">
                        <span className="text-stone-500">Add-Ons:</span>
                        <span className="tabular-nums font-semibold text-stone-900">₱{addonsSubtotal.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-stone-500">Taxes (10%):</span>
                      <span className="tabular-nums font-semibold text-stone-900">₱{confirmedRecord.taxAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500">Service Charge (5%):</span>
                      <span className="tabular-nums font-semibold text-stone-900">₱{confirmedRecord.serviceCharge.toLocaleString()}</span>
                    </div>
                    <div className="pt-2 border-t border-stone-200 flex justify-between text-sm">
                      <span className="font-semibold text-stone-900">Total Charged:</span>
                      <span className="font-bold font-serif text-stone-950 text-base tabular-nums">
                        ₱{confirmedRecord.totalAmount.toLocaleString()}
                      </span>
                    </div>
                    <div className="pt-1 text-[11px] text-stone-500 flex justify-between">
                      <span>Method:</span>
                      <span>{confirmedRecord.paymentMethod}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-stone-100">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      window.print();
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 border border-stone-200 rounded-lg text-xs font-medium text-stone-700 hover:bg-stone-50 transition-colors"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Print Summary</span>
                  </button>
                  <button
                    onClick={() => {
                      showNotification('Reservation calendar file (.ics) downloaded.');
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 border border-stone-200 rounded-lg text-xs font-medium text-stone-700 hover:bg-stone-50 transition-colors"
                  >
                    <CalendarPlus className="w-4 h-4" />
                    <span>Add to Calendar</span>
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => navigateTo('my-bookings')}
                    className="px-5 py-2.5 text-xs font-semibold bg-stone-900 hover:bg-stone-800 text-white rounded-lg transition-colors"
                  >
                    View in My Bookings
                  </button>
                  <button
                    onClick={() => navigateTo('home')}
                    className="px-5 py-2.5 text-xs font-semibold bg-amber-300 hover:bg-amber-200 text-stone-950 rounded-lg transition-colors"
                  >
                    Return to Homepage
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Sticky Sidebar: Summary (Visible in steps 1-4) */}
        {currentStep < 5 && (
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
                  <p className="text-stone-500 mt-0.5">{currentRoom.view}</p>
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
                  <span className="font-semibold text-stone-900">{nightsCount} nights</span>
                </div>
                <div className="flex justify-between">
                  <span>Guests:</span>
                  <span className="font-semibold text-stone-900">{searchState.adults} Adults {searchState.children > 0 ? `, ${searchState.children} Children` : ''}</span>
                </div>
              </div>

              {/* Pricing breakdown */}
              <div className="space-y-2 text-xs text-stone-600">
                <div className="flex justify-between">
                  <span>Room Rate ({nightsCount} nights):</span>
                  <span className="font-semibold text-stone-900 tabular-nums">₱{roomSubtotal.toLocaleString()}</span>
                </div>
                {appliedPromo && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Discount ({appliedPromo.discountPercentage}%):</span>
                    <span>Applied</span>
                  </div>
                )}
                {addonsSubtotal > 0 && (
                  <div className="flex justify-between">
                    <span>Add-Ons:</span>
                    <span className="font-semibold text-stone-900 tabular-nums">₱{addonsSubtotal.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Taxes (10%):</span>
                  <span className="tabular-nums">₱{taxes.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Service Charge (5%):</span>
                  <span className="tabular-nums">₱{serviceCharge.toLocaleString()}</span>
                </div>
                <div className="pt-2 border-t border-stone-200 flex justify-between text-sm">
                  <span className="font-semibold text-stone-900">Total Price:</span>
                  <span className="font-serif font-bold text-stone-950 text-base tabular-nums">₱{totalDue.toLocaleString()}</span>
                </div>
              </div>

              <div className="p-3 bg-stone-50 rounded-lg text-[11px] text-stone-500 border border-stone-200/60 leading-relaxed">
                <p className="font-semibold text-stone-800 mb-0.5">Best Rate Guarantee</p>
                Book directly with The K Grand Hotel for our best available rates.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
