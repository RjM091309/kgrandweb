// Client for the K Grand admin system's public booking API. nginx serves it on this site's own domain under
// /api/public/ (forwarded to the admin server), so these are same-origin calls with no CORS.

const BASE = '/api/public';

export interface ApiRoomType {
  id: string;
  name: string;
  description: string;
  rate: number;
  rooms: number;
  maxGuests: number;
}

export interface HotelInfoResponse {
  hotelName: string;
  currency: string;
  checkInTime: string;
  checkOutTime: string;
  roomTypes: ApiRoomType[];
}

export interface AvailabilityResponse {
  checkIn: string;
  checkOut: string;
  nights: number;
  /** Free rooms per admin room type id. */
  available: Record<string, number>;
}

export interface BookingRequest {
  roomTypeId: string;
  checkIn: string;
  checkOut: string;
  rooms: number;
  adults: number;
  children: number;
  guest: { name: string; email: string; phone: string; country?: string };
  specialRequests?: string;
  estimatedArrival?: string;
  /** Honeypot: hidden from people, so only bots fill it in. */
  website?: string;
}

export interface BookingResponse {
  codes: string[];
  roomType: string;
  rooms: number;
  checkIn: string;
  checkOut: string;
  nights: number;
  adults: number;
  children: number;
  rate: number;
  total: number;
  currency: string;
  status: 'pending';
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${BASE}${path}`, { ...init, headers: { 'Content-Type': 'application/json', ...init?.headers } });
  } catch {
    throw new Error('We could not reach our booking system. Please check your connection and try again.');
  }
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.error || 'Something went wrong. Please try again or contact us.');
  return body as T;
}

export const fetchHotelInfo = () => request<HotelInfoResponse>('/info');

export const fetchAvailability = (checkIn: string, checkOut: string) =>
  request<AvailabilityResponse>(`/availability?checkIn=${encodeURIComponent(checkIn)}&checkOut=${encodeURIComponent(checkOut)}`);

export const createBooking = (booking: BookingRequest) =>
  request<BookingResponse>('/bookings', { method: 'POST', body: JSON.stringify(booking) });
