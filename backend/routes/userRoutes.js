import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { body, validationResult } from "express-validator";
import UserModel from "../models/Users.js";
import FestivalModel from "../models/Festivals.js";
import { authenticateUser } from "../middlewares/authMiddleware.js";

const router = express.Router();
const jwtSecret = process.env.JWT_SECRET;

// Centralized function to handle validation errors
const handleValidationErrors = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
};

// User registration
router.post(
  "/register",
  [
    body("username").notEmpty().withMessage("Username is required"),
    body("email").isEmail().withMessage("Invalid email address"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ],
  async (req, res) => {
    const validationErrorResponse = handleValidationErrors(req, res);
    if (validationErrorResponse) return validationErrorResponse;

    let { username, email, password } = req.body;

    // Convert email to lowercase
    email = email.toLowerCase();

    try {
      // Check if the user already exists
      const existingUser = await UserModel.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: "User already exists" });
      }

      // Trim and log the password before hashing
      password = password.trim();

      // Create a new user
      const newUser = new UserModel({
        username,
        email,
        password,
      });

      const result = await newUser.save();
      res.status(201).json({ message: "User registered", result });
    } catch (error) {
      res
        .status(500)
        .json({ error: "Could not register user", details: error.message });
    }
  }
);

// User login
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Invalid email address"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  async (req, res) => {
    const validationErrorResponse = handleValidationErrors(req, res);
    if (validationErrorResponse) return validationErrorResponse;

    let { email, password } = req.body;

    // Convert email to lowercase
    const lowerCaseEmail = email.toLowerCase();

    try {
      // Find the user in the database
      const user = await UserModel.findOne({ email: lowerCaseEmail });
      if (!user) {
        return res.status(400).json({ error: "User not found" });
      }

      // Compare the entered password with the stored hashed password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ error: "Incorrect password" });
      }

      // Create a JWT token
      const token = jwt.sign(
        { userId: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      res.json({
        message: "Login successful",
        token,
        userId: user._id,
      });
    } catch (error) {
      res.status(500).json({ error: "Login failed", details: error.message });
    }
  }
);

// View user profile
router.get("/me/profile", authenticateUser, async (req, res) => {
  try {
    const userId = req.user.id; // ✅ Use authenticated user ID

    console.log("✅ Authenticated User ID:", userId);

    // Fetch the user's profile with purchased tickets and favorite festivals
    const user = await UserModel.findById(userId)
      .select("username email purchasedTickets favouriteFestivals")
      .populate({
        path: "purchasedTickets.festivalId",
        model: "Festival", // Ensure the model matches your FestivalModel name
        select: "name ticketPrice location date",
      })
      .populate({
        path: "favouriteFestivals",
        model: "Festival", // Ensure the model matches your FestivalModel name
        select: "name location date", // You can select other relevant fields here
      });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Format purchased tickets
    const formattedTickets = user.purchasedTickets.map((ticket) => ({
      festivalName: ticket.festivalId
        ? ticket.festivalId.name
        : "Unknown Festival",
      quantity: ticket.quantity,
      totalPrice:
        ticket.quantity *
        (ticket.festivalId ? ticket.festivalId.ticketPrice : 0),
      location: ticket.festivalId ? ticket.festivalId.location : "N/A",
      date: ticket.festivalId ? ticket.festivalId.date : "N/A",
    }));

    res.status(200).json({
      username: user.username,
      email: user.email,
      purchasedTickets: formattedTickets,
      favoriteFestivals: user.favouriteFestivals,
    });
  } catch (error) {
    console.error("❌ Error fetching user profile:", error.message);
    res.status(500).json({ error: "Failed to retrieve user profile." });
  }
});

// ✅ Add Festival to Favorites
router.put("/me/favorite/:festivalId", authenticateUser, async (req, res) => {
  const { festivalId } = req.params;
  const userId = req.user.id;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    console.log("🟢 Adding festival to favorites...");
    console.log("User ID:", userId);
    console.log("Festival ID:", festivalId);

    // 🔍 Fetch User
    const user = await UserModel.findById(userId).session(session);
    if (!user) {
      console.log("❌ User not found");
      await session.abortTransaction();
      return res.status(404).json({ error: "User not found" });
    }

    // 🔍 Fetch Festival
    const festival = await FestivalModel.findById(festivalId).session(session);
    if (!festival) {
      console.log("❌ Festival not found");
      await session.abortTransaction();
      return res.status(404).json({ error: "Festival not found" });
    }

    // ✅ Add Festival to Favorites
    await user.addFavoriteFestival(festivalId);

    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({
      message: "✅ Festival added to favorites",
      user,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("❌ Failed to add festival to favorites:", error.message);
    return res.status(500).json({
      error: "Failed to add festival to favorites",
      details: error.message,
    });
  }
});

// ✅ Remove Festival from Favorites
router.delete(
  "/me/favorite/:festivalId",
  authenticateUser,
  async (req, res) => {
    const { festivalId } = req.params;
    const userId = req.user.id;

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      console.log("🟢 Removing festival from favorites...");
      console.log("User ID:", userId);
      console.log("Festival ID:", festivalId);

      // 🔍 Fetch User
      const user = await UserModel.findById(userId).session(session);
      if (!user) {
        console.log("❌ User not found");
        await session.abortTransaction();
        return res.status(404).json({ error: "User not found" });
      }

      // ✅ Remove Festival from Favorites
      const index = user.favouriteFestivals.indexOf(festivalId);
      if (index === -1) {
        console.log("❌ Festival not in favorites");
        await session.abortTransaction();
        return res.status(400).json({ error: "Festival is not in favorites" });
      }

      user.favouriteFestivals.splice(index, 1);
      await user.save({ session });

      await session.commitTransaction();
      session.endSession();

      return res.status(200).json({
        message: "✅ Festival removed from favorites",
        user,
      });
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      console.error(
        "❌ Failed to remove festival from favorites:",
        error.message
      );
      return res.status(500).json({
        error: "Failed to remove festival from favorites",
        details: error.message,
      });
    }
  }
);

// ✅ Get User's Favorite Festivals
router.get("/me/favorites", authenticateUser, async (req, res) => {
  try {
    const userId = req.user.id;

    // 🔍 Fetch User with Populated Favorite Festivals
    const user = await UserModel.findById(userId)
      .select("favouriteFestivals")
      .populate({
        path: "favouriteFestivals",
        model: "Festival", // Ensure this matches your Festival model name
        select: "name location date", // Select relevant fields
      });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json({ favorites: user.favouriteFestivals });
  } catch (error) {
    console.error("❌ Failed to fetch favorite festivals:", error.message);
    return res.status(500).json({
      error: "Failed to fetch favorite festivals",
      details: error.message,
    });
  }
});

// Get user's purchased tickets
router.get("/me/tickets", authenticateUser, async (req, res) => {
  try {
    // Find the authenticated user's purchased tickets
    const user = await UserModel.findById(req.user.id)
      .select("purchasedTickets")
      .populate({
        path: "purchasedTickets.festivalId",
        select: "name ticketPrice location date", // Include relevant festival fields
      });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ tickets: user.purchasedTickets });
  } catch (error) {
    console.error("❌ Error fetching user's purchased tickets:", error.message);
    res.status(500).json({
      error: "Failed to fetch purchased tickets.",
      details: error.message,
    });
  }
});

export default router;
