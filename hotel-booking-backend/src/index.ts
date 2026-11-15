import express, { Request, Response } from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import userRoutes from "./routes/users";
import authRoutes from "./routes/auth";
import cookieParser from "cookie-parser";
import path from "path";
import { v2 as cloudinary } from "cloudinary";
import myHotelRoutes from "./routes/my-hotels";
import hotelRoutes from "./routes/hotels";
import bookingRoutes from "./routes/my-bookings";
import bookingsManagementRoutes from "./routes/bookings";
import healthRoutes from "./routes/health";
import businessInsightsRoutes from "./routes/business-insights";
import reviewRoutes from "./routes/reviews";
import analyticsRoutes from "./routes/analytics";
import aiRoutes from "./routes/ai";
import swaggerUi from "swagger-ui-express";
import { specs } from "./swagger";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import rateLimit from "express-rate-limit";
import User from "./models/user";
import Hotel from "./models/hotel";

// Environment Variables Validation - Core required variables
const requiredEnvVars = [
  "MONGODB_CONNECTION_STRING",
  "JWT_SECRET_KEY",
];

// Safe fallbacks for media & payment integrations if not yet configured
if (!process.env.CLOUDINARY_CLOUD_NAME) process.env.CLOUDINARY_CLOUD_NAME = "demo";
if (!process.env.CLOUDINARY_API_KEY) process.env.CLOUDINARY_API_KEY = "demo";
if (!process.env.CLOUDINARY_API_SECRET) process.env.CLOUDINARY_API_SECRET = "demo";
if (!process.env.STRIPE_API_KEY) process.env.STRIPE_API_KEY = "placeholder";

const missingEnvVars = requiredEnvVars.filter((envVar) => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.error("❌ Missing required environment variables:");
  missingEnvVars.forEach((envVar) => console.error(`   - ${envVar}`));
  process.exit(1);
}

console.log("✅ All required environment variables are present");
console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
console.log(`🔗 Frontend URL: ${process.env.FRONTEND_URL || "Not set"}`);
console.log(
  `🔗 Backend URL: ${process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 5001}`}`
);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

console.log("☁️  Cloudinary configured successfully");

// Auto-seed demo users & default hotels for fresh databases
const ensureDemoData = async () => {
  try {
    const SPECS = [
      {
        email: "test@user.com",
        role: "admin" as const,
        firstName: "Test",
        lastName: "Admin",
        image: "https://i.pravatar.cc/150?u=admin",
      },
      {
        email: "owner@hotel.com",
        role: "hotel_owner" as const,
        firstName: "Hotel",
        lastName: "Owner",
        image: "https://i.pravatar.cc/150?u=owner",
      },
      {
        email: "guest@user.com",
        role: "user" as const,
        firstName: "Guest",
        lastName: "Traveler",
        image: "https://i.pravatar.cc/150?u=guest",
      },
    ];

    for (const spec of SPECS) {
      const user = await User.findOne({ email: spec.email });
      if (!user) {
        await new User({
          email: spec.email,
          password: "12345678",
          firstName: spec.firstName,
          lastName: spec.lastName,
          image: spec.image,
          role: spec.role,
          emailVerified: true,
          isActive: true,
          totalBookings: 0,
          totalSpent: 0,
        }).save();
        console.log(`✅ Demo user created: ${spec.email} (password: 12345678)`);
      }
    }

    const hotelCount = await Hotel.countDocuments();
    if (hotelCount === 0) {
      console.log("🌱 Database has no hotels. Seeding default hotels catalog...");
      const ownerUser = await User.findOne({ email: "owner@hotel.com" }) || await User.findOne({});
      const ownerId = ownerUser ? ownerUser.id : "demo_owner";

      const defaultHotels = [
        {
          userId: ownerId,
          name: "Connaught Place Grand",
          city: "New Delhi",
          country: "India",
          description: "Classic business hotel on the inner circle of Connaught Place, minutes from India Gate and Rajiv Chowk metro.",
          type: ["Hotel", "Business"],
          adultCount: 2,
          childCount: 1,
          facilities: ["Free WiFi", "Parking", "Restaurant", "Business Center"],
          pricePerNight: 6800,
          starRating: 4,
          imageUrls: [
            "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
            "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800"
          ],
          lastUpdated: new Date(),
        },
        {
          userId: ownerId,
          name: "Marine Drive Skyline Suites",
          city: "Mumbai",
          country: "India",
          description: "Sea-facing suites along the Queen's Necklace with sunset views of the Arabian Sea and easy access to Nariman Point.",
          type: ["Luxury", "Hotel"],
          adultCount: 2,
          childCount: 2,
          facilities: ["Free WiFi", "Spa", "Restaurant", "Bar", "Gym"],
          pricePerNight: 12500,
          starRating: 5,
          imageUrls: [
            "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800",
            "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800"
          ],
          lastUpdated: new Date(),
        },
        {
          userId: ownerId,
          name: "Lake Pichola Retreat",
          city: "Udaipur",
          country: "India",
          description: "Heritage-inspired boutique retreat on the calm shores of Lake Pichola with rooftop dining facing the City Palace.",
          type: ["Resort", "Romantic"],
          adultCount: 2,
          childCount: 0,
          facilities: ["Free WiFi", "Swimming Pool", "Spa", "Restaurant"],
          pricePerNight: 9800,
          starRating: 5,
          imageUrls: [
            "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800",
            "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800"
          ],
          lastUpdated: new Date(),
        },
        {
          userId: ownerId,
          name: "Candolim Beach Resort",
          city: "Goa",
          country: "India",
          description: "Tropical beachfront resort steps from Candolim Beach with private cabanas, pool bar, and water-sport concierge.",
          type: ["Resort", "Beach"],
          adultCount: 2,
          childCount: 2,
          facilities: ["Free WiFi", "Swimming Pool", "Bar", "Restaurant", "Spa"],
          pricePerNight: 7500,
          starRating: 4,
          imageUrls: [
            "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
            "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800"
          ],
          lastUpdated: new Date(),
        },
        {
          userId: ownerId,
          name: "Rajputana Heritage Haveli",
          city: "Jaipur",
          country: "India",
          description: "Restored 19th-century haveli in the Pink City featuring traditional courtyard architecture, jharokha windows, and Rajasthani cuisine.",
          type: ["Boutique", "Historic"],
          adultCount: 2,
          childCount: 1,
          facilities: ["Free WiFi", "Parking", "Restaurant", "Cultural Shows"],
          pricePerNight: 5400,
          starRating: 4,
          imageUrls: [
            "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800",
            "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800"
          ],
          lastUpdated: new Date(),
        },
        {
          userId: ownerId,
          name: "Shimla Pine View Lodge",
          city: "Shimla",
          country: "India",
          description: "Cozy hillside retreat surrounded by cedar and pine forests, panoramic Himalayan ridge views, and fireplace lounges.",
          type: ["Cabin", "Romantic"],
          adultCount: 2,
          childCount: 1,
          facilities: ["Free WiFi", "Heating", "Restaurant", "Trekking Desk"],
          pricePerNight: 4900,
          starRating: 4,
          imageUrls: [
            "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800",
            "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800"
          ],
          lastUpdated: new Date(),
        }
      ];

      await Hotel.insertMany(defaultHotels);
      console.log(`✅ Seeded ${defaultHotels.length} default hotels.`);
    }
  } catch (err) {
    console.error("Error auto-ensuring demo data:", err);
  }
};

// MongoDB Connection with Error Handling + TLS for Atlas / tls=true URIs
const connectDB = async () => {
  try {
    console.log("📡 Attempting to connect to MongoDB...");
    const uri = process.env.MONGODB_CONNECTION_STRING as string;
    const wantsTls =
      uri.includes("mongodb+srv://") ||
      /[?&]tls=true/i.test(uri) ||
      /[?&]ssl=true/i.test(uri);

    await mongoose.connect(uri, {
      ...(wantsTls
        ? {
            tls: true,
            tlsAllowInvalidCertificates: false,
          }
        : {}),
    });
    console.log("✅ MongoDB connected successfully");
    console.log(`📦 Database: ${mongoose.connection.db.databaseName}`);
    if (wantsTls) {
      console.log("🔒 MongoDB TLS enabled");
    }

    // Auto-ensure demo accounts and seed initial catalog if database is fresh
    await ensureDemoData();
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    console.error("💡 Please check your MONGODB_CONNECTION_STRING");
    process.exit(1);
  }
};

// Handle MongoDB connection events
mongoose.connection.on("disconnected", () => {
  console.warn("⚠️  MongoDB disconnected. Attempting to reconnect...");
});

mongoose.connection.on("error", (error) => {
  console.error("❌ MongoDB connection error:", error);
});

mongoose.connection.on("reconnected", () => {
  console.log("✅ MongoDB reconnected successfully");
});

connectDB();

const app = express();

// Security middleware — API does not need cross-origin embedding of responses
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: false, // Swagger UI needs inline assets
  })
);

// Trust proxy for production (Coolify/Vercel reverse proxy — rate limit + secure cookies)
app.set("trust proxy", 1);

// Rate limiting - more lenient for payment endpoints
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // Increased limit for general requests
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

// Special limiter for payment endpoints
const paymentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // Higher limit for payment requests
  message: "Too many payment requests, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

app.use("/api/", generalLimiter);
app.use("/api/hotels/*/bookings/payment-intent", paymentLimiter);

// Compression middleware
app.use(compression());

// Logging middleware
app.use(morgan("combined"));

const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:5174",
  "http://localhost:5173",
].filter((origin): origin is string => Boolean(origin));
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      // Allow all Netlify and Vercel preview URLs
      if (origin.includes("netlify.app") || origin.includes("vercel.app")) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // Log blocked origins in development
      if (process.env.NODE_ENV === "development") {
        console.log("CORS blocked origin:", origin);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    optionsSuccessStatus: 204,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Cookie",
      "X-Requested-With",
    ],
  })
);
// Explicit preflight handler for all routes
app.options(
  "*",
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      // Allow all Netlify and Vercel preview URLs
      if (origin.includes("netlify.app") || origin.includes("vercel.app")) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    optionsSuccessStatus: 204,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Cookie",
      "X-Requested-With",
    ],
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  // Ensure Vary header for CORS
  res.header("Vary", "Origin");
  next();
});

app.get("/", (req: Request, res: Response) => {
  res.send("<h1>Hotel Booking Backend API is running 🚀</h1>");
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/my-hotels", myHotelRoutes);
app.use("/api/hotels", hotelRoutes);
app.use("/api/my-bookings", bookingRoutes);
app.use("/api/bookings", bookingsManagementRoutes);
app.use("/api/health", healthRoutes);
app.use("/api/business-insights", businessInsightsRoutes);
app.use("/api/reviews", reviewRoutes);
// Rollups (former /api/analytics/snapshots) — same router, blocker-safe path under business-insights
app.use("/api/business-insights", analyticsRoutes);
app.use("/api/ai", aiRoutes);

// Swagger API Documentation
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(specs, {
    customCss: ".swagger-ui .topbar { display: none }",
    customSiteTitle: "Hotel Booking API Documentation",
  })
);

// Default 5001: macOS AirPlay (Control Center) often binds 5000. Override via PORT in .env.
const PORT = process.env.PORT || 5001;

const backendBaseUrl =
  process.env.BACKEND_URL?.replace(/\/$/, "") || `http://localhost:${PORT}`;

const server = app.listen(PORT, () => {
  console.log("🚀 ============================================");
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`🌐 Local: http://localhost:${PORT}`);
  console.log(`🔗 Public: ${backendBaseUrl}`);
  console.log(`📚 API Docs: ${backendBaseUrl}/api-docs`);
  console.log(`💚 Health Check: ${backendBaseUrl}/api/health`);
  console.log("🚀 ============================================");
});

// Graceful Shutdown Handler
const gracefulShutdown = (signal: string) => {
  console.log(`\n⚠️  ${signal} received. Starting graceful shutdown...`);

  server.close(async () => {
    console.log("🔒 HTTP server closed");

    try {
      await mongoose.connection.close();
      console.log("🔒 MongoDB connection closed");
      console.log("✅ Graceful shutdown completed");
      process.exit(0);
    } catch (error) {
      console.error("❌ Error during shutdown:", error);
      process.exit(1);
    }
  });

  // Force shutdown after 30 seconds
  setTimeout(() => {
    console.error("⚠️  Forced shutdown after timeout");
    process.exit(1);
  }, 30000);
};

// Handle shutdown signals
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
  console.error("❌ Uncaught Exception:", error);
  gracefulShutdown("UNCAUGHT_EXCEPTION");
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason, promise) => {
  console.error("❌ Unhandled Rejection at:", promise, "reason:", reason);
  gracefulShutdown("UNHANDLED_REJECTION");
});
