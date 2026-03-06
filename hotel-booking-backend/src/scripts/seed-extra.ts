/**
 * Add extra demo data on top of npm run seed (no wiping).
 * Usage: npx ts-node -T src/scripts/seed-extra.ts
 */
import "dotenv/config";
import mongoose from "mongoose";
import User from "../models/user";
import Hotel from "../models/hotel";
import Booking from "../models/booking";
import Review from "../models/review";

const uri = process.env.MONGODB_CONNECTION_STRING as string;

const IMG = [
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
  "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800",
  "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800",
  "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800",
  "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800",
  "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800",
];

const daysAgo = (n: number) => new Date(Date.now() - n * 86400000);
const daysFromNow = (n: number) => new Date(Date.now() + n * 86400000);

async function main() {
  await mongoose.connect(uri);
  console.log("Connected.");

  const owner = await User.findOne({ email: "owner@hotel.com" });
  const admin = await User.findOne({ email: "test@user.com" });
  const guest = await User.findOne({ email: "guest@user.com" });
  if (!owner || !admin || !guest) throw new Error("Run npm run seed first");

  const existing = await Hotel.countDocuments();
  if (existing > 3) {
    console.log(`Extra data already present (${existing} hotels). Skipping.`);
    await mongoose.disconnect();
    return;
  }

  type Spec = {
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
    images: number[];
    lat: number;
    lng: number;
    street: string;
    zipCode: string;
    slug: string;
    featured: boolean;
    occupancyRate: number;
  };

  const specs: Spec[] = [
    { name: "Bath Crescent Residency", city: "Bath", country: "United Kingdom", description: "Georgian townhouse elegance minutes from the Roman Baths.", type: ["Boutique", "Luxury"], adultCount: 2, childCount: 1, facilities: ["Free WiFi", "Spa", "Restaurant", "Bar"], pricePerNight: 210, starRating: 5, images: [3, 4], lat: 51.3811, lng: -2.3591, street: "12 Great Pulteney St", zipCode: "BA2 4JG", slug: "bathcrescent", featured: true, occupancyRate: 81 },
    { name: "Manchester Northern Lofts", city: "Manchester", country: "United Kingdom", description: "Industrial-chic lofts in the heart of the Northern Quarter.", type: ["Apartment"], adultCount: 3, childCount: 1, facilities: ["Free WiFi", "Kitchenette", "Parking"], pricePerNight: 110, starRating: 4, images: [4, 5], lat: 53.483, lng: -2.2388, street: "44 Edge Street", zipCode: "M4 1HN", slug: "northernlofts", featured: false, occupancyRate: 70 },
    { name: "York Minster Gate House", city: "York", country: "United Kingdom", description: "Cosy rooms overlooking the Minster with medieval charm.", type: ["Hotel", "Family"], adultCount: 4, childCount: 2, facilities: ["Free WiFi", "Family Rooms", "Restaurant"], pricePerNight: 135, starRating: 4, images: [5, 0], lat: 53.9623, lng: -1.0819, street: "8 Minster Gates", zipCode: "YO1 7HL", slug: "minstergate", featured: false, occupancyRate: 76 },
    { name: "Brighton Seafront Pods", city: "Brighton", country: "United Kingdom", description: "Playful sea-view pods steps from the Palace Pier.", type: ["Budget"], adultCount: 2, childCount: 0, facilities: ["Free WiFi", "Bar"], pricePerNight: 75, starRating: 3, images: [0, 3], lat: 50.8194, lng: -0.1364, street: "3 Marine Parade", zipCode: "BN2 1TA", slug: "seapods", featured: false, occupancyRate: 68 },
    { name: "Glasgow West End Rooms", city: "Glasgow", country: "United Kingdom", description: "Victorian terraces turned bright modern rooms near the university.", type: ["Hotel"], adultCount: 2, childCount: 2, facilities: ["Free WiFi", "Non-Smoking Rooms", "Airport Shuttle"], pricePerNight: 88, starRating: 3, images: [1, 5], lat: 55.8719, lng: -4.2885, street: "21 Byres Road", zipCode: "G11 5RD", slug: "westendrooms", featured: false, occupancyRate: 62 },
    { name: "Cambridge College Retreat", city: "Cambridge", country: "United Kingdom", description: "Quiet garden-square retreat with college-style dining hall.", type: ["Boutique", "Resort"], adultCount: 2, childCount: 1, facilities: ["Free WiFi", "Spa", "Gym", "Restaurant", "Business Center"], pricePerNight: 165, starRating: 4, images: [2, 1], lat: 52.2053, lng: 0.1218, street: "5 Trumpington Street", zipCode: "CB2 1QA", slug: "collegeretreat", featured: true, occupancyRate: 79 },
  ];

  const hotels = [];
  let i = 0;
  for (const s of specs) {
    const h = await new Hotel({
      userId: i % 3 === 2 ? admin.id : owner.id,
      name: s.name,
      city: s.city,
      country: s.country,
      description: s.description,
      type: s.type,
      adultCount: s.adultCount,
      childCount: s.childCount,
      facilities: s.facilities,
      pricePerNight: s.pricePerNight,
      starRating: s.starRating,
      imageUrls: s.images.map((x) => IMG[x]),
      lastUpdated: new Date(),
      location: {
        latitude: s.lat,
        longitude: s.lng,
        address: { street: s.street, city: s.city, state: "", country: s.country, zipCode: s.zipCode },
      },
      contact: {
        phone: "+44 20 7000 00" + String(10 + i),
        email: `stay@${s.slug}.example`,
        website: `https://${s.slug}.example`,
      },
      policies: {
        checkInTime: "15:00",
        checkOutTime: "11:00",
        cancellationPolicy: "Free cancel 48h before check-in",
        petPolicy: i % 2 === 0 ? "Pets welcome (₹500/night)" : "No pets",
        smokingPolicy: "Non-smoking property",
      },
      amenities: {
        parking: s.facilities.includes("Parking"),
        wifi: true,
        pool: i % 3 === 0,
        gym: s.facilities.includes("Gym"),
        spa: s.facilities.includes("Spa"),
        restaurant: s.facilities.includes("Restaurant"),
        bar: s.facilities.includes("Bar"),
        airportShuttle: s.facilities.includes("Airport Shuttle"),
        businessCenter: s.facilities.includes("Business Center"),
      },
      totalBookings: 0,
      totalRevenue: 0,
      averageRating: 0,
      reviewCount: 0,
      occupancyRate: s.occupancyRate,
      isActive: true,
      isFeatured: s.featured,
    }).save();
    hotels.push(h);
    i++;
  }
  console.log(`Added ${hotels.length} hotels.`);

  const allHotels = [...(await Hotel.find({}))];
  const firstNames = ["Ava","Liam","Noah","Emma","Oliver","Sophia","Mia","Lucas","Isla","Ethan","Freya","Oscar"];
  const lastNames = ["Smith","Jones","Brown","Taylor","Wilson","Davies","Evans","Thomas","Roberts","Walker"];
  const statuses: Array<{ status: string; paymentStatus: string }> = [
    { status: "completed", paymentStatus: "paid" },
    { status: "confirmed", paymentStatus: "paid" },
    { status: "pending", paymentStatus: "pending" },
    { status: "cancelled", paymentStatus: "refunded" },
    { status: "completed", paymentStatus: "paid" },
  ];

  let created = 0;
  for (let d = 175; d >= -30; d += 5) {
    const hotel = allHotels[created % allHotels.length];
    const st = statuses[created % statuses.length];
    const fn = firstNames[created % firstNames.length];
    const ln = lastNames[(created * 3) % lastNames.length];
    const nights = 2 + (created % 3);
    const checkIn = d >= 0 ? daysFromNow(d) : daysFromNow(-d);
    const checkOut = new Date(checkIn.getTime() + nights * 86400000);
    const totalCost = hotel.pricePerNight * nights;
    await new Booking({
      userId: guest.id,
      hotelId: hotel.id,
      firstName: fn,
      lastName: ln,
      email: "guest@user.com",
      phone: "+44 7700 900" + String(100 + created),
      adultCount: 1 + (created % 3),
      childCount: created % 2,
      checkIn,
      checkOut,
      totalCost,
      status: st.status,
      paymentStatus: st.paymentStatus,
      paymentMethod: "card",
      specialRequests: "",
      stripePaymentIntentId: `pi_demo_${Date.now()}_${created}`,
      refundAmount: st.status === "cancelled" ? totalCost : 0,
      createdAt: daysAgo(Math.max(d, 1)),
      updatedAt: daysAgo(Math.max(d, 1)),
    }).save();
    created++;
  }
  console.log(`Added ${created} bookings.`);

  const completed = await Booking.find({ status: "completed" }).limit(14);
  const comments = [
    ["Fantastic location and lovely staff.", 5],
    ["Great value, would book again.", 4],
    ["Room was clean and check-in was smooth.", 5],
    ["Breakfast could be better, otherwise great.", 4],
    ["Perfect weekend base for exploring.", 5],
    ["Comfortable beds and quiet nights.", 4],
    ["Lovely building with modern touches.", 5],
    ["Good transport links nearby.", 4],
    ["Staff went above and beyond.", 5],
    ["Solid stay, minor noise at night.", 3],
    ["Beautiful views from the room.", 5],
    ["Spacious and spotless.", 5],
    ["Nice area, friendly cafe next door.", 4],
    ["Would recommend to friends.", 4],
  ] as const;
  let rc = 0;
  for (let x = 0; x < completed.length; x++) {
    const b = completed[x];
    const [comment, rating] = comments[x % comments.length];
    await new Review({
      userId: guest.id,
      hotelId: b.hotelId,
      bookingId: b.id,
      rating,
      comment,
      categories: { cleanliness: rating, service: rating, location: Math.min(5, rating + 1), value: rating, amenities: rating },
      isVerified: true,
      helpfulCount: (x * 7) % 25,
    }).save();
    rc++;
  }
  console.log(`Added ${rc} reviews.`);

  for (const h of allHotels) {
    const mine = await Booking.find({ hotelId: h.id });
    const paidActive = mine.filter((b) => b.paymentStatus === "paid" && b.status !== "cancelled" && b.status !== "refunded");
    h.totalBookings = paidActive.length;
    h.totalRevenue = paidActive.reduce((s, b) => s + (b.totalCost || 0), 0);
    const reviews = await Review.find({ hotelId: h.id });
    h.reviewCount = reviews.length;
    h.averageRating = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;
    await h.save();
  }
  console.log("Recomputed hotel totals.");

  await mongoose.disconnect();
  console.log("Done.");
}

main().catch(async (e) => {
  console.error(e);
  await mongoose.disconnect();
  process.exit(1);
});
