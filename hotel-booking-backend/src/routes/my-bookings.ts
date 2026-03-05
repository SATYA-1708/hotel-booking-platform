import express, { Request, Response } from "express";
import verifyToken from "../middleware/auth";
import Hotel from "../models/hotel";
import Booking from "../models/booking";

const router = express.Router();

// /api/my-bookings
router.get("/", verifyToken, async (req: Request, res: Response) => {
  try {
    const MAX_BOOKINGS = 500;

    // Cap result set so a runaway/flooded collection can't exhaust memory.
    const userBookings = await Booking.find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .limit(MAX_BOOKINGS);

    // Single batched hotel lookup instead of one query per booking (N+1).
    const hotelIds = [...new Set(userBookings.map((b) => String(b.hotelId)))];
    const hotels = await Hotel.find({ _id: { $in: hotelIds } });
    const hotelsById = new Map(hotels.map((h) => [String(h._id), h]));

    // Create response object with hotel and booking data (one entry per booking)
    const validResults = [];
    for (const booking of userBookings) {
      const hotel = hotelsById.get(String(booking.hotelId));
      if (!hotel) {
        continue;
      }
      validResults.push({
        ...hotel.toObject(),
        bookings: [booking.toObject()],
      });
    }

    res.status(200).send(validResults);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Unable to fetch bookings" });
  }
});

export default router;
