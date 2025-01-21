import express from "express";
import TicketModel from "../models/Tickets.js";
import FestivalModel from "../models/Festivals.js";

const ticketRouter = express.Router();

// Route för att köpa biljetter
ticketRouter.post("/", async (req, res) => {
  const { userId, festivalId, quantity } = req.body;

  try {
    // Hämta festivalens data från databasen
    const festival = await FestivalModel.findById(festivalId);

    if (!festival) {
      return res.status(404).json({ error: "Festival not found" });
    }

    // Kontrollera om det finns tillräckligt många biljetter kvar
    if (festival.availableTickets < quantity) {
      return res.status(400).json({
        error: "Not enough tickets available",
        availableTickets: festival.availableTickets,
      });
    }

    // Skapa biljetten
    const totalPrice = festival.ticketPrice * quantity;
    const ticket = new TicketModel({
      userId,
      festivalId,
      quantity,
      totalPrice,
    });
    await ticket.save();

    // Uppdatera antalet tillgängliga biljetter i festivalens data
    festival.availableTickets -= quantity;
    await festival.save();

    res.status(201).json({
      message: "Tickets purchased successfully",
      ticket,
    });
  } catch (error) {
    console.error("Error purchasing tickets:", error);
    res.status(500).json({ error: "Failed to purchase tickets", details: error.message });
  }
});

export default ticketRouter;
