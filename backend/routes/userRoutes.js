import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { body, validationResult } from "express-validator";
import UserModel from "../models/Users.js";
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
router.get("/:id/profile", authenticateUser, async (req, res) => {
  try {
    // Här använder vi req.userId istället för req.params.id
    const user = req.user; // `req.user` sätts av `authenticateUser` middleware

    // Debugging: Visa användar-ID för att säkerställa att det finns
    console.log("Requested User ID:", req.params.id); // Logga begärd ID
    console.log("Authenticated User ID:", req.userId); // Logga autentiserad ID

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({
      error: "Failed to retrieve user profile",
      details: error.message,
    });
  }
});

// Add a festival to favorites
router.put(
  "/:userId/favorite/:festivalId",
  authenticateUser,
  async (req, res) => {
    const { userId, festivalId } = req.params;

    try {
      const user = await UserModel.findById(userId);

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Check if the festival is already in the favorites list
      const isAlreadyFavorite = user.favouriteFestivals.includes(festivalId);
      if (isAlreadyFavorite) {
        return res
          .status(400)
          .json({ error: "Festival is already in favorites" });
      }

      // Add the festival to favorites
      user.favouriteFestivals.push(festivalId);
      await user.save();

      res.status(200).json({ message: "Festival added to favorites", user });
    } catch (error) {
      res.status(500).json({
        error: "Failed to add festival to favorites",
        details: error.message,
      });
    }
  }
);

// Get user's favorite festivals
router.get("/:userId/favorites", authenticateUser, async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ favorites: user.favouriteFestivals });
  } catch (error) {
    res.status(500).json({
      error: "Failed to retrieve favorite festivals",
      details: error.message,
    });
  }
});

// Remove a festival from favorites
router.delete(
  "/:userId/favorite/:festivalId",
  authenticateUser,
  async (req, res) => {
    const { userId, festivalId } = req.params;

    try {
      const user = await UserModel.findById(userId);

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Check if the festival is in the favorites list
      const index = user.favouriteFestivals.indexOf(festivalId);
      if (index === -1) {
        return res.status(400).json({ error: "Festival is not in favorites" });
      }

      // Remove the festival from favorites
      user.favouriteFestivals.splice(index, 1);
      await user.save();

      res
        .status(200)
        .json({ message: "Festival removed from favorites", user });
    } catch (error) {
      res.status(500).json({
        error: "Failed to remove festival from favorites",
        details: error.message,
      });
    }
  }
);

export default router;
