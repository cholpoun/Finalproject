import Festival from "../models/Festivals.js";
import User from "../models/User.js";
import Ticket from "../models/Ticket.js";

export const purchaseTickets = async (req, res) => {
  const { userId, festivalId, quantity } = req.body;

  try {
    const festival = await Festival.findById(festivalId);
    if (!festival) {
      return res.status(404).json({ message: "Festival not found" });
    }

    if (festival.availableTickets < quantity) {
      return res.status(400).json({ message: "Not enough tickets available" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const totalPrice = festival.ticketPrice * quantity;

    // Skapa biljett
    const ticket = new Ticket({
      festivalId,
      userId,
      quantity,
      totalPrice,
    });
    await ticket.save();

    // Uppdatera användarens köphistorik
    user.purchasedTickets.push({
      festivalId,
      quantity,
      purchaseDate: new Date(),
    });
    await user.save();

    // Uppdatera tillgängliga biljetter för festivalen
    festival.availableTickets -= quantity;
    await festival.save();

    res.status(201).json({
      message: "Tickets purchased successfully",
      ticket,
      user,
      festival,
    });
  } catch (error) {
    res.status(500).json({ message: "Error processing ticket purchase", error });
  }
};
