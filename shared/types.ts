export type UserType = {
  _id: string;
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  image?: string;
  role?: "user" | "admin" | "hotel_owner";
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    zipCode?: string;
  };
  preferences?: {
    preferredDestinations?: string[];
    preferredHotelTypes?: string[];
    budgetRange?: {
      min?: number;
      max?: number;
    };
  };
  wishlist?: string[];
  totalBookings?: number;
  totalSpent?: number;
  lastLogin?: Date | string;
  isActive?: boolean;
  emailVerified?: boolean;
  createdAt?: Date | string;
  updatedAt?: Date | string;
};

export type BookingType = {
  _id: string;
  userId: string;
  hotelId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  adultCount: number;
  childCount: number;
  checkIn: Date | string;
  checkOut: Date | string;
  totalCost: number;
  status: "pending" | "confirmed" | "cancelled" | "completed" | "refunded";
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  paymentMethod?: string;
  specialRequests?: string;
  cancellationReason?: string;
  refundAmount?: number;
  stripePaymentIntentId?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
};

export type HotelType = {
  _id: string;
  userId: string;
  name: string;
  city: string;
  country: string;
  description: string;
  type: string[];
  adultCount: number;
  childCount: number;
  facilities: string[];
  pricePerNight: number;
  starRating: number;
  imageUrls: string[];
  lastUpdated: Date | string;
  bookings?: BookingType[];
  location?: {
    latitude?: number;
    longitude?: number;
    address?: {
      street?: string;
      city?: string;
      state?: string;
      country?: string;
      zipCode?: string;
    };
  };
  contact?: {
    phone?: string;
    email?: string;
    website?: string;
  };
  policies?: {
    checkInTime?: string;
    checkOutTime?: string;
    cancellationPolicy?: string;
    petPolicy?: string;
    smokingPolicy?: string;
  };
  amenities?: {
    parking?: boolean;
    wifi?: boolean;
    pool?: boolean;
    gym?: boolean;
    spa?: boolean;
    restaurant?: boolean;
    bar?: boolean;
    airportShuttle?: boolean;
    businessCenter?: boolean;
  };
  totalBookings?: number;
  upcomingBookings?: number;
  completedBookings?: number;
  cancelledBookings?: number;
  totalRevenue?: number;
  averageRating?: number;
  reviewCount?: number;
  occupancyRate?: number;
  isActive?: boolean;
  isFeatured?: boolean;
  createdAt?: Date | string;
  updatedAt?: Date | string;
};

export type HotelSearchResponse = {
  data: HotelType[];
  pagination: {
    total: number;
    page: number;
    pages: number;
  };
};

export type PaymentIntentResponse = {
  paymentIntentId: string;
  clientSecret: string;
  totalCost: number;
  demoMode?: boolean;
};

export type HotelWithBookingsType = HotelType & {
  bookings: BookingType[];
};

export type ReviewType = {
  _id: string;
  userId: string;
  hotelId: string;
  bookingId: string;
  rating: number;
  comment: string;
  categories: {
    cleanliness: number;
    service: number;
    location: number;
    value: number;
    amenities: number;
  };
  isVerified: boolean;
  helpfulCount: number;
  createdAt: Date | string;
  updatedAt: Date | string;
};
