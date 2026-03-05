/**
 * Enrich existing demo data — no wiping.
 * Adds bookings across the last ~6 months + reviews, then recomputes totals.
 * Usage: npx ts-node -T src/scripts/enrich-demo.ts
 */
import "dotenv/config";
import mongoose from "mongoose";
import User from "../models/user";
import Hotel from "../models/hotel";
import Booking from "../models/booking";
import Review from "../models/review";

const uri = process.env.MONGODB_CONNECTION_STRING as string;

const daysAgo = (n: number) => new Date(Date.now() - n * 86400000);
const daysFromNow = (n: number) => new Date(Date.now() + n * 86400000);

const FIRST = ["Aarav", "Diya", "Kabir", "Anaya", "Vivaan", "Ishita", "Arjun", "Meera", "Rohan", "Sneha", "Aditya", "Pooja"];
const LAST = ["Patel", "Nair", "Khan", "Iyer", "Reddy", "Bose", "Gupta", "Menon", "Joshi", "Das"];

const STATUSES: Array<{ status: string; paymentStatus: string }> = [
  { status: "completed", paymentStatus: "paid" },
  { status: "confirmed", paymentStatus: "paid" },
  { status: "pending", paymentStatus: "pending" },
  { status: "cancelled", paymentStatus: "refunded" },
];

async function main() {
  await mongoose.connect(uri);
  console.log("Connected.");

  const users = await User.find({});
  const hotels = await Hotel.find({});
  if (!users.length || !hotels.length) throw new Error("Run npm run seed first");
  const guests = users.filter((u) => u.role !== "admin");

  const beforeBookings = await Booking.countDocuments();
  const beforeReviews = await Review.countDocuments();

  // ~36 bookings spread over the past 180 days + some upcoming
  let created = 0;
  for (let i = 0; i < 36; i++) {
    const hotel = hotels[i % hotels.length];
    const user = guests[i % guests.length];
    const st = STATUSES[i % STATUSES.length];
    const fn = FIRST[(i * 5) % FIRST.length];
    const ln = LAST[(i * 3) % LAST.length];
    const nights = 1 + (i % 4);

    const checkIn = i % 6 === 0 ? daysFromNow(2 + (i % 40)) : daysAgo((i * 5) % 180);
    const checkOut = new Date(checkIn.getTime() + nights * 86400000);

    const totalCost = hotel.pricePerNight * nights;
    const createdAt = new Date(Math.min(checkIn.getTime() - 86400000, Date.now()));

    await new Booking({
      userId: user.id,
      hotelId: hotel.id,
      firstName: fn,
      lastName: ln,
      email: user.email,
      phone: "+91 98xxx xxx" + String(10 + (i % 90)),
      adultCount: 1 + (i % 3),
      childCount: i % 3,
      checkIn,
      checkOut,
      totalCost,
      status: st.status,
      paymentStatus: st.paymentStatus,
      paymentMethod: "card",
      specialRequests: "",
      stripePaymentIntentId: `pi_demo_${Date.now()}_${i}`,
      refundAmount: st.paymentStatus === "refunded" ? totalCost : 0,
      createdAt,
      updatedAt: createdAt,
    }).save();
    created++;
  }
  console.log(`Added ${created} bookings.`);

  // Reviews on completed paid bookings that don't have one yet
  const completed = await Booking.find({ status: "completed", paymentStatus: "paid" }).limit(60);
  const comments = [
    [5, "Fantastic location and warm staff. Would absolutely stay again."],
    [4, "Great value for money, smooth check-in and clean rooms."],
    [5, "Breakfast spread was superb and the views were stunning."],
    [3, "Decent stay overall but the room could use a refresh."],
    [4, "Comfortable beds, quiet nights, helpful concierge."],
    [5, "Perfect base for exploring the city — highly recommended."],
    [4, "Lovely property with modern touches and great service."],
    [5, "Spotless rooms and the rooftop dinner was a highlight."],
  ] as const;

  let rc = 0;
  for (let x = 0; x < completed.length; x++) {
    const b = completed[x];
    const exists = await Review.findOne({ bookingId: b.id });
    if (exists) continue;
    const [rating, comment] = comments[x % comments.length];
    await new Review({
      userId: b.userId,
      hotelId: b.hotelId,
      bookingId: b.id,
      rating,
      comment,
      categories: {
        cleanliness: rating,
        service: Math.min(5, rating + 1),
        location: rating,
        value: Math.max(3, rating - 1),
        amenities: rating,
      },
      isVerified: true,
      helpfulCount: (x * 11) % 30,
      createdAt: b.checkOut,
    }).save();
    rc++;
  }
  console.log(`Added ${rc} reviews.`);

  // Recompute hotel totals
  for (const h of hotels) {
    const mine = await Booking.find({ hotelId: h.id });
    const paidActive = mine.filter(
      (b) => b.paymentStatus === "paid" && b.status !== "cancelled" && b.status !== "refunded"
    );
    h.totalBookings = paidActive.length;
    h.totalRevenue = paidActive.reduce((s, b) => s + (b.totalCost || 0), 0);
    const reviews = await Review.find({ hotelId: h.id });
    h.reviewCount = reviews.length;
    h.averageRating = reviews.length
      ? Math.round((reviews.reduce((s, r) => s + r.rating, 0) / reviews.length) * 10) / 10
      : 0;
    await h.save();
  }

  // Recompute user totals
  for (const u of users) {
    const mine = await Booking.find({ userId: u.id });
    const paidActive = mine.filter(
      (b) => b.paymentStatus === "paid" && b.status !== "cancelled" && b.status !== "refunded"
    );
    u.totalBookings = paidActive.length;
    u.totalSpent = paidActive.reduce((s, b) => s + (b.totalCost || 0), 0);
    await u.save();
  }
  console.log("Recomputed hotel + user totals.");

  const afterBookings = await Booking.countDocuments();
  const afterReviews = await Review.countDocuments();
  console.log(
    `Totals now: ${hotels.length} hotels, ${afterBookings} bookings (was ${beforeBookings}), ${afterReviews} reviews (was ${beforeReviews})`
  );

  await mongoose.disconnect();
  console.log("Done.");
}

main().catch(async (e) => {
  console.error(e);
  await mongoose.disconnect();
  process.exit(1);
});
