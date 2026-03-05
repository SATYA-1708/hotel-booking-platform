/**
 * Ensure the 3 demo role-accounts exist — WITHOUT wiping any collections.
 *
 * Usage: npm run users:test
 * Creates or fixes: test@user.com (admin), owner@hotel.com (hotel_owner),
 * guest@user.com (user) — password 12345678 for all.
 */
import "dotenv/config";
import mongoose from "mongoose";
import User from "../models/user";

type Spec = {
  email: string;
  role: "admin" | "hotel_owner" | "user";
  firstName: string;
  lastName: string;
  image: string;
};

const SPECS: Spec[] = [
  {
    email: "test@user.com",
    role: "admin",
    firstName: "Test",
    lastName: "Admin",
    image: "https://i.pravatar.cc/150?u=admin",
  },
  {
    email: "owner@hotel.com",
    role: "hotel_owner",
    firstName: "Hotel",
    lastName: "Owner",
    image: "https://i.pravatar.cc/150?u=owner",
  },
  {
    email: "guest@user.com",
    role: "user",
    firstName: "Guest",
    lastName: "Traveler",
    image: "https://i.pravatar.cc/150?u=guest",
  },
];

const PASSWORD = "12345678";

async function ensureTestUsers() {
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
    ...(wantsTls ? { tls: true, tlsAllowInvalidCertificates: false } : {}),
  });
  console.log("Connected.");

  let created = 0;
  let updated = 0;

  for (const spec of SPECS) {
    const user = await User.findOne({ email: spec.email });

    if (!user) {
      await new User({
        email: spec.email,
        password: PASSWORD,
        firstName: spec.firstName,
        lastName: spec.lastName,
        image: spec.image,
        role: spec.role,
        emailVerified: true,
        isActive: true,
        totalBookings: 0,
        totalSpent: 0,
      }).save();
      created += 1;
      console.log(`created ${spec.email} (role=${spec.role})`);
    } else if (user.role !== spec.role) {
      user.role = spec.role;
      await user.save();
      updated += 1;
      console.log(`updated ${spec.email} role -> ${spec.role}`);
    } else {
      console.log(`ok ${spec.email} (role=${spec.role})`);
    }
  }

  console.log(`Done. created=${created} updated=${updated}`);
  await mongoose.disconnect();
}

ensureTestUsers().catch((err) => {
  console.error(err);
  process.exit(1);
});
