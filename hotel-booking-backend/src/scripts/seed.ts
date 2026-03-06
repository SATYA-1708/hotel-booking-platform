/**
 * Wipe + seed MongoDB demo data (Mongoose — not Prisma).
 *
 * Usage: npm run seed
 * Requires MONGODB_CONNECTION_STRING in .env
 *
 * Destroys: User, Hotel, Booking, Review, Analytics collections.
 * Creates test@user.com / 12345678 as admin (for /admin + manual testing).
 * India-localized demo data: top cities, INR pricing.
 */
import "dotenv/config";
import mongoose from "mongoose";
import User from "../models/user";
import Hotel from "../models/hotel";
import Booking from "../models/booking";
import Review from "../models/review";
import Analytics from "../models/analytics";

const IMG = [
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
  "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800",
  "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800",
];

const daysFromNow = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d;
};

const daysAgo = (n: number) => daysFromNow(-n);

async function seed() {
  const uri = process.env.MONGODB_CONNECTION_STRING;
  if (!uri) {
    console.error("Missing MONGODB_CONNECTION_STRING");
    process.exit(1);
  }

  const wantsTls =
    uri.includes("mongodb+srv://") ||
    /[?&]tls=true/i.test(uri) ||
    /[?&]ssl=true/i.test(uri);

  await mongoose.connect(uri, {
    ...(wantsTls
      ? { tls: true, tlsAllowInvalidCertificates: false }
      : {}),
  });
  console.log("Connected. Wiping demo collections…");

  await Promise.all([
    Review.deleteMany({}),
    Booking.deleteMany({}),
    Hotel.deleteMany({}),
    Analytics.deleteMany({}),
    User.deleteMany({}),
  ]);

  console.log("Seeding users (all schema fields)…");
  const admin = await new User({
    email: "test@user.com",
    password: "12345678",
    firstName: "Arjun",
    lastName: "Mehta",
    image: "https://i.pravatar.cc/150?u=admin",
    role: "admin",
    phone: "+91 98110 12345",
    address: {
      street: "12 Barakhamba Road",
      city: "New Delhi",
      state: "Delhi",
      country: "India",
      zipCode: "110001",
    },
    preferences: {
      preferredDestinations: ["New Delhi", "Jaipur", "Udaipur"],
      preferredHotelTypes: ["Boutique", "Luxury"],
      budgetRange: { min: 3000, max: 20000 },
    },
    totalBookings: 0,
    totalSpent: 0,
    lastLogin: daysAgo(0),
    emailVerified: true,
    isActive: true,
  }).save();

  const owner = await new User({
    email: "owner@hotel.com",
    password: "12345678",
    firstName: "Priya",
    lastName: "Sharma",
    image: "https://i.pravatar.cc/150?u=owner",
    role: "hotel_owner",
    phone: "+91 98200 54321",
    address: {
      street: "14 Marine Drive",
      city: "Mumbai",
      state: "Maharashtra",
      country: "India",
      zipCode: "400020",
    },
    preferences: {
      preferredDestinations: ["Mumbai", "Goa", "Jaipur"],
      preferredHotelTypes: ["Boutique", "Resort"],
      budgetRange: { min: 2500, max: 15000 },
    },
    totalBookings: 0,
    totalSpent: 0,
    lastLogin: daysAgo(1),
    emailVerified: true,
    isActive: true,
  }).save();

  const guest = await new User({
    email: "guest@user.com",
    password: "12345678",
    firstName: "Rahul",
    lastName: "Verma",
    image: "https://i.pravatar.cc/150?u=guest",
    role: "user",
    phone: "+91 99000 67890",
    address: {
      street: "88 MG Road",
      city: "Bengaluru",
      state: "Karnataka",
      country: "India",
      zipCode: "560001",
    },
    preferences: {
      preferredDestinations: ["Goa", "Jaipur", "Kochi"],
      preferredHotelTypes: ["Budget", "Resort"],
      budgetRange: { min: 1500, max: 12000 },
    },
    totalBookings: 0,
    totalSpent: 0,
    lastLogin: daysAgo(2),
    emailVerified: true,
    isActive: true,
  }).save();

  console.log("Seeding hotels (top Indian cities, INR pricing)…");
  const hotelSpecs = [
    {
      userId: owner.id,
      name: "Connaught Place Grand",
      city: "New Delhi",
      description:
        "Classic business hotel on the inner circle of Connaught Place, minutes from India Gate and Rajiv Chowk metro.",
      type: ["Hotel", "Business"],
      adultCount: 2,
      childCount: 1,
      facilities: ["Free WiFi", "Parking", "Restaurant", "Business Center"],
      pricePerNight: 6800,
      starRating: 4,
      images: [IMG[0], IMG[1]],
      lat: 28.6315, lng: 77.2167, street: "1 Inner Circle", state: "Delhi", zipCode: "110001",
      contactPhone: "+91 11 2345 6701", contactEmail: "stay@cpgrand.example",
      amenities: { parking: true, wifi: true, pool: false, gym: true, spa: false, restaurant: true, bar: true, airportShuttle: true, businessCenter: true },
      occupancyRate: 74, isFeatured: true,
    },
    {
      userId: owner.id,
      name: "Marine Drive Skyline Suites",
      city: "Mumbai",
      description:
        "Sea-facing suites along the Queen's Necklace with sunset views of the Arabian Sea and easy access to Nariman Point.",
      type: ["Luxury", "Hotel"],
      adultCount: 2,
      childCount: 2,
      facilities: ["Free WiFi", "Spa", "Restaurant", "Bar", "Gym"],
      pricePerNight: 12500,
      starRating: 5,
      images: [IMG[1], IMG[2]],
      lat: 18.9440, lng: 72.8230, street: "Netaji Subhash Road", state: "Maharashtra", zipCode: "400020",
      contactPhone: "+91 22 6666 0002", contactEmail: "stay@marinedrive.example",
      amenities: { parking: true, wifi: true, pool: true, gym: true, spa: true, restaurant: true, bar: true, airportShuttle: true, businessCenter: true },
      occupancyRate: 82, isFeatured: true,
    },
    {
      userId: owner.id,
      name: "Rajputana Heritage Haveli",
      city: "Jaipur",
      description:
        "Restored 200-year-old haveli with frescoed courtyards, rooftop views of Hawa Mahal and authentic Rajasthani thali dinners.",
      type: ["Boutique", "Hotel"],
      adultCount: 3,
      childCount: 1,
      facilities: ["Free WiFi", "Parking", "Spa", "Restaurant"],
      pricePerNight: 7800,
      starRating: 4,
      images: [IMG[2], IMG[0]],
      lat: 26.9239, lng: 75.8267, street: "Badi Chopad", state: "Rajasthan", zipCode: "302002",
      contactPhone: "+91 141 400 0003", contactEmail: "stay@rajputana.example",
      amenities: { parking: true, wifi: true, pool: true, gym: false, spa: true, restaurant: true, bar: false, airportShuttle: false, businessCenter: false },
      occupancyRate: 78, isFeatured: true,
    },
    {
      userId: admin.id,
      name: "Palolem Beach Cottages",
      city: "Goa",
      description:
        "Boho beach cottages steps from Palolem's crescent bay — kayaks at dawn, shacks at dusk.",
      type: ["Resort", "Family"],
      adultCount: 2,
      childCount: 2,
      facilities: ["Free WiFi", "Bar", "Airport Shuttle"],
      pricePerNight: 5400,
      starRating: 3,
      images: [IMG[0], IMG[2]],
      lat: 15.0107, lng: 74.0233, street: "Palolem Beach Road", state: "Goa", zipCode: "403702",
      contactPhone: "+91 832 225 0004", contactEmail: "stay@palolem.example",
      amenities: { parking: false, wifi: true, pool: false, gym: false, spa: false, restaurant: true, bar: true, airportShuttle: true, businessCenter: false },
      occupancyRate: 66, isFeatured: false,
    },
    {
      userId: admin.id,
      name: "Lake Pichola Retreat",
      city: "Udaipur",
      description:
        "Whitewashed lakeside retreat with jharokha balconies over Pichola, evening boat rides and City Palace views.",
      type: ["Luxury", "Resort"],
      adultCount: 2,
      childCount: 2,
      facilities: ["Free WiFi", "Parking", "Spa", "Restaurant", "Pool"],
      pricePerNight: 15500,
      starRating: 5,
      images: [IMG[2], IMG[1]],
      lat: 24.5711, lng: 73.6835, street: "Lal Ghat Road", state: "Rajasthan", zipCode: "313001",
      contactPhone: "+91 294 241 0005", contactEmail: "stay@pichola.example",
      amenities: { parking: true, wifi: true, pool: true, gym: true, spa: true, restaurant: true, bar: true, airportShuttle: false, businessCenter: false },
      occupancyRate: 85, isFeatured: true,
    },
    {
      userId: owner.id,
      name: "Indiranagar Business Inn",
      city: "Bengaluru",
      description:
        "Smart budget inn on 100 Feet Road — fast WiFi, work desks and filter coffee, walkable to pubs and metro.",
      type: ["Budget", "Hotel"],
      adultCount: 2,
      childCount: 0,
      facilities: ["Free WiFi", "Non-Smoking Rooms"],
      pricePerNight: 3200,
      starRating: 3,
      images: [IMG[1], IMG[0]],
      lat: 12.9719, lng: 77.6412, street: "100 Feet Road", state: "Karnataka", zipCode: "560038",
      contactPhone: "+91 80 4123 0006", contactEmail: "stay@indiranagar.example",
      amenities: { parking: false, wifi: true, pool: false, gym: false, spa: false, restaurant: true, bar: false, airportShuttle: false, businessCenter: false },
      occupancyRate: 69, isFeatured: false,
    },
    {
      userId: owner.id,
      name: "Fort Kochi Heritage Villa",
      city: "Kochi",
      description:
        "Colonial-era villa among Chinese fishing nets and cafés — courtyard breakfasts and Kathakali evenings.",
      type: ["Boutique", "Family"],
      adultCount: 4,
      childCount: 2,
      facilities: ["Free WiFi", "Family Rooms", "Restaurant"],
      pricePerNight: 5900,
      starRating: 4,
      images: [IMG[0], IMG[1]],
      lat: 9.9652, lng: 76.2420, street: "Princess Street", state: "Kerala", zipCode: "682001",
      contactPhone: "+91 484 220 0007", contactEmail: "stay@fortkochi.example",
      amenities: { parking: true, wifi: true, pool: false, gym: false, spa: false, restaurant: true, bar: false, airportShuttle: true, businessCenter: false },
      occupancyRate: 71, isFeatured: false,
    },
    {
      userId: admin.id,
      name: "Shimla Pine View Lodge",
      city: "Shimla",
      description:
        "Cosy wooden lodge amid deodar forests on Mall Road ridge — mountain views, bonfires and hot pakoras.",
      type: ["Budget", "Family"],
      adultCount: 3,
      childCount: 1,
      facilities: ["Free WiFi", "Family Rooms", "Parking"],
      pricePerNight: 4100,
      starRating: 3,
      images: [IMG[1], IMG[2]],
      lat: 31.1048, lng: 77.1734, street: "The Mall", state: "Himachal Pradesh", zipCode: "171001",
      contactPhone: "+91 177 265 0008", contactEmail: "stay@pineview.example",
      amenities: { parking: true, wifi: true, pool: false, gym: false, spa: false, restaurant: true, bar: false, airportShuttle: false, businessCenter: false },
      occupancyRate: 63, isFeatured: false,
    },
    {
      userId: owner.id,
      name: "Ganga View Ghats Residence",
      city: "Varanasi",
      description:
        "Riverside guesthouse above Assi Ghat — sunrise aarti from the terrace and boat rides at dawn.",
      type: ["Boutique", "Budget"],
      adultCount: 2,
      childCount: 1,
      facilities: ["Free WiFi", "Restaurant"],
      pricePerNight: 3600,
      starRating: 3,
      images: [IMG[2], IMG[0]],
      lat: 25.2867, lng: 83.0066, street: "Assi Ghat Lane", state: "Uttar Pradesh", zipCode: "221005",
      contactPhone: "+91 542 220 0009", contactEmail: "stay@gangaview.example",
      amenities: { parking: false, wifi: true, pool: false, gym: false, spa: false, restaurant: true, bar: false, airportShuttle: false, businessCenter: false },
      occupancyRate: 58, isFeatured: false,
    },
  ];

  const hotels = [];
  for (const s of hotelSpecs) {
    const h = await new Hotel({
      userId: s.userId,
      name: s.name,
      city: s.city,
      country: "India",
      description: s.description,
      type: s.type,
      adultCount: s.adultCount,
      childCount: s.childCount,
      facilities: s.facilities,
      pricePerNight: s.pricePerNight,
      starRating: s.starRating,
      imageUrls: s.images,
      lastUpdated: new Date(),
      location: {
        latitude: s.lat,
        longitude: s.lng,
        address: {
          street: s.street,
          city: s.city,
          state: s.state,
          country: "India",
          zipCode: s.zipCode,
        },
      },
      contact: {
        phone: s.contactPhone,
        email: s.contactEmail,
        website: `https://${s.contactEmail.split("@")[1].split(".")[0]}.example`,
      },
      policies: {
        checkInTime: "14:00",
        checkOutTime: "11:00",
        cancellationPolicy: "Free cancel 48h before check-in",
        petPolicy: "Pets not allowed",
        smokingPolicy: "Non-smoking property",
      },
      amenities: s.amenities,
      totalBookings: 0,
      totalRevenue: 0,
      averageRating: 0,
      reviewCount: 0,
      occupancyRate: s.occupancyRate,
      isActive: true,
      isFeatured: s.isFeatured,
    }).save();
    hotels.push(h);
  }

  const byName = (n: string) => hotels.find((h) => h.name === n)!;

  console.log("Seeding bookings (status × paymentStatus matrix)…");
  const bookingSpecs: Array<{
    hotelName: string;
    userId: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    adultCount: number;
    childCount: number;
    status: "pending" | "confirmed" | "cancelled" | "completed" | "refunded";
    paymentStatus: "pending" | "paid" | "failed" | "refunded";
    specialRequests?: string;
    checkIn: Date;
    checkOut: Date;
    createdAt: Date;
    stripePaymentIntentId?: string;
    cancellationReason?: string;
    refundAmount?: number;
  }> = [
    { hotelName: "Marine Drive Skyline Suites", userId: guest.id, firstName: "Rahul", lastName: "Verma", email: "guest@user.com", phone: "+91 99000 67890", adultCount: 2, childCount: 1, status: "confirmed", paymentStatus: "paid", specialRequests: "High floor sea view", checkIn: daysFromNow(14), checkOut: daysFromNow(17), createdAt: daysAgo(2), stripePaymentIntentId: "pi_seed_upcoming_paid" },
    { hotelName: "Palolem Beach Cottages", userId: guest.id, firstName: "Rahul", lastName: "Verma", email: "guest@user.com", phone: "+91 99000 67890", adultCount: 2, childCount: 0, status: "pending", paymentStatus: "pending", specialRequests: "Late check-in after 21:00", checkIn: daysFromNow(30), checkOut: daysFromNow(32), createdAt: daysAgo(1) },
    { hotelName: "Connaught Place Grand", userId: guest.id, firstName: "Rahul", lastName: "Verma", email: "guest@user.com", phone: "+91 99000 67890", adultCount: 2, childCount: 0, status: "cancelled", paymentStatus: "refunded", specialRequests: "", checkIn: daysFromNow(10), checkOut: daysFromNow(12), createdAt: daysAgo(5), stripePaymentIntentId: "pi_seed_cancelled_refunded", cancellationReason: "Change of plans", refundAmount: 13600 },
    { hotelName: "Fort Kochi Heritage Villa", userId: guest.id, firstName: "Rahul", lastName: "Verma", email: "guest@user.com", phone: "+91 99000 67890", adultCount: 2, childCount: 0, status: "completed", paymentStatus: "paid", specialRequests: "Quiet room", checkIn: daysAgo(20), checkOut: daysAgo(17), createdAt: daysAgo(40), stripePaymentIntentId: "pi_seed_completed_paid" },
    { hotelName: "Rajputana Heritage Haveli", userId: guest.id, firstName: "Rahul", lastName: "Verma", email: "guest@user.com", phone: "+91 99000 67890", adultCount: 2, childCount: 1, status: "confirmed", paymentStatus: "paid", specialRequests: "Courtyard view room", checkIn: daysFromNow(21), checkOut: daysFromNow(24), createdAt: daysAgo(3), stripePaymentIntentId: "pi_seed_jaipur_confirmed" },
    { hotelName: "Ganga View Ghats Residence", userId: guest.id, firstName: "Rahul", lastName: "Verma", email: "guest@user.com", phone: "+91 99000 67890", adultCount: 2, childCount: 1, status: "pending", paymentStatus: "failed", specialRequests: "Accessible room", checkIn: daysFromNow(7), checkOut: daysFromNow(9), createdAt: daysAgo(0) },
    { hotelName: "Lake Pichola Retreat", userId: admin.id, firstName: "Arjun", lastName: "Mehta", email: "test@user.com", phone: "+91 98110 12345", adultCount: 2, childCount: 0, status: "completed", paymentStatus: "paid", specialRequests: "Anniversary setup", checkIn: daysAgo(10), checkOut: daysAgo(8), createdAt: daysAgo(25), stripePaymentIntentId: "pi_seed_admin_completed" },
    { hotelName: "Shimla Pine View Lodge", userId: admin.id, firstName: "Arjun", lastName: "Mehta", email: "test@user.com", phone: "+91 98110 12345", adultCount: 2, childCount: 1, status: "confirmed", paymentStatus: "paid", specialRequests: "", checkIn: daysFromNow(18), checkOut: daysFromNow(21), createdAt: daysAgo(4), stripePaymentIntentId: "pi_seed_admin_shimla" },
    { hotelName: "Indiranagar Business Inn", userId: owner.id, firstName: "Priya", lastName: "Sharma", email: "owner@hotel.com", phone: "+91 98200 54321", adultCount: 1, childCount: 0, status: "completed", paymentStatus: "paid", specialRequests: "Early check-in", checkIn: daysAgo(6), checkOut: daysAgo(5), createdAt: daysAgo(20), stripePaymentIntentId: "pi_seed_owner_bengaluru" },
  ];

  const nightsOf = (a: Date, b: Date) =>
    Math.round((b.getTime() - a.getTime()) / 86400000);

  const savedBookings = [];
  for (const spec of bookingSpecs) {
    const hotel = byName(spec.hotelName);
    const nights = Math.max(nightsOf(spec.checkIn, spec.checkOut), 1);
    const b = await new Booking({
      userId: spec.userId,
      hotelId: hotel.id,
      firstName: spec.firstName,
      lastName: spec.lastName,
      email: spec.email,
      phone: spec.phone,
      adultCount: spec.adultCount,
      childCount: spec.childCount,
      checkIn: spec.checkIn,
      checkOut: spec.checkOut,
      totalCost: hotel.pricePerNight * nights,
      status: spec.status,
      paymentStatus: spec.paymentStatus,
      paymentMethod: "card",
      specialRequests: spec.specialRequests || "",
      stripePaymentIntentId: spec.stripePaymentIntentId,
      cancellationReason: spec.cancellationReason,
      refundAmount: spec.refundAmount || 0,
      createdAt: spec.createdAt,
      updatedAt: spec.createdAt,
    }).save();
    savedBookings.push(b);
  }

  const paidActive = savedBookings.filter(
    (b) =>
      b.paymentStatus === "paid" &&
      b.status !== "cancelled" &&
      b.status !== "refunded"
  );
  for (const hotel of hotels) {
    const mine = paidActive.filter((b) => String(b.hotelId) === String(hotel.id));
    hotel.totalBookings = mine.length;
    hotel.totalRevenue = mine.reduce((s, b) => s + (b.totalCost || 0), 0);
    await hotel.save();
  }

  console.log("Seeding reviews…");
  const reviewSpecs = [
    { bookingIdx: savedBookings.findIndex((b) => b.stripePaymentIntentId === "pi_seed_completed_paid"), rating: 5, comment: "Wonderful heritage stay — staff were warm and the Kerala breakfast was superb.", categories: { cleanliness: 5, service: 5, location: 5, value: 4, amenities: 5 }, helpfulCount: 12 },
    { bookingIdx: savedBookings.findIndex((b) => b.stripePaymentIntentId === "pi_seed_admin_completed"), rating: 5, comment: "Magical lake views from the balcony. The evening boat ride arranged by the hotel was unforgettable.", categories: { cleanliness: 5, service: 5, location: 5, value: 4, amenities: 5 }, helpfulCount: 9 },
    { bookingIdx: savedBookings.findIndex((b) => b.stripePaymentIntentId === "pi_seed_owner_bengaluru"), rating: 4, comment: "Great value for business trips — fast WiFi and quiet rooms.", categories: { cleanliness: 4, service: 4, location: 5, value: 5, amenities: 3 }, helpfulCount: 3 },
  ];
  for (const rs of reviewSpecs) {
    if (rs.bookingIdx < 0) continue;
    const b = savedBookings[rs.bookingIdx];
    await new Review({
      userId: b.userId,
      hotelId: b.hotelId,
      bookingId: b.id,
      rating: rs.rating,
      comment: rs.comment,
      categories: rs.categories,
      isVerified: true,
      helpfulCount: rs.helpfulCount,
    }).save();
  }

  for (const hotel of hotels) {
    const reviews = await Review.find({ hotelId: hotel.id });
    if (reviews.length) {
      hotel.reviewCount = reviews.length;
      hotel.averageRating =
        Math.round(
          (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length) * 10
        ) / 10;
      await hotel.save();
    }
  }

  console.log("Seeding analytics snapshot…");
  await Analytics.create({
    date: new Date(),
    metrics: {
      totalBookings: savedBookings.length,
      totalRevenue: paidActive.reduce((s, b) => s + (b.totalCost || 0), 0),
      totalUsers: 3,
      totalHotels: hotels.length,
      averageBookingValue: 21000,
      conversionRate: 64.2,
      cancellationRate: 11.1,
      averageRating: 4.6,
    },
    breakdown: {
      byStatus: {
        pending: 2,
        confirmed: 3,
        cancelled: 1,
        completed: 3,
        refunded: 0,
      },
      byPaymentStatus: {
        pending: 1,
        paid: 7,
        failed: 1,
        refunded: 1,
      },
      byDestination: [
        { city: "Mumbai", bookings: 1, revenue: 37500 },
        { city: "Udaipur", bookings: 1, revenue: 31000 },
        { city: "Jaipur", bookings: 1, revenue: 23400 },
        { city: "Kochi", bookings: 1, revenue: 17700 },
      ],
      byHotelType: [
        { type: "Luxury", bookings: 2, revenue: 68500 },
        { type: "Boutique", bookings: 2, revenue: 25250 },
        { type: "Resort", bookings: 1, revenue: 10800 },
        { type: "Budget", bookings: 3, revenue: 15400 },
      ],
    },
  });

  guest.totalBookings = paidActive.filter((b) => String(b.userId) === String(guest.id)).length;
  guest.totalSpent = paidActive
    .filter((b) => String(b.userId) === String(guest.id))
    .reduce((s, b) => s + (b.totalCost || 0), 0);
  await guest.save();

  owner.totalBookings = paidActive.filter((b) => String(b.userId) === String(owner.id)).length;
  owner.totalSpent = paidActive
    .filter((b) => String(b.userId) === String(owner.id))
    .reduce((s, b) => s + (b.totalCost || 0), 0);
  await owner.save();

  admin.totalBookings = paidActive.filter((b) => String(b.userId) === String(admin.id)).length;
  admin.totalSpent = paidActive
    .filter((b) => String(b.userId) === String(admin.id))
    .reduce((s, b) => s + (b.totalCost || 0), 0);
  await admin.save();

  console.log("Seed complete.");
  console.log("  Admin login: test@user.com / 12345678 (role=admin)");
  console.log("  Owner login: owner@hotel.com / 12345678");
  console.log("  Guest login: guest@user.com / 12345678");
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
