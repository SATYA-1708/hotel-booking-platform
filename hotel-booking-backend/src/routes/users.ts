import express, { Request, Response } from "express";
import User from "../models/user";
import Hotel from "../models/hotel";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { check, validationResult } from "express-validator";
import verifyToken from "../middleware/auth";
import requireAdmin from "../middleware/requireAdmin";
import { authCookieOptions } from "../lib/cookie-options";

const router = express.Router();

/**
 * Current user's own profile update.
 * PATCH /api/users/me
 * Body: { firstName?, lastName?, phone?, address? }
 */
router.patch("/me", verifyToken, async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const { firstName, lastName, phone, address } = req.body ?? {};
    if (firstName !== undefined) {
      if (typeof firstName !== "string" || !firstName.trim()) {
        return res.status(400).json({ message: "First Name is required" });
      }
      user.firstName = firstName.trim();
    }
    if (lastName !== undefined) {
      if (typeof lastName !== "string" || !lastName.trim()) {
        return res.status(400).json({ message: "Last Name is required" });
      }
      user.lastName = lastName.trim();
    }
    if (phone !== undefined) {
      user.phone = typeof phone === "string" ? phone.trim() : undefined;
    }
    if (address !== undefined && address !== null) {
      const current = user.address ?? {
        street: "",
        city: "",
        state: "",
        country: "",
        zipCode: "",
      };
      user.address = {
        street:
          typeof address.street === "string"
            ? address.street
            : current.street || "",
        city:
          typeof address.city === "string" ? address.city : current.city || "",
        state:
          typeof address.state === "string"
            ? address.state
            : current.state || "",
        country:
          typeof address.country === "string"
            ? address.country
            : current.country || "",
        zipCode:
          typeof address.zipCode === "string"
            ? address.zipCode
            : current.zipCode || "",
      };
    }

    await user.save();
    res.json(await User.findById(user._id).select("-password"));
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Unable to update profile" });
  }
});

/**
 * Change password for the current user.
 * POST /api/users/me/password
 * Body: { currentPassword, newPassword }
 */
router.post(
  "/me/password",
  [check("currentPassword", "Current password is required").notEmpty(),
   check("newPassword", "New password with 6 or more characters required").isLength({ min: 6 })],
  verifyToken,
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array() });
    }

    try {
      const { currentPassword, newPassword } = req.body;
      const user = await User.findById(req.userId);
      if (!user) {
        return res.status(400).json({ message: "User not found" });
      }

      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Current password is incorrect" });
      }
      if (await bcrypt.compare(newPassword, user.password)) {
        return res.status(400).json({
          message: "New password must be different from the current one",
        });
      }

      user.password = newPassword;
      await user.save();
      res.json({ message: "Password updated OK" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Unable to change password" });
    }
  }
);

router.get("/me", verifyToken, async (req: Request, res: Response) => {
  const userId = req.userId;

  try {
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "something went wrong" });
  }
});

/**
 * Toggle a hotel in the current user's wishlist (saved hotels).
 * PATCH /api/users/me/wishlist/:hotelId
 */
router.patch(
  "/me/wishlist/:hotelId",
  verifyToken,
  async (req: Request, res: Response) => {
    try {
      const hotel = await Hotel.findById(req.params.hotelId);
      if (!hotel) {
        return res.status(404).json({ message: "Hotel not found" });
      }

      const user = await User.findById(req.userId);
      if (!user) {
        return res.status(400).json({ message: "User not found" });
      }

      const list = user.wishlist ?? [];
      const exists = list.some((id) => String(id) === req.params.hotelId);
      const wishlist = exists
        ? list.filter((id) => String(id) !== req.params.hotelId)
        : [...list, req.params.hotelId];

      user.wishlist = wishlist;
      await user.save();

      res.status(200).json({
        saved: !exists,
        wishlist: wishlist.map((id) => String(id)),
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Unable to update wishlist" });
    }
  }
);

/**
 * Current user's saved hotels, fully hydrated.
 * GET /api/users/me/wishlist
 */
router.get(
  "/me/wishlist",
  verifyToken,
  async (req: Request, res: Response) => {
    try {
      const user = await User.findById(req.userId);
      if (!user || !user.wishlist?.length) {
        return res.json([]);
      }

      const hotels = await Hotel.find({
        _id: { $in: user.wishlist },
      });

      // Preserve the order the user saved them in
      const byId = new Map(hotels.map((h) => [String(h._id), h]));
      const ordered = (user.wishlist.map((id) => byId.get(String(id))).filter(
        (h): h is NonNullable<typeof h> => Boolean(h)
      ));

      res.json(ordered);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Unable to fetch wishlist" });
    }
  }
);

/**
 * Admin: list users (no passwords).
 * GET /api/users
 */
router.get(
  "/",
  verifyToken,
  requireAdmin,
  async (_req: Request, res: Response) => {
    try {
      const users = await User.find()
        .select(
          "email firstName lastName role isActive totalBookings totalSpent createdAt"
        )
        .sort({ createdAt: -1 })
        .limit(200);
      res.json(users);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Unable to fetch users" });
    }
  }
);

/**
 * Admin: update user role.
 * PATCH /api/users/:id/role
 * Body: { role: "user" | "admin" | "hotel_owner" }
 */
router.patch(
  "/:id/role",
  verifyToken,
  requireAdmin,
  async (req: Request, res: Response) => {
    const allowed = ["user", "admin", "hotel_owner"] as const;
    const role = req.body?.role;
    if (!allowed.includes(role)) {
      return res.status(400).json({
        message: `role must be one of: ${allowed.join(", ")}`,
      });
    }

    try {
      if (req.params.id === req.userId && role !== "admin") {
        return res.status(400).json({
          message: "Cannot demote your own admin role",
        });
      }

      const user = await User.findByIdAndUpdate(
        req.params.id,
        { role, updatedAt: new Date() },
        { new: true }
      ).select("-password");

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Unable to update role" });
    }
  }
);

router.post(
  "/register",
  [
    check("firstName", "First Name is required").isString(),
    check("lastName", "Last Name is required").isString(),
    check("email", "Email is required").isEmail(),
    check("password", "Password with 6 or more characters required").isLength({
      min: 6,
    }),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array() });
    }

    try {
      let user = await User.findOne({
        email: req.body.email,
      });

      if (user) {
        return res.status(400).json({ message: "User already exists" });
      }

      user = new User(req.body);
      await user.save();

      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET_KEY as string,
        {
          expiresIn: "1d",
        }
      );

      res.cookie("auth_token", token, authCookieOptions());
      return res.status(200).json({
        userId: user._id,
        token: token,
        message: "User registered OK",
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
        },
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: "Something went wrong" });
    }
  }
);

export default router;
