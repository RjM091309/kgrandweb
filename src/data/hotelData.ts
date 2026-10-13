export interface Room {
  id: string;
  name: string;
  tagline: string;
  category: 'Standard' | 'Deluxe Queen' | 'Deluxe King';
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
  category: 'All' | 'Suites & Villas' | 'Dining & Bars' | 'Spa & Wellness' | 'Resort Grounds';
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
  reservationsEmail: "concierge@aureliagrandhotel.com", // TODO: replace with the real K Grand email
  inquiriesEmail: "inquiries@aureliagrandhotel.com", // TODO: replace with the real K Grand email
  checkInTime: "15:00",
  checkOutTime: "12:00",
  mapsQuery: "The K Grand Hotel, Lot 1 E. Aguinaldo St., Clark Freeport Zone, Mabalacat City, Pampanga",
  cancellationPolicyDefault: "Complimentary cancellation up to 48 hours prior to arrival. Deposit is fully refundable within this window.",
  rating: 4.96,
  totalReviews: 482,
};

export const IMAGES = {
  hero: "/images/hero_resort_exterior_1791871801628.jpg",
  entrance: "/images/body-bg.jpg",
  entrance2: "/images/body1-bg.jpg",
  entrance3: "/images/body2-bg.jpg",
  location: "/images/map.jpg",
  storyRoom: "/images/rightside.jpg",
  storyLounge: "/images/lefside.jpg",
  galleryRoom: "/images/1.jpg",
  galleryLobby: "/images/2.jpg",
  galleryRoom2: "/images/3.jpg",
  presidentialSuite: "/images/room_presidential_suite_1791871801733.jpg",
  oceanVilla: "/images/room_deluxe_ocean_villa_1791871801629.jpg",
  spaPool: "/images/amenity_infinity_pool_spa_1791871802968.jpg",
  fineDining: "/images/amenity_fine_dining_restaurant_1791871801760.jpg",
  gardenSuite: "/images/room_garden_suite_1791871932788.jpg",
  cliffsideVilla: "/images/room_cliffside_villa_1791871932574.jpg",
  penthouseSky: "/images/room_penthouse_sky_1791871933555.jpg",
  beachClub: "/images/amenity_beach_club_1791871934438.jpg",
};

export const ROOM_CATEGORIES = ['All', 'Standard', 'Deluxe Queen', 'Deluxe King'];

export const ROOMS: Room[] = [
  {
    id: "standard",
    name: "Standard Room",
    tagline: "Comfortable, well-appointed room for solo travelers and couples",
    category: "Standard",
    pricePerNight: 3500, // TODO: confirm actual rate (PHP)
    sizeSqM: 24, // TODO: confirm actual size
    sizeSqFt: 258,
    maxAdults: 2, // TODO: confirm
    maxChildren: 1, // TODO: confirm
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
    id: "deluxe-queen",
    name: "Deluxe Queen Room",
    tagline: "Extra space and a queen-size bed for a more relaxed stay",
    category: "Deluxe Queen",
    pricePerNight: 4500, // TODO: confirm actual rate (PHP)
    sizeSqM: 30, // TODO: confirm actual size
    sizeSqFt: 323,
    maxAdults: 2, // TODO: confirm
    maxChildren: 1, // TODO: confirm
    bedConfiguration: "1 Queen Bed",
    view: "Private Terrace or Balcony",
    images: [IMAGES.galleryLobby, IMAGES.galleryRoom, IMAGES.galleryRoom2],
    description: "A roomier deluxe room with a queen-size bed, a work desk, and a private terrace or balcony. Great for couples and business travelers.",
    longDescription: [
      "The Deluxe Queen Room gives you more space to settle in, with a queen-size bed, soft cove lighting, and a dedicated work desk.",
      "Every Deluxe room includes air-conditioning, a private bathroom, and its own terrace or balcony, plus access to the sauna and pool."
    ],
    features: [
      "Queen-size bed",
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
    id: "deluxe-king",
    name: "Deluxe King Room",
    tagline: "Our most spacious room, with a king-size bed",
    category: "Deluxe King",
    pricePerNight: 5000, // TODO: confirm actual rate (PHP)
    sizeSqM: 32, // TODO: confirm actual size
    sizeSqFt: 344,
    maxAdults: 2, // TODO: confirm
    maxChildren: 2, // TODO: confirm
    bedConfiguration: "1 King Bed",
    view: "Private Terrace or Balcony",
    images: [IMAGES.galleryRoom2, IMAGES.galleryRoom, IMAGES.galleryLobby],
    description: "Our most spacious room type, with a king-size bed, a sitting area, and a private terrace or balcony. Perfect for longer stays and small families.",
    longDescription: [
      "The Deluxe King Room is designed for guests who want extra room to relax, with a king-size bed, a sitting corner, and plenty of storage.",
      "Enjoy air-conditioning, a private bathroom, and your own terrace or balcony, plus access to the sauna, pool, free parking, and EV charging."
    ],
    features: [
      "King-size bed",
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

export const AMENITIES: Amenity[] = [
  {
    id: "swimming-pool",
    name: "Swimming Pool",
    subtitle: "A refreshing dip after a day in Clark",
    description: "Cool off and unwind at the hotel pool, a relaxing spot to recharge between meetings, sightseeing, or before an early flight from Clark International Airport.",
    image: IMAGES.spaPool, // TODO: replace with a photo of the K Grand pool
    iconName: "Waves",
    operatingHours: "For hotel guests",
    highlights: ["Open to in-house guests", "A great way to cool off in Clark", "Relaxing after a day of travel"]
  },
  {
    id: "sauna",
    name: "Sauna",
    subtitle: "Heat, relax, and reset",
    description: "Ease travel fatigue and tired muscles in our sauna, a quiet place to relax and recover during your stay.",
    image: IMAGES.spaPool, // TODO: replace with a photo of the K Grand sauna
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
  {
    id: "offer-romance",
    title: "The Coastal Romance & Sanctuary Experience",
    badge: "Most Popular",
    subtitle: "A celebratory escape designed for intimate moments and restorative luxury",
    description: "Indulge in pure Mediterranean romance. Enjoy luxury suite accommodations, chilled vintage champagne upon arrival, a 90-minute couples thalasso treatment, and an intimate candlelit 4-course dinner overlooking the bay.",
    discountPercentage: 25,
    promoCode: "ROMANCE25",
    validUntil: "December 20, 2026",
    minNights: 2,
    benefits: [
      "Bottle of Laurent-Perrier Cuvée Rosé with artisanal macarons on arrival",
      "90-minute bespoke couples spa massage at The Thalasso Spa",
      "4-course candlelit dinner with sommelier pairings at L'Aura",
      "Complimentary gourmet in-suite Champagne breakfast each morning",
      "Guaranteed late check-out until 16:00"
    ],
    image: IMAGES.oceanVilla,
    applicableRoomCategory: "Suites"
  },
  {
    id: "offer-extended-villa",
    title: "Extended Mediterranean Villa Escape",
    badge: "Stay 5, Pay 4",
    subtitle: "Complimentary 5th night with luxury roundtrip airport transfers",
    description: "Savor the leisurely rhythm of the Côte d'Azur. Reserve four consecutive nights in any of our standalone plunge pool villas or penthouses and enjoy the fifth night complimentary, plus chauffeured private transfers.",
    discountPercentage: 20,
    promoCode: "EXTENDVILLA",
    validUntil: "November 15, 2026",
    minNights: 5,
    benefits: [
      "5th night complimentary on consecutive stays",
      "Private Mercedes-Benz S-Class airport transfer from/to Nice (NCE)",
      "Daily full estate breakfast buffet & à la carte selections",
      "₱150 resort credit applicable towards spa or fine dining",
      "Reserved prime beachfront cabana throughout entire stay"
    ],
    image: IMAGES.cliffsideVilla,
    applicableRoomCategory: "Villas"
  },
  {
    id: "offer-early-bird",
    title: "Early Summer Haven Advance Booking",
    badge: "Advance Purchase",
    subtitle: "Plan ahead and secure up to 20% off premier suites and residences",
    description: "Secure your slice of paradise in advance. Reserve your summer Mediterranean retreat 45 days prior to arrival and receive exclusive preferred rates along with complimentary signature dining experiences.",
    discountPercentage: 20,
    promoCode: "EARLYBIRD20",
    validUntil: "October 30, 2026",
    minNights: 3,
    benefits: [
      "20% preferential reduction on published suite rates",
      "Welcome bottle of chilled Provençal Rosé in room",
      "Complimentary daily gourmet breakfast on the seaside terrace",
      "Flexible complimentary date adjustment up to 14 days before arrival"
    ],
    image: IMAGES.presidentialSuite
  }
];

export const REVIEWS: Review[] = [
  {
    id: "rev-1",
    author: "Elena Rostova",
    location: "Zurich, Switzerland",
    avatarText: "ER",
    date: "September 28, 2026",
    stayDuration: "4 nights",
    roomBooked: "Deluxe Azure Plunge Pool Villa",
    rating: 5.0,
    title: "An ethereal retreat that surpassed every expectation",
    content: "From the moment we arrived via private launch to our villa's plunge pool looking out over the turquoise bay, Aurelia proved why it stands in a class of its own. The service is invisible yet anticipatory. Chef Moreau's tasting menu was exceptional, and the bed linen was pure heaven.",
    helpfulCount: 42
  },
  {
    id: "rev-2",
    author: "Jonathan Sterling",
    location: "London, United Kingdom",
    avatarText: "JS",
    date: "August 14, 2026",
    stayDuration: "7 nights",
    roomBooked: "The Grand Presidential Ocean Suite",
    rating: 5.0,
    title: "Flawless hospitality on the French Riviera",
    content: "Having visited top resorts across the Mediterranean over the past twenty years, Aurelia has established a new gold standard. Our butler, Laurent, ensured every detail from restaurant reservations to private Riva excursions was executed without friction. Truly remarkable.",
    helpfulCount: 38
  },
  {
    id: "rev-3",
    author: "Camille & Marc Dumont",
    location: "Paris, France",
    avatarText: "CD",
    date: "July 22, 2026",
    stayDuration: "3 nights",
    roomBooked: "Cliffside Horizon Sanctuary Villa",
    rating: 4.9,
    title: "Unmatched sunset vistas and sublime thalasso wellness",
    content: "The cliffside villa has arguably the most cinematic sunset perspective anywhere on the Côte d'Azur. The infinity pool thermal circuits melted all fatigue away within hours. We cannot wait to return for our anniversary next summer.",
    helpfulCount: 29
  },
  {
    id: "rev-4",
    author: "Dr. Kenji Takahashi",
    location: "Tokyo, Japan",
    avatarText: "KT",
    date: "June 05, 2026",
    stayDuration: "5 nights",
    roomBooked: "The Aurelia Sky Penthouse Residence",
    rating: 5.0,
    title: "Architectural perfection meets genuine warmth",
    content: "The design restraint and acoustic tranquility of the penthouse are world class. You feel entirely alone with the ocean, yet the concierge responds in seconds to any request. Outstanding breakfast bakery items as well.",
    helpfulCount: 19
  }
];

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: "gal-1",
    title: "The K Grand Hotel at Dusk",
    category: "Resort Grounds",
    image: IMAGES.location,
    caption: "The K Grand Hotel on E. Aguinaldo Street, Clark Freeport Zone, as the evening lights come on."
  },
  {
    id: "gal-2",
    title: "Guest Room",
    category: "Suites & Villas",
    image: IMAGES.galleryRoom,
    caption: "Warm ambient lighting, a plush bed, a work desk, and a cozy reading corner in every room."
  },
  {
    id: "gal-3",
    title: "Lobby & Reception",
    category: "Resort Grounds",
    image: IMAGES.galleryLobby,
    caption: "The K Grand reception, where our team welcomes you to Clark."
  },
  {
    id: "gal-4",
    title: "Guest Room with Work Desk",
    category: "Suites & Villas",
    image: IMAGES.galleryRoom2,
    caption: "Soft cove lighting, a plush bed, and a window-side desk for working or unwinding."
  },
  {
    id: "gal-5",
    title: "Guest Room",
    category: "Suites & Villas",
    image: IMAGES.galleryRoom,
    caption: "Warm ambient lighting, a plush bed, a work desk, and a cozy reading corner in every room."
  },
  {
    id: "gal-6",
    title: "Lobby & Reception",
    category: "Resort Grounds",
    image: IMAGES.galleryLobby,
    caption: "The K Grand reception, where our team welcomes you to Clark."
  },
  {
    id: "gal-7",
    title: "Guest Room with Work Desk",
    category: "Suites & Villas",
    image: IMAGES.galleryRoom2,
    caption: "Soft cove lighting, a plush bed, and a window-side desk for working or unwinding."
  },
  {
    id: "gal-8",
    title: "Guest Room",
    category: "Suites & Villas",
    image: IMAGES.galleryRoom,
    caption: "Warm ambient lighting, a plush bed, a work desk, and a cozy reading corner in every room."
  },
  {
    id: "gal-9",
    title: "Cala d'Or Private Beach Club",
    category: "Resort Grounds",
    image: IMAGES.beachClub,
    caption: "Linen-draped teak cabanas along our sheltered Mediterranean cove."
  }
];

export const BOOKING_ADDONS: BookingAddOn[] = [
  {
    id: "addon-breakfast",
    name: "Gourmet Champagne & Truffle Breakfast",
    description: "Daily à la carte in-suite or seaside terrace breakfast with fresh pastries, artisanal pressed juices, and vintage champagne.",
    price: 45,
    perPerson: true,
    icon: "Coffee"
  },
  {
    id: "addon-transfer",
    name: "Private Limousine Airport Transfer",
    description: "Chauffeured Mercedes-Maybach transfer between Nice Côte d'Azur Airport (NCE) and Aurelia Grand (one-way or roundtrip).",
    price: 180,
    perStay: true,
    icon: "Car"
  },
  {
    id: "addon-spa",
    name: "90-Min Thalasso Rejuvenation Treatment",
    description: "Signature marine mineral scrub, hydrotherapy bath, and restorative aromatherapy deep-tissue massage.",
    price: 240,
    perPerson: true,
    icon: "Sparkles"
  },
  {
    id: "addon-champagne",
    name: "Dom Pérignon & Beluga Caviar Welcome",
    description: "Chilled bottle of Dom Pérignon Vintage 2013 paired with 30g Ossetra Caviar and traditional accompaniments in room on arrival.",
    price: 380,
    perStay: true,
    icon: "Wine"
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
    answer: "Standard check-in begins at 15:00, and check-out is at 12:00 noon. Early check-in and late check-out can be requested in advance and are granted subject to availability. Guests arriving early are welcomed to enjoy our pool, spa, and beach club immediately upon arrival while their luggage is securely attended to."
  },
  {
    question: "What is the cancellation and deposit policy?",
    answer: "Reservations booked under our standard Best Flexible Rate enjoy complimentary cancellation up to 48 hours prior to arrival (15:00 local time). Cancellations made within 48 hours are subject to a 1-night room charge. Special advance-purchase promotions may feature specific non-refundable terms highlighted clearly during room selection."
  },
  {
    question: "Are airport transfers and helipad access available?",
    answer: "Yes. We operate a fleet of private Mercedes-Benz S-Class and V-Class vehicles connecting Nice Côte d'Azur International Airport (NCE), located 18 km away (approx. 30 minutes). In addition, Aurelia features a private certified helipad allowing 8-minute helicopter transfers directly to Nice Airport or Monaco."
  },
  {
    question: "Are children welcome at Aurelia Grand?",
    answer: "Yes, children of all ages are warmly welcomed. We offer interconnected family suites, bespoke children's welcome amenities, baby cots, childproofing upon request, and certified multilingual nanny services arranged through our concierge."
  },
  {
    question: "Is high-speed Wi-Fi provided throughout the estate?",
    answer: "Yes, dedicated fiber-optic Wi-Fi (up to 1 Gbps) is complimentary and seamlessly accessible across all guest rooms, villas, private beach cabanas, gardens, and dining venues."
  },
  {
    question: "What dining options are available on property?",
    answer: "Guests can experience L'Aura (our 2-Michelin starred fine dining restaurant), Le Rivage (casual seaside seafood and grill), The Cliff Bar (sunset craft cocktails and rare spirits), and 24-hour in-suite dining curated by our culinary brigade."
  }
];
