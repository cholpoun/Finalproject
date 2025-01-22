import express from "express";
import UserModel from "../models/Users.js";
import FestivalModel from "../models/Festivals.js";
import TicketModel from "../models/Tickets.js";
import { authenticateUser } from "../middlewares/authMiddleware.js";

const userRouter = express.Router();

// Markera en festival som favorit
userRouter.post("/favourites/:festivalId", authenticateUser, async (req, res) => {
  const { festivalId } = req.params;
  const userId = req.user.id;

  try {
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "Användare hittades inte" });
    }

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

// Köp biljett till en festival
userRouter.post("/tickets/:festivalId", authenticateUser, async (req, res) => {
  const { festivalId } = req.params;
  const userId = req.user.id;
  const { quantity } = req.body;

  try {
    const festival = await FestivalModel.findById(festivalId);
    if (!festival) {
      return res.status(404).json({ error: "Festival hittades inte" });
    }

    if (festival.availableTickets < quantity) {
      return res.status(400).json({ error: "Otillräckligt antal biljetter" });
    }

    const totalPrice = quantity * festival.ticketPrice;

    // Skapa en ny biljett
    const ticket = await TicketModel.create({
      festivalId,
      userId,
      quantity,
      totalPrice,
    });

    // Minska antalet tillgängliga biljetter
    festival.availableTickets -= quantity;
    await festival.save();

    // Lägg till köpet till användarens data
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

// Hämta användarens profil baserat på användar-ID
userRouter.get("/user/:id", authenticateUser, async (req, res) => {
  const { id } = req.params; // Hämta användar-ID från URL-parametern
  const userId = req.user.id; // Hämta autentiserad användares ID från sessionen eller token

  // Kontrollera om den autentiserade användaren försöker komma åt sin egen profil
  if (userId !== id) {
    return res.status(403).json({ error: "Du har inte behörighet att se den här profilen" });
  }

  try {
    // Hämta användarens data baserat på användar-ID
    const user = await UserModel.findById(id)
      .populate("purchasedTickets.festivalId", "name location date") // Populera festivaldata i köpta biljetter
      .populate("favouriteFestivals", "name location date"); // Populera favoritfestivaldata

    if (!user) {
      return res.status(404).json({ error: "Användare hittades inte" });
    }

    res.status(200).json({
      name: user.name,
      email: user.email,
      purchasedTickets: user.purchasedTickets,
      favouriteFestivals: user.favouriteFestivals,
    });
  } catch (error) {
    res.status(500).json({ error: "Kunde inte hämta profil", details: error.message });
  }
});

export default userRouter;
