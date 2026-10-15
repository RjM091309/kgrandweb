import type { HotelInfoResponse } from '../lib/bookingApi';

export interface Room {
  id: string;
  name: string;
  tagline: string;
  category: 'Standard' | 'Deluxe King' | 'Deluxe Twin';
  /** The room type's id in the K Grand admin system (its rate and availability come from there). */
  apiTypeId: string;
  pricePerNight: number;
  originalPrice?: number;
  sizeSqM: number;
  sizeSqFt: number;
  maxAdults: number;
  maxChildren: number;
  bedConfiguration: string;
  view: string;
  images: string[];
  description: string;
  longDescription: string[];
  features: string[];
  amenities: string[];
  rating: number;
  reviewCount: number;
  popular?: boolean;
}

export interface Amenity {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  image: string;
  iconName: string;
  operatingHours: string;
  highlights: string[];
}

export interface SpecialOffer {
  id: string;
  title: string;
  badge: string;
  subtitle: string;
  description: string;
  discountPercentage: number;
  promoCode: string;
  validUntil: string;
  minNights: number;
  benefits: string[];
  image: string;
  applicableRoomCategory?: string;
}

export interface Review {
  id: string;
  author: string;
  location: string;
  avatarText: string;
  date: string;
  stayDuration: string;
  roomBooked: string;
  rating: number;
  title: string;
  content: string;
  helpfulCount: number;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'All' | 'Rooms' | 'Lobby & Interiors' | 'Hotel Exterior';
  image: string;
  caption: string;
}

export interface BookingAddOn {
  id: string;
  name: string;
  description: string;
  price: number;
  perPerson?: boolean;
  perStay?: boolean;
  icon: string;
}

export const HOTEL_INFO = {
  name: "The K Grand Hotel",
  shortName: "K Grand",
  tagline: "Discover Your Perfect Escape",
  welcomeText: "Apartment-style rooms in the heart of Clark Freeport Zone, minutes from Clark International Airport, with a sauna, pool, free parking, and EV charging on site.",
  address: "Lot 1 E. Aguinaldo St., Clark Freeport Zone, Mabalacat City, 2010 Pampanga, Philippines",
  phone: "+63 945 789 1069",
  phoneHref: "tel:+639457891069",
  reservationsEmail: "reservations@thekgrandhotel.com", // TODO: confirm this mailbox exists
  inquiriesEmail: "info@thekgrandhotel.com", // TODO: confirm this mailbox exists
  checkInTime: "14:00", // replaced at load by the admin system's setting
  checkOutTime: "12:00", // replaced at load by the admin system's setting
  mapsQuery: "The K Grand Hotel, Lot 1 E. Aguinaldo St., Clark Freeport Zone, Mabalacat City, Pampanga",
  cancellationPolicyDefault: "Complimentary cancellation up to 48 hours prior to arrival. Deposit is fully refundable within this window.",
  rating: 4.96,
  totalReviews: 482,
};

export const IMAGES = {
  hero: "/images/body-bg.jpg",
  entrance: "/images/body-bg.jpg",
  entrance2: "/images/body1-bg.jpg",
  entrance3: "/images/body2-bg.jpg",
  location: "/images/map.jpg",
  storyRoom: "/images/rightside.jpg",
  storyLounge: "/images/lefside.jpg",
  galleryRoom: "/images/1.jpg",
  galleryLobby: "/images/2.jpg",
  galleryRoom2: "/images/3.jpg",
};

export const ROOM_CATEGORIES = ['All', 'Standard', 'Deluxe King', 'Deluxe Twin'];

// The three room types of the K Grand admin system. Name, nightly rate (its walk-in rate) and guest limit are replaced at load
// with the admin system's values (see applyHotelInfo); the numbers below are only shown until then, or if it can't be reached.
export const ROOMS: Room[] = [
  {
    id: "standard",
    apiTypeId: "23",
    name: "Standard Room",
    tagline: "Comfortable, well-appointed room for solo travelers and couples",
    category: "Standard",
    pricePerNight: 4000,
    sizeSqM: 24, // TODO: confirm actual size
    sizeSqFt: 258,
    maxAdults: 2,
    maxChildren: 0,
    bedConfiguration: "1 Double Bed", // TODO: confirm bed type
    view: "Private Terrace or Balcony",
    images: [IMAGES.galleryRoom, IMAGES.galleryRoom2, IMAGES.galleryLobby],
    description: "A cozy, apartment-style room with air-conditioning, a private bathroom, and its own terrace or balcony. Ideal for short stays in Clark.",
    longDescription: [
      "The Standard Room offers everything you need for a restful stay in Clark Freeport Zone: a comfortable bed, warm ambient lighting, and a private bathroom.",
      "Step out onto your own terrace or balcony, then unwind at the sauna or pool. Free on-site parking and EV charging make arriving by car easy."
    ],
    features: [
      "Private terrace or balcony",
      "Air-conditioning",
      "Private bathroom",
      "Work desk"
    ],
    amenities: [
      "Air-conditioning",
      "Private bathroom",
      "Free Wi-Fi", // TODO: confirm
      "Flat-screen TV",
      "Work desk",
      "Access to sauna and pool",
      "Free parking with EV charging"
    ],
    rating: 5.0, // TODO: replace with real guest rating
    reviewCount: 5, // TODO: replace with real review count
  },
  {
    id: "deluxe-king",
    apiTypeId: "24",
    name: "Deluxe King Room",
    tagline: "Extra space and a king-size bed for a more relaxed stay",
    category: "Deluxe King",
    pricePerNight: 4600,
    sizeSqM: 30, // TODO: confirm actual size
    sizeSqFt: 323,
    maxAdults: 2,
    maxChildren: 0,
    bedConfiguration: "1 King Bed",
    view: "Private Terrace or Balcony",
    images: [IMAGES.galleryLobby, IMAGES.galleryRoom, IMAGES.galleryRoom2],
    description: "A roomier deluxe room with a king-size bed, a work desk, and a private terrace or balcony. Great for couples and business travelers.",
    longDescription: [
      "The Deluxe King Room gives you more space to settle in, with a king-size bed, soft cove lighting, and a dedicated work desk.",
      "Every Deluxe room includes air-conditioning, a private bathroom, and its own terrace or balcony, plus access to the sauna and pool."
    ],
    features: [
      "King-size bed",
      "Private terrace or balcony",
      "Air-conditioning",
      "Private bathroom",
      "Work desk"
    ],
    amenities: [
      "Air-conditioning",
      "Private bathroom",
      "Free Wi-Fi", // TODO: confirm
      "Flat-screen TV",
      "Work desk",
      "Access to sauna and pool",
      "Free parking with EV charging"
    ],
    rating: 5.0, // TODO: replace with real guest rating
    reviewCount: 5, // TODO: replace with real review count,
    popular: true
  },
  {
    id: "deluxe-twin",
    apiTypeId: "25",
    name: "Deluxe Twin Room",
    tagline: "Two beds and extra space, ideal for friends, colleagues, and families",
    category: "Deluxe Twin",
    pricePerNight: 5500,
    sizeSqM: 32, // TODO: confirm actual size
    sizeSqFt: 344,
    maxAdults: 2,
    maxChildren: 0,
    bedConfiguration: "2 Single Beds", // TODO: confirm bed type
    view: "Private Terrace or Balcony",
    images: [IMAGES.galleryRoom2, IMAGES.galleryRoom, IMAGES.galleryLobby],
    description: "Our most spacious room type, with two beds, a sitting area, and a private terrace or balcony. Perfect for travel companions and longer stays.",
    longDescription: [
      "The Deluxe Twin Room is designed for guests sharing a room who still want their own bed, with plenty of space and storage.",
      "Enjoy air-conditioning, a private bathroom, and your own terrace or balcony, plus access to the sauna, pool, free parking, and EV charging."
    ],
    features: [
      "Two separate beds",
      "Private terrace or balcony",
      "Sitting area",
      "Air-conditioning",
      "Private bathroom",
      "Work desk"
    ],
    amenities: [
      "Air-conditioning",
      "Private bathroom",
      "Free Wi-Fi", // TODO: confirm
      "Flat-screen TV",
      "Work desk",
      "Access to sauna and pool",
      "Free parking with EV charging"
    ],
    rating: 5.0, // TODO: replace with real guest rating
    reviewCount: 5, // TODO: replace with real review count
  }
];

/**
 * Copies the admin system's live values into the room list and hotel info: each room type's name, walk-in rate and guest limit,
 * and the check-in / check-out times. The pages read ROOMS and HOTEL_INFO directly, so the context re-renders after calling this.
 */
export function applyHotelInfo(info: HotelInfoResponse) {
  HOTEL_INFO.checkInTime = info.checkInTime || HOTEL_INFO.checkInTime;
  HOTEL_INFO.checkOutTime = info.checkOutTime || HOTEL_INFO.checkOutTime;
  for (const room of ROOMS) {
    const type = info.roomTypes.find((t) => t.id === room.apiTypeId);
    if (!type) continue;
    room.name = type.name;
    if (type.rate > 0) room.pricePerNight = type.rate;
    room.maxAdults = type.maxGuests;
  }
}

export const AMENITIES: Amenity[] = [
  {
    id: "swimming-pool",
    name: "Swimming Pool",
    subtitle: "A refreshing dip after a day in Clark",
    description: "Cool off and unwind at the hotel pool, a relaxing spot to recharge between meetings, sightseeing, or before an early flight from Clark International Airport.",
    image: IMAGES.entrance2, // TODO: replace with a photo of the K Grand pool
    iconName: "Waves",
    operatingHours: "For hotel guests",
    highlights: ["Open to in-house guests", "A great way to cool off in Clark", "Relaxing after a day of travel"]
  },
  {
    id: "sauna",
    name: "Sauna",
    subtitle: "Heat, relax, and reset",
    description: "Ease travel fatigue and tired muscles in our sauna, a quiet place to relax and recover during your stay.",
    image: IMAGES.storyLounge, // TODO: replace with a photo of the K Grand sauna
    iconName: "Flame",
    operatingHours: "For hotel guests",
    highlights: ["Helps you relax after travel", "Quiet, private setting", "Pairs perfectly with a pool dip"]
  },
  {
    id: "private-terrace",
    name: "Private Terrace or Balcony",
    subtitle: "Your own outdoor space in every room",
    description: "Every room comes with its own terrace or balcony, so you can enjoy your morning coffee or the evening breeze in privacy.",
    image: IMAGES.storyRoom,
    iconName: "Sun",
    operatingHours: "In every room",
    highlights: ["Fresh air and natural light", "Private space to relax", "Great for morning coffee"]
  },
  {
    id: "apartment-style-rooms",
    name: "Apartment-Style Rooms",
    subtitle: "Comfort for short and long stays",
    description: "Spacious, apartment-style rooms with air-conditioning, a private bathroom, a work desk, and a comfortable bed, made to feel like home.",
    image: IMAGES.galleryRoom,
    iconName: "BedDouble",
    operatingHours: "In every room",
    highlights: ["Air-conditioning", "Private bathroom", "Dedicated work desk", "Flat-screen TV"]
  },
  {
    id: "free-parking",
    name: "Free Parking",
    subtitle: "Arrive by car with ease",
    description: "Complimentary on-site parking for hotel guests, so road trips and self-drive stays in Clark are hassle-free.",
    image: IMAGES.location,
    iconName: "Car",
    operatingHours: "Complimentary",
    highlights: ["Free for hotel guests", "On-site and secure", "Easy access from E. Aguinaldo St."]
  },
  {
    id: "ev-charging",
    name: "EV Charging",
    subtitle: "Charge up while you stay",
    description: "Driving an electric vehicle? Charge it on site while you rest, so you are ready to go when you check out.",
    image: IMAGES.location,
    iconName: "Zap",
    operatingHours: "For hotel guests",
    highlights: ["On-site EV charging", "Convenient for road trips", "Charge overnight while you rest"]
  }
];

export const SPECIAL_OFFERS: SpecialOffer[] = [
  // TODO: confirm every offer (discount, promo code, validity, inclusions) with K Grand management before promoting it.
  {
    id: "offer-long-stay",
    title: "Long-Stay Savings in Clark",
    badge: "Stay Longer",
    subtitle: "Make yourself at home with a better rate on extended stays",
    description: "In Clark for work, a project, or a family visit? Book 7 nights or more in any apartment-style room and enjoy a lower nightly rate, with free parking and EV charging throughout your stay.",
    discountPercentage: 15,
    promoCode: "LONGSTAY15",
    validUntil: "December 31, 2026",
    minNights: 7,
    benefits: [
      "15% off the nightly room rate",
      "Free on-site parking and EV charging",
      "Access to the sauna and pool",
      "Early check-in or late check-out, subject to availability"
    ],
    image: IMAGES.galleryRoom2,
  },
  {
    id: "offer-direct",
    title: "Book Direct & Save",
    badge: "Best Rate",
    subtitle: "Our best available rate when you book with us directly",
    description: "Skip the booking sites and reserve straight with The K Grand Hotel for a better rate and a warm welcome from our front desk team.",
    discountPercentage: 10,
    promoCode: "DIRECT10",
    validUntil: "December 31, 2026",
    minNights: 1,
    benefits: [
      "10% off the nightly room rate",
      "Free on-site parking and EV charging",
      "Access to the sauna and pool"
    ],
    image: IMAGES.galleryRoom,
  },
  {
    id: "offer-weekend",
    title: "Clark Weekend Getaway",
    badge: "Weekend Escape",
    subtitle: "Two nights to slow down, close to everything in Clark",
    description: "Drive in, park for free, and spend the weekend unwinding at the sauna and pool, with Clark's malls, parks, and restaurants just minutes away.",
    discountPercentage: 10,
    promoCode: "WEEKEND10",
    validUntil: "December 31, 2026",
    minNights: 2,
    benefits: [
      "10% off a 2-night weekend stay",
      "Late check-out, subject to availability",
      "Free on-site parking and EV charging",
      "Access to the sauna and pool"
    ],
    image: IMAGES.storyRoom,
  }
];

// Add real guest reviews here (with the guest's permission). The home page hides the
// reviews section while this list is empty.
export const REVIEWS: Review[] = [];

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: "gal-1",
    title: "The K Grand Hotel at Dusk",
    category: "Hotel Exterior",
    image: IMAGES.location,
    caption: "The K Grand Hotel on E. Aguinaldo Street, Clark Freeport Zone, as the evening lights come on."
  },
  {
    id: "gal-2",
    title: "Guest Room",
    category: "Rooms",
    image: IMAGES.galleryRoom,
    caption: "Warm ambient lighting, a plush bed, a work desk, and a cozy reading corner in every room."
  },
  {
    id: "gal-3",
    title: "Lobby & Reception",
    category: "Lobby & Interiors",
    image: IMAGES.galleryLobby,
    caption: "The K Grand reception, where our team welcomes you to Clark."
  },
  {
    id: "gal-4",
    title: "Guest Room with Work Desk",
    category: "Rooms",
    image: IMAGES.galleryRoom2,
    caption: "Soft cove lighting, a plush bed, and a window-side desk for working or unwinding."
  },
  {
    id: "gal-5",
    title: "Guest Room",
    category: "Rooms",
    image: IMAGES.galleryRoom,
    caption: "Warm ambient lighting, a plush bed, a work desk, and a cozy reading corner in every room."
  },
  {
    id: "gal-6",
    title: "Lobby & Reception",
    category: "Lobby & Interiors",
    image: IMAGES.galleryLobby,
    caption: "The K Grand reception, where our team welcomes you to Clark."
  },
  {
    id: "gal-7",
    title: "Guest Room with Work Desk",
    category: "Rooms",
    image: IMAGES.galleryRoom2,
    caption: "Soft cove lighting, a plush bed, and a window-side desk for working or unwinding."
  },
  {
    id: "gal-8",
    title: "Guest Room",
    category: "Rooms",
    image: IMAGES.galleryRoom,
    caption: "Warm ambient lighting, a plush bed, a work desk, and a cozy reading corner in every room."
  },
  {
    id: "gal-9",
    title: "Hotel Entrance at Night",
    category: "Hotel Exterior",
    image: IMAGES.entrance,
    caption: "The K Grand Hotel entrance, lit up and ready to welcome guests arriving in Clark."
  }
];

export const BOOKING_ADDONS: BookingAddOn[] = [
  // TODO: confirm which add-ons K Grand offers and their actual prices (PHP).
  {
    id: "addon-early-checkin",
    name: "Early Check-In",
    description: "Get into your room from 10:00 instead of the standard 15:00 check-in. Subject to availability; our front desk will confirm before arrival.",
    price: 800,
    perStay: true,
    icon: "Clock"
  },
  {
    id: "addon-late-checkout",
    name: "Late Check-Out",
    description: "Keep your room until 16:00 instead of the standard 12:00 check-out. Subject to availability.",
    price: 800,
    perStay: true,
    icon: "Clock"
  },
  {
    id: "addon-airport-transfer",
    name: "Clark Airport Transfer",
    description: "One-way car transfer between Clark International Airport (CRK) and the hotel, about 4 km away.",
    price: 600,
    perStay: true,
    icon: "Car"
  },
  {
    id: "addon-extra-bed",
    name: "Extra Bed",
    description: "A rollaway bed set up in your room for an additional guest.",
    price: 1000,
    perStay: true,
    icon: "BedDouble"
  }
];

export const NEARBY_ATTRACTIONS = [
  {
    name: "Clark International Airport (CRK)",
    distance: "approx. 4 km",
    driveTime: "Short drive within Clark Freeport Zone",
    category: "Travel",
    description: "The nearest international gateway, about 2.5 miles from the hotel."
  },
  {
    name: "Clark Parade Grounds",
    distance: "",
    driveTime: "Within Clark Freeport Zone",
    category: "Landmark & Recreation",
    description: "Wide open green field popular for morning walks, picnics, and Clark's hot air balloon events."
  },
  {
    name: "SM City Clark",
    distance: "",
    driveTime: "Near the Clark main gate",
    category: "Shopping & Dining",
    description: "Major shopping mall with restaurants, cinemas, and everyday essentials."
  },
  {
    name: "Aqua Planet & Dinosaurs Island",
    distance: "",
    driveTime: "Within Clark Freeport Zone",
    category: "Family & Leisure",
    description: "Water park and dinosaur theme park, both favorites for families visiting Clark."
  }
];

export const FAQS = [
  {
    question: "What are your check-in and check-out times?",
    answer: "Check-in starts at 15:00 and check-out is at 12:00 noon. Early check-in and late check-out can be requested in advance and are subject to availability."
  },
  {
    question: "What is the cancellation policy?",
    answer: "Standard reservations can be cancelled free of charge up to 48 hours before arrival. Cancellations made within 48 hours of arrival are charged one night's room rate. Promotional rates may have different terms, which are shown before you confirm."
  },
  {
    question: "Where is the hotel, and how far is it from Clark International Airport?",
    answer: "We are at Lot 1 E. Aguinaldo St., Clark Freeport Zone, Mabalacat City, Pampanga, about 4 km (2.5 miles) from Clark International Airport (CRK). Contact us if you would like help arranging a transfer."
  },
  {
    question: "Is parking available? Can I charge my electric vehicle?",
    answer: "Yes. On-site parking is free for hotel guests, and we have EV charging on site so you can charge while you stay."
  },
  {
    question: "What facilities can guests use?",
    answer: "All guests can use the sauna and pool. Every room is apartment-style, with air-conditioning, a private bathroom, a work desk, and its own terrace or balcony."
  },
  {
    question: "Do you offer rates for longer stays?",
    answer: "Yes. Our apartment-style rooms are well suited to extended stays. Contact our front desk or choose \"Long-Stay Inquiry\" on the contact form and we will send you a quote."
  }
];
