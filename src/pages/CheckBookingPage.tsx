import React, { useState } from 'react';
import { Search, Loader2, AlertCircle, CalendarDays, BedDouble, Users, Phone, Mail } from 'lucide-react';
import { HOTEL_INFO } from '../data/hotelData';
import { lookupBooking, lastBooking, LookupResponse, LookupStatus } from '../lib/bookingApi';
import { Turnstile } from '../components/Turnstile';

const inputClass =
  'w-full bg-stone-50 border border-stone-200 rounded-lg p-2.5 text-sm text-stone-900 focus:outline-none focus:border-amber-500';

const STATUS: Record<LookupStatus, { label: string; note: string; className: string }> = {
  pending: {
    label: 'Awaiting confirmation',
    note: 'We received your booking. Our front desk will contact you to confirm it.',
    className: 'bg-amber-50 text-amber-800 border-amber-200',
  },
  confirmed: {
    label: 'Confirmed',
    note: 'Your booking is confirmed. We look forward to welcoming you.',
    className: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  },
  checked_in: {
    label: 'Checked in',
    note: 'Enjoy your stay. Our front desk is available any time.',
    className: 'bg-sky-50 text-sky-800 border-sky-200',
  },
  completed: {
    label: 'Completed',
    note: 'Thank you for staying with us.',
    className: 'bg-stone-100 text-stone-700 border-stone-200',
  },
  cancelled: {
    label: 'Cancelled',
    note: 'This booking was cancelled. Please contact us if this is unexpected.',
    className: 'bg-rose-50 text-rose-800 border-rose-200',
  },
};

/**
 * "Check my booking": a guest sees the status of a booking by its reference and the email it was booked with. The PMS answers only
 * when both match (references are sequential, so a reference alone reveals nothing) and returns only the status and stay details.
 */
export const CheckBookingPage: React.FC = () => {
  // Filled in when the guest has just booked in this tab (kept in memory only, never in browser storage).
  const [code, setCode] = useState(lastBooking.code);
  const [email, setEmail] = useState(lastBooking.email);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<LookupResponse | null>(null);

  // Bot check while the PMS asks for it. A token works once, so the widget is remounted after every attempt.
  const captchaSiteKey = HOTEL_INFO.captchaSiteKey;
  const [captchaToken, setCaptchaToken] = useState('');
  const [captchaRound, setCaptchaRound] = useState(0);
  const [captchaLoadError, setCaptchaLoadError] = useState(false);

  const canSearch = code.trim() !== '' && email.trim() !== '' && !searching && (!captchaSiteKey || captchaToken !== '');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSearch) return;
    setError('');
    setResult(null);
    setSearching(true);
    try {
      setResult(await lookupBooking({ code: code.trim(), email: email.trim(), ...(captchaSiteKey ? { captchaToken } : {}) }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setSearching(false);
      if (captchaSiteKey) {
        setCaptchaToken('');
        setCaptchaRound((n) => n + 1);
      }
    }
  };

  const status = result ? STATUS[result.status] ?? STATUS.pending : null;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12 space-y-8">
      <div className="text-center space-y-2">
        <span className="text-[10px] uppercase tracking-[0.25em] text-amber-700 font-semibold block">Your Reservation</span>
        <h1 className="text-3xl font-serif text-stone-900">Check Your Booking</h1>
        <p className="text-sm text-stone-500">Enter your booking reference and the email you booked with to see its status.</p>
      </div>

      <form onSubmit={handleSearch} className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-sm space-y-4">
        <div>
          <label htmlFor="lookup-code" className="block text-xs font-medium text-stone-700 mb-1.5">Booking Reference</label>
          <input
            id="lookup-code"
            name="bookingReference"
            type="text"
            required
            autoComplete="off"
            placeholder="e.g. KGH-1144"
            maxLength={20}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className={`${inputClass} font-mono uppercase`}
          />
        </div>
        <div>
          <label htmlFor="lookup-email" className="block text-xs font-medium text-stone-700 mb-1.5">Email Address</label>
          <input
            id="lookup-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            maxLength={200}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
          />
        </div>

        {captchaSiteKey && (
          <div className="space-y-1.5">
            <Turnstile
              key={captchaRound}
              siteKey={captchaSiteKey}
              action="lookup"
              onToken={setCaptchaToken}
              onLoadError={() => setCaptchaLoadError(true)}
            />
            {captchaLoadError && (
              <p className="text-[11px] text-rose-700">
                The security check could not load. Please check your connection and reload the page, or call us at {HOTEL_INFO.phone}.
              </p>
            )}
          </div>
        )}

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-800 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={!canSearch}
          className="w-full py-3 text-xs uppercase tracking-widest font-semibold bg-amber-300 hover:bg-amber-200 text-stone-950 rounded-lg transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {searching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
          <span>{searching ? 'Searching…' : 'Find My Booking'}</span>
        </button>
      </form>

      {result && status && (
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-sm space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="font-mono font-bold text-stone-900 text-base px-2.5 py-1 bg-stone-100 rounded border border-stone-200">{result.code}</span>
            <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${status.className}`}>{status.label}</span>
          </div>
          <p className="text-sm text-stone-600">{status.note}</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div className="flex items-start gap-2.5 p-3 bg-stone-50 rounded-lg border border-stone-200/80">
              <BedDouble className="w-4 h-4 text-amber-700 mt-0.5 shrink-0" />
              <div>
                <p className="text-[11px] text-stone-500">Room</p>
                <p className="font-semibold text-stone-900">{result.roomType}</p>
              </div>
            </div>
            <div className="flex items-start gap-2.5 p-3 bg-stone-50 rounded-lg border border-stone-200/80">
              <CalendarDays className="w-4 h-4 text-amber-700 mt-0.5 shrink-0" />
              <div>
                <p className="text-[11px] text-stone-500">Dates</p>
                <p className="font-semibold text-stone-900">
                  {result.checkIn} to {result.checkOut} ({result.nights} {result.nights === 1 ? 'night' : 'nights'})
                </p>
                <p className="text-[11px] text-stone-500">Check-in from {result.checkInTime} · Check-out until {result.checkOutTime}</p>
              </div>
            </div>
            <div className="flex items-start gap-2.5 p-3 bg-stone-50 rounded-lg border border-stone-200/80">
              <Users className="w-4 h-4 text-amber-700 mt-0.5 shrink-0" />
              <div>
                <p className="text-[11px] text-stone-500">Guest</p>
                <p className="font-semibold text-stone-900">{result.guest}</p>
                <p className="text-[11px] text-stone-500">
                  {result.adults + result.children} {result.adults + result.children === 1 ? 'guest' : 'guests'}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2.5 p-3 bg-stone-50 rounded-lg border border-stone-200/80">
              <span className="w-4 text-center text-amber-700 font-semibold shrink-0">₱</span>
              <div>
                <p className="text-[11px] text-stone-500">Rate</p>
                <p className="font-semibold text-stone-900 tabular-nums">₱{result.rate.toLocaleString()} / night</p>
                <p className="text-[11px] text-stone-500">Paid at the hotel; the front desk settles the final amount.</p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-stone-100 flex flex-col sm:flex-row gap-2 text-xs">
            <a href={HOTEL_INFO.phoneHref} className="flex items-center gap-2 p-2.5 rounded-lg bg-white border border-stone-200 hover:border-amber-400 transition-colors">
              <Phone className="w-4 h-4 text-amber-700" />
              <span className="font-semibold text-stone-900">{HOTEL_INFO.phone}</span>
            </a>
            <a
              href={`mailto:${HOTEL_INFO.reservationsEmail}?subject=${encodeURIComponent(`Booking ${result.code}`)}`}
              className="flex items-center gap-2 p-2.5 rounded-lg bg-white border border-stone-200 hover:border-amber-400 transition-colors"
            >
              <Mail className="w-4 h-4 text-amber-700" />
              <span className="font-semibold text-stone-900 break-all">{HOTEL_INFO.reservationsEmail}</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
