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
      console.log("Password before hashing:", password);

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
      console.log("Hashed password:", hashedPassword);

      // Create a new user
      const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
      });

      const result = await newUser.save();
      console.log("User registered with hashed password:", result.password);

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

      // Trim input password and log it for debugging
      password = password.trim();
      console.log("Entered password (trimmed):", password);
      console.log("Entered password length:", password.length);

      // Log the stored hashed password for debugging
      console.log("Stored hashed password:", user.password);
      console.log("Stored hash length:", user.password.length);

      // Compare the entered password with the stored hashed password
      const isMatch = await bcrypt.compare(password, user.password);
      console.log("Password match result:", isMatch); // Should be true if they match

      if (!isMatch) {
        return res.status(400).json({ error: "Incorrect password" });
      }

      // Create a JWT token
      const token = jwt.sign(
        { userId: user._id, email: user.email },
        jwtSecret,
        { expiresIn: "1h" }
      );

      res.json({ message: "Login successful", token });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Login failed", details: error.message });
    }
  }
);

// View user profile
router.get("/profile", authenticateUser, async (req, res) => {
  try {
    const user = req.user; // `req.user` is set by `authenticateUser` middleware
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({
      error: "Failed to retrieve user profile",
      details: error.message,
    });
  }
});

export default router;
