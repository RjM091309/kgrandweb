import React, { useState } from 'react';
import { useHotel, BookingRecord } from '../context/HotelContext';
import { HOTEL_INFO } from '../data/hotelData';
import {
  User,
  ShieldCheck,
  Calendar,
  Lock,
  Mail,
  Phone,
  MapPin,
  Clock,
  Sparkles,
  ChevronRight,
  ArrowRight,
  Printer,
  X,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Select } from '../components/Select';

// 1. Sign In Page
export const SignInPage: React.FC = () => {
  const { loginUser, navigateTo } = useHotel();
  const [email, setEmail] = useState('alexander.vane@heritage.co.uk');
  const [password, setPassword] = useState('••••••••••••');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginUser(email, 'Alexander Vane-Tempest');
    navigateTo('profile');
  };

  const handleDemoSignIn = () => {
    loginUser('alexander.vane@heritage.co.uk', 'Alexander Vane-Tempest');
    navigateTo('profile');
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-white p-8 rounded-2xl border border-stone-200 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <span className="text-[10px] uppercase tracking-[0.25em] text-amber-700 font-semibold block">
            Aurelia Club Elite
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif text-stone-900">
            Guest Sign In
          </h1>
          <p className="text-xs text-stone-500">
            Access your reserved suites, bespoke preferences, and member benefits.
          </p>
        </div>

        {/* Demo Fast Login Banner */}
        <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/80 text-xs text-amber-900 flex items-center justify-between">
          <div>
            <p className="font-semibold">Prototype Guest Demo:</p>
            <p className="text-[11px] text-amber-800">Pre-populated with Elite Tier guest data</p>
          </div>
          <button
            type="button"
            onClick={handleDemoSignIn}
            className="px-3 py-1.5 bg-amber-300 hover:bg-amber-200 text-stone-950 font-semibold text-xs rounded transition-colors shadow-xs"
          >
            Demo Sign In
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-[11px] font-medium text-stone-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-lg pl-9 pr-3 py-2 text-stone-900 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-[11px] font-medium text-stone-700">Password</label>
              <button
                type="button"
                onClick={() => navigateTo('forgot-password')}
                className="text-[11px] text-amber-800 hover:underline"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-lg pl-9 pr-3 py-2 text-stone-900 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 text-xs uppercase tracking-wider font-semibold bg-stone-900 hover:bg-stone-800 text-white rounded-lg transition-colors shadow-md"
          >
            Sign In to Account
          </button>
        </form>

        <div className="pt-4 border-t border-stone-100 text-center text-xs text-stone-500">
          <span>Don't have a guest profile yet? </span>
          <button
            onClick={() => navigateTo('register')}
            className="font-semibold text-amber-800 hover:underline"
          >
            Create Guest Account
          </button>
        </div>
      </div>
    </div>
  );
};

// 2. Register / Create Account Page
export const RegisterPage: React.FC = () => {
  const { loginUser, navigateTo, showNotification } = useHotel();
  const [form, setForm] = useState({
    title: 'Mr.',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginUser(form.email, `${form.firstName} ${form.lastName}`);
    showNotification('Welcome! Your Aurelia Club profile has been initialized.');
    navigateTo('profile');
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-white p-8 rounded-2xl border border-stone-200 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <span className="text-[10px] uppercase tracking-[0.25em] text-amber-700 font-semibold block">
            Membership Privileges
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif text-stone-900">
            Create Guest Account
          </h1>
          <p className="text-xs text-stone-500">
            Join the Aurelia Society for preferred suite rates, room upgrades, and priority reservations.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-[11px] font-medium text-stone-700 mb-1">Title</label>
              <Select
                value={String(form.title)}
                onChange={(v) => setForm({ ...form, title: v })}
                options={[
                  { value: "Mr.", label: "Mr." },
                  { value: "Ms.", label: "Ms." },
                  { value: "Mrs.", label: "Mrs." },
                  { value: "Dr.", label: "Dr." },
                ]}
              />
            </div>
            <div className="col-span-2">
              <label className="block text-[11px] font-medium text-stone-700 mb-1">First Name</label>
              <input
                type="text"
                required
                value={form.firstName}
                onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2 text-stone-900"
                placeholder="Alexander"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-stone-700 mb-1">Last Name</label>
            <input
              type="text"
              required
              value={form.lastName}
              onChange={(e) => setForm({ ...form, lastName: e.target.value })}
              className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2 text-stone-900"
              placeholder="Sterling"
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-stone-700 mb-1">Email Address</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2 text-stone-900"
              placeholder="alexander@example.com"
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-stone-700 mb-1">Create Password</label>
            <input
              type="password"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2 text-stone-900"
              placeholder="••••••••••••"
            />
          </div>

          <div className="p-3 bg-stone-50 rounded-lg text-[11px] text-stone-500 space-y-1">
            <p className="font-semibold text-stone-700">Member Inclusions:</p>
            <p>✓ Complimentary welcome glass of Dom Pérignon</p>
            <p>✓ Guaranteed 14:00 late check-out upon availability</p>
            <p>✓ 15% discount across estate thalasso treatments</p>
          </div>

          <button
            type="submit"
            className="w-full py-3 text-xs uppercase tracking-wider font-semibold bg-stone-900 hover:bg-stone-800 text-white rounded-lg transition-colors shadow-md"
          >
            Create My Membership
          </button>
        </form>

        <div className="pt-4 border-t border-stone-100 text-center text-xs text-stone-500">
          <span>Already registered? </span>
          <button
            onClick={() => navigateTo('signin')}
            className="font-semibold text-amber-800 hover:underline"
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
};

// 3. Forgot Password Page
export const ForgotPasswordPage: React.FC = () => {
  const { navigateTo } = useHotel();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSent(true);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-white p-8 rounded-2xl border border-stone-200 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <span className="text-[10px] uppercase tracking-[0.25em] text-amber-700 font-semibold block">
            Account Recovery
          </span>
          <h1 className="text-2xl font-serif text-stone-900">
            Reset Password
          </h1>
          <p className="text-xs text-stone-500">
            Provide your registered email address to receive secure reset instructions.
          </p>
        </div>

        {sent ? (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-3 text-xs text-emerald-900 text-center">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
            <p className="font-semibold">Reset Instructions Sent</p>
            <p className="text-stone-600">
              A secure password reset link was dispatched to <strong>{email}</strong>. Please check your inbox.
            </p>
            <button
              onClick={() => navigateTo('signin')}
              className="mt-2 px-4 py-2 bg-stone-900 text-white rounded text-xs font-semibold"
            >
              Return to Sign In
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-[11px] font-medium text-stone-700 mb-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2.5 text-stone-900 focus:outline-none focus:border-amber-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 text-xs uppercase tracking-wider font-semibold bg-stone-900 hover:bg-stone-800 text-white rounded-lg transition-colors shadow-md"
            >
              Send Reset Link
            </button>

            <button
              type="button"
              onClick={() => navigateTo('signin')}
              className="w-full py-2 text-xs text-stone-500 hover:text-stone-900 text-center"
            >
              Back to Sign In
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

// 4. Guest Profile Screen
export const ProfilePage: React.FC = () => {
  const { user, updateUserProfile, showNotification, navigateTo } = useHotel();
  const [profileForm, setProfileForm] = useState({
    title: user.title,
    firstName: user.firstName,
    lastName: user.lastName,
    phone: user.phone,
    country: user.country,
    pillow: user.preferences.pillow,
    floor: user.preferences.floor,
    newspaper: user.preferences.newspaper,
    dietary: user.preferences.dietary,
    specialOccasion: user.preferences.specialOccasion,
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      title: profileForm.title,
      firstName: profileForm.firstName,
      lastName: profileForm.lastName,
      phone: profileForm.phone,
      country: profileForm.country,
      preferences: {
        pillow: profileForm.pillow,
        floor: profileForm.floor,
        newspaper: profileForm.newspaper,
        dietary: profileForm.dietary,
        specialOccasion: profileForm.specialOccasion,
      }
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Banner / Membership Card */}
      <div className="bg-stone-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl border border-stone-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <span className="text-xs uppercase tracking-widest text-amber-300 font-mono">
            {user.membershipTier}
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif mt-1">
            {user.title} {user.firstName} {user.lastName}
          </h1>
          <p className="text-xs text-stone-400 mt-1">
            Member since {user.memberSince} · {user.stayCount} completed stays at Aurelia Grand
          </p>
        </div>

        <div className="bg-stone-950/80 px-4 py-3 rounded-xl border border-stone-800 text-xs space-y-1">
          <p className="text-amber-300 font-medium">Aurelia Privilege Tier</p>
          <p className="text-stone-300">Dedicated Clefs d'Or Butler</p>
          <p className="text-stone-400 text-[10px]">Guaranteed 16:00 Late Check-out</p>
        </div>
      </div>

      {/* Tabs / Submenu */}
      <div className="flex gap-4 border-b border-stone-200 pb-3 text-xs">
        <button className="font-semibold text-stone-900 border-b-2 border-stone-900 pb-2">
          Profile & Stay Preferences
        </button>
        <button
          onClick={() => navigateTo('my-bookings')}
          className="text-stone-500 hover:text-stone-900 pb-2"
        >
          My Reservations
        </button>
      </div>

      {/* Profile & Stay Preferences Form */}
      <form onSubmit={handleSave} className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-sm space-y-8">
        {/* Personal Details */}
        <div className="space-y-4">
          <h2 className="text-lg font-serif text-stone-900">
            Personal Information
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-[11px] font-medium text-stone-600 mb-1">Honorific Title</label>
              <input
                type="text"
                value={profileForm.title}
                onChange={(e) => setProfileForm({ ...profileForm, title: e.target.value })}
                className="w-full bg-stone-50 border border-stone-200 rounded p-2 text-stone-800"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-stone-600 mb-1">First Name</label>
              <input
                type="text"
                value={profileForm.firstName}
                onChange={(e) => setProfileForm({ ...profileForm, firstName: e.target.value })}
                className="w-full bg-stone-50 border border-stone-200 rounded p-2 text-stone-800"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-stone-600 mb-1">Last Name</label>
              <input
                type="text"
                value={profileForm.lastName}
                onChange={(e) => setProfileForm({ ...profileForm, lastName: e.target.value })}
                className="w-full bg-stone-50 border border-stone-200 rounded p-2 text-stone-800"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-[11px] font-medium text-stone-600 mb-1">Contact Telephone</label>
              <input
                type="tel"
                value={profileForm.phone}
                onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                className="w-full bg-stone-50 border border-stone-200 rounded p-2 text-stone-800"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-stone-600 mb-1">Country of Primary Residence</label>
              <input
                type="text"
                value={profileForm.country}
                onChange={(e) => setProfileForm({ ...profileForm, country: e.target.value })}
                className="w-full bg-stone-50 border border-stone-200 rounded p-2 text-stone-800"
              />
            </div>
          </div>
        </div>

        {/* Personalized Hospitality & Suite Preferences */}
        <div className="space-y-4 pt-6 border-t border-stone-200">
          <div>
            <h2 className="text-lg font-serif text-stone-900">
              Personalized Hospitality & Stay Rituals
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              These preferences automatically configure every reservation booked under your account.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-[11px] font-medium text-stone-600 mb-1">Pillow Menu Preference</label>
              <Select
                value={String(profileForm.pillow)}
                onChange={(v) => setProfileForm({ ...profileForm, pillow: v })}
                options={[
                  { value: "Feather & Goose Down (Firm)", label: "Feather & Goose Down (Firm)" },
                  { value: "Hypoallergenic Microfiber", label: "Hypoallergenic Microfiber" },
                  { value: "Memory Foam Ergonomic", label: "Memory Foam Ergonomic" },
                  { value: "Silk Lavender Infused", label: "Silk Lavender Infused" },
                ]}
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-stone-600 mb-1">Suite Floor Placement</label>
              <Select
                value={String(profileForm.floor)}
                onChange={(v) => setProfileForm({ ...profileForm, floor: v })}
                options={[
                  { value: "High Floor (Penthouse / Top Tier)", label: "High Floor (Penthouse / Top Tier)" },
                  { value: "Direct Garden / Ground Access", label: "Direct Garden / Ground Access" },
                  { value: "Secluded Corner Sanctuary", label: "Secluded Corner Sanctuary" },
                ]}
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-stone-600 mb-1">Morning Newspaper Delivery</label>
              <input
                type="text"
                value={profileForm.newspaper}
                onChange={(e) => setProfileForm({ ...profileForm, newspaper: e.target.value })}
                className="w-full bg-stone-50 border border-stone-200 rounded p-2 text-stone-800"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-stone-600 mb-1">Dietary & Bar Preferences</label>
              <input
                type="text"
                value={profileForm.dietary}
                onChange={(e) => setProfileForm({ ...profileForm, dietary: e.target.value })}
                className="w-full bg-stone-50 border border-stone-200 rounded p-2 text-stone-800"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors"
          >
            Save Preferences
          </button>
        </div>
      </form>
    </div>
  );
};

// 5. My Bookings & Booking Details Screen
export const MyBookingsPage: React.FC = () => {
  const { userBookings, cancelBooking, navigateTo } = useHotel();
  const [selectedBookingForDetails, setSelectedBookingForDetails] = useState<BookingRecord | null>(null);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest text-amber-700 font-semibold block mb-1">
            Stay History & Itinerary
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif text-stone-900">
            My Reservations
          </h1>
        </div>
        <button
          onClick={() => navigateTo('rooms')}
          className="px-4 py-2 bg-amber-300 hover:bg-amber-200 text-stone-950 font-semibold text-xs rounded uppercase tracking-wider transition-colors self-start"
        >
          Book New Suite
        </button>
      </div>

      {userBookings.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-sm border border-transparent shadow-[0_10px_20px_-8px_rgb(0_0_0/0.15)] space-y-3">
          <Calendar className="w-8 h-8 text-stone-300 mx-auto" />
          <h3 className="font-serif text-lg text-stone-800">No Reservations On Record</h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            You do not currently have any active or past reservations under your guest account.
          </p>
          <button
            onClick={() => navigateTo('rooms')}
            className="mt-2 px-5 py-2.5 bg-stone-900 text-white rounded text-xs font-semibold"
          >
            Explore Accommodations
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {userBookings.map((booking) => {
            const isConfirmed = booking.status === 'Confirmed';
            const isCancelled = booking.status === 'Cancelled';

            return (
              <div
                key={booking.reference}
                className="bg-white rounded-sm border border-transparent shadow-[0_10px_20px_-8px_rgb(0_0_0/0.18),0_2px_4px_-2px_rgb(0_0_0/0.06)] p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:-translate-y-0.5 hover:shadow-[0_16px_28px_-10px_rgb(0_0_0/0.22),0_2px_6px_-2px_rgb(0_0_0/0.08)] transition-all duration-300"
              >
                {/* Left: Suite info and thumbnail */}
                <div className="flex items-start gap-4">
                  <img
                    src={booking.room.images[0]}
                    alt={booking.room.name}
                    referrerPolicy="no-referrer"
                    className="w-24 h-20 object-cover rounded-xs shrink-0"
                  />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-stone-900 bg-stone-100 px-2 py-0.5 rounded border border-stone-200">
                        {booking.reference}
                      </span>
                      <span
                        className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                          isConfirmed
                            ? 'bg-emerald-50 text-emerald-800'
                            : isCancelled
                            ? 'bg-rose-50 text-rose-800'
                            : 'bg-stone-100 text-stone-600'
                        }`}
                      >
                        {booking.status}
                      </span>
                    </div>

                    <h3 className="font-serif text-lg font-semibold text-stone-900">
                      {booking.room.name}
                    </h3>

                    <p className="text-xs text-stone-500">
                      {booking.checkIn} → {booking.checkOut} ({booking.nights} nights) · {booking.adults} Adults
                    </p>
                  </div>
                </div>

                {/* Right: Amount & Action buttons */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full md:w-auto justify-between border-t border-stone-100 md:border-t-0 pt-4 md:pt-0">
                  <div className="text-left md:text-right">
                    <span className="text-[10px] text-stone-400 block uppercase">Total Amount</span>
                    <span className="text-lg font-serif font-bold text-stone-900 tabular-nums">
                      ₱{booking.totalAmount.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedBookingForDetails(booking)}
                      className="px-3.5 py-2 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded transition-colors"
                    >
                      View Details
                    </button>

                    {isConfirmed && (
                      <button
                        onClick={() => {
                          if (confirm(`Cancel reservation ${booking.reference}? No cancellation fee applies under 48-hour flexible terms.`)) {
                            cancelBooking(booking.reference);
                          }
                        }}
                        className="px-3 py-2 text-xs text-stone-500 hover:text-rose-700 hover:bg-rose-50 rounded transition-colors"
                      >
                        Cancel Stay
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Booking Details Modal */}
      {selectedBookingForDetails && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedBookingForDetails(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto border border-stone-200 shadow-2xl animate-in fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between pb-4 border-b border-stone-100">
              <div>
                <span className="text-[10px] font-mono uppercase text-amber-800">
                  Reservation Dossier
                </span>
                <h3 className="text-xl font-serif text-stone-900 mt-0.5">
                  {selectedBookingForDetails.reference}
                </h3>
              </div>
              <button
                onClick={() => setSelectedBookingForDetails(null)}
                className="p-1.5 text-stone-400 hover:text-stone-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs text-stone-700">
              <div className="flex gap-4 p-3 bg-stone-50 rounded-xl border border-stone-200/80">
                <img
                  src={selectedBookingForDetails.room.images[0]}
                  alt={selectedBookingForDetails.room.name}
                  referrerPolicy="no-referrer"
                  className="w-20 h-16 object-cover rounded-lg shrink-0"
                />
                <div>
                  <h4 className="font-serif font-semibold text-stone-900">{selectedBookingForDetails.room.name}</h4>
                  <p className="text-stone-500 mt-0.5">{selectedBookingForDetails.room.view}</p>
                  <p className="text-[11px] text-stone-400">{selectedBookingForDetails.room.sizeSqM} m² · {selectedBookingForDetails.room.bedConfiguration}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 p-3 bg-stone-50 rounded-xl border border-stone-200/80">
                <div>
                  <p className="text-stone-500">Dates of Stay</p>
                  <p className="font-semibold text-stone-900">{selectedBookingForDetails.checkIn} to {selectedBookingForDetails.checkOut}</p>
                </div>
                <div>
                  <p className="text-stone-500">Duration</p>
                  <p className="font-semibold text-stone-900">{selectedBookingForDetails.nights} Nights</p>
                </div>
                <div>
                  <p className="text-stone-500">Guests</p>
                  <p className="font-semibold text-stone-900">{selectedBookingForDetails.adults} Adults, {selectedBookingForDetails.children} Children</p>
                </div>
                <div>
                  <p className="text-stone-500">Status</p>
                  <p className="font-semibold text-emerald-800">{selectedBookingForDetails.status}</p>
                </div>
              </div>

              <div>
                <p className="font-semibold text-stone-900 mb-1">Registered Guest</p>
                <p>{selectedBookingForDetails.guestInfo.title} {selectedBookingForDetails.guestInfo.firstName} {selectedBookingForDetails.guestInfo.lastName}</p>
                <p className="text-stone-500">{selectedBookingForDetails.guestInfo.email} · {selectedBookingForDetails.guestInfo.phone}</p>
                {selectedBookingForDetails.guestInfo.specialRequests && (
                  <p className="mt-1 italic text-stone-600">Note: "{selectedBookingForDetails.guestInfo.specialRequests}"</p>
                )}
              </div>

              <div className="pt-3 border-t border-stone-100 flex justify-between items-baseline text-sm">
                <span className="font-semibold text-stone-900">Total Charged</span>
                <span className="font-serif font-bold text-lg tabular-nums">₱{selectedBookingForDetails.totalAmount.toLocaleString()}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-stone-100 flex justify-end gap-3">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 border border-stone-200 rounded text-xs text-stone-700 hover:bg-stone-50"
              >
                Print Voucher
              </button>
              <button
                onClick={() => setSelectedBookingForDetails(null)}
                className="px-5 py-2 bg-stone-900 text-white rounded text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
