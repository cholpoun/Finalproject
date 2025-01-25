import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import UserModel from "../models/Users.js";
import FestivalModel from "../models/Festivals.js";
import TicketModel from "../models/Tickets.js";
import { authenticateUser } from "../middlewares/authMiddleware.js";

const userRouter = express.Router();

// Registrera användare
userRouter.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: "Alla fält är obligatoriska" });
  }

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
});

// Logga in användare
userRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Alla fält är obligatoriska" });
  }

  try {
    // Hitta användaren
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Fel e-post eller lösenord" });
    }

    // Kontrollera lösenordet
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Fel e-post eller lösenord" });
    }

    // Skapa en JWT-token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.status(200).json({ message: "Inloggning lyckades", token });
  } catch (error) {
    res.status(500).json({ error: "Kunde inte logga in användaren", details: error.message });
  }
});

// Lägg till festival som favorit
userRouter.post("/favourites/:festivalId", authenticateUser, async (req, res) => {
  const { festivalId } = req.params;
  const userId = req.user.id;

  if (!mongoose.Types.ObjectId.isValid(festivalId)) {
    return res.status(400).json({ error: "Ogiltigt festival-ID" });
  }

  try {
    const user = await UserModel.findById(userId);
    if (!user) return res.status(404).json({ error: "Användare hittades inte" });

    if (user.favouriteFestivals.includes(festivalId)) {
      return res.status(400).json({ message: "Festivalen är redan favoritmarkerad" });
    }

    user.favouriteFestivals.push(festivalId);
    await user.save();
    res.status(200).json({ message: "Festival favoritmarkerad", favourites: user.favouriteFestivals });
  } catch (error) {
    res.status(500).json({ error: "Kunde inte favoritmarkera festival", details: error.message });
  }
});

// Köp biljett
userRouter.post("/tickets/:festivalId", authenticateUser, async (req, res) => {
  const { festivalId } = req.params;
  const userId = req.user.id;
  const { quantity } = req.body;

  if (!quantity || quantity <= 0 || !Number.isInteger(quantity)) {
    return res.status(400).json({ error: "Ogiltigt antal biljetter" });
  }

  if (!mongoose.Types.ObjectId.isValid(festivalId)) {
    return res.status(400).json({ error: "Ogiltigt festival-ID" });
  }

  try {
    const festival = await FestivalModel.findById(festivalId);
    if (!festival) return res.status(404).json({ error: "Festival hittades inte" });

    if (festival.availableTickets < quantity) {
      return res.status(400).json({ error: "Otillräckligt antal biljetter" });
    }

    const totalPrice = quantity * festival.ticketPrice;

    const ticket = await TicketModel.create({
      festivalId,
      userId,
      quantity,
      totalPrice,
    });

    festival.availableTickets -= quantity;
    await festival.save();

    const user = await UserModel.findById(userId);
    user.purchasedTickets.push({
      festivalId,
      quantity,
      purchaseDate: new Date(),
    });
    await user.save();

    res.status(201).json({ message: "Biljett köpt", ticket });
  } catch (error) {
    res.status(500).json({ error: "Kunde inte köpa biljett", details: error.message });
  }
});

export default userRouter;
