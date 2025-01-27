import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { body, validationResult } from "express-validator";
import UserModel from "../models/Users.js";
import { authenticateUser } from "../middlewares/authMiddleware.js";

const router = express.Router();
const jwtSecret = process.env.JWT_SECRET;

// Centraliserad funktion för att hantera valideringsfel
const handleValidationErrors = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
};

// Registrering av användare
router.post(
  "/register",
  [
    body("username").notEmpty().withMessage("Användarnamn är obligatoriskt"),
    body("email").isEmail().withMessage("Ogiltig e-postadress"),
    body("password").isLength({ min: 6 }).withMessage("Lösenordet måste vara minst 6 tecken"),
  ],
  async (req, res) => {
    handleValidationErrors(req, res);

    const { username, email, password } = req.body;

    try {
      // Kontrollera om användaren redan finns
      const existingUser = await UserModel.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: "Användaren finns redan" });
      }

      // Hasha lösenordet
      const hashedPassword = await bcrypt.hash(password, 10);

      // Skapa en ny användare
      const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
      });

      await newUser.save();

      res.status(201).json({ message: "Användare registrerad" });
    } catch (error) {
      res.status(500).json({ error: "Kunde inte registrera användaren", details: error.message });
    }
  }
);

// Inloggning av användare
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Ogiltig e-postadress"),
    body("password").notEmpty().withMessage("Lösenord är obligatoriskt"),
  ],
  async (req, res) => {
    handleValidationErrors(req, res);

    const { email, password } = req.body;

    try {
      // Hitta användaren i databasen
      const user = await UserModel.findOne({ email });
      if (!user) {
        return res.status(400).json({ error: "Användaren finns inte" });
      }

      // Kontrollera lösenordet
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ error: "Felaktigt lösenord" });
      }

      // Skapa JWT-token
      const token = jwt.sign({ userId: user._id, email: user.email }, jwtSecret, { expiresIn: "1h" });

      res.json({ message: "Inloggning lyckades", token });
    } catch (error) {
      res.status(500).json({ error: "Fel vid inloggning", details: error.message });
    }
  }
);

// Visa användarprofil
router.get("/profile", authenticateUser, async (req, res) => {
  try {
    const user = req.user; // `req.user` sätts av `authenticateUser`-middleware
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ error: "Fel vid hämtning av användarprofil", details: error.message });
  }
});

export default router;
