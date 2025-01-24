import express from "express";
import TicketModel from "../models/Tickets.js";
import FestivalModel from "../models/Festivals.js";
import UserModel from "../models/Users.js";
import { authenticateUser } from "../middlewares/authMiddleware.js";

const ticketRouter = express.Router();

ticketRouter.post("/:festivalId", authenticateUser, async (req, res) => {
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

    const ticket = await TicketModel.create({
      festivalId,
      userId,
      quantity,
      totalPrice,
    });

    festival.availableTickets -= quantity;
    await festival.save();

    await UserModel.findByIdAndUpdate(
      userId,
      {
        $push: {
          purchasedTickets: {
            festivalId,
            quantity,
            purchaseDate: new Date(),
          },
        },
      },
      { new: true }
    );

    res.status(201).json({ message: "Biljett köpt och kopplad till din profil", ticket });
  } catch (error) {
    res.status(500).json({ error: "Kunde inte köpa biljett", details: error.message });
  }
});

export default ticketRouter;
