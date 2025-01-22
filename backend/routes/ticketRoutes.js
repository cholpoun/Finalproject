import express from "express";
import TicketModel from "../models/Tickets.js";
import FestivalModel from "../models/Festivals.js";
import UserModel from "../models/Users.js";
import { authenticateUser } from "../middlewares/authMiddleware.js";

const ticketRouter = express.Router();

// Köp biljett till en festival
ticketRouter.post("/:festivalId", authenticateUser, async (req, res) => {
  const { festivalId } = req.params;
  const userId = req.user.id; // ID från inloggad användare
  const { quantity } = req.body;

  try {
    // Kontrollera om festivalen finns
    const festival = await FestivalModel.findById(festivalId);
    if (!festival) {
      return res.status(404).json({ error: "Festival hittades inte" });
    }

    // Kontrollera om det finns tillräckligt många biljetter
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

    // Uppdatera festivalens antal tillgängliga biljetter
    festival.availableTickets -= quantity;
    await festival.save();

    // Uppdatera användarens profil med den köpta biljetten
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
