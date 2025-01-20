import fs from 'fs';
import path from 'path';
// import users from '../models/users.json' assert { type: 'json' };
// import festivals from '../models/festivals.json' assert { type: 'json' };

export const purchaseTicket = (req, res) => {
  const { userId, festivalId, quantity } = req.body;

  if (!userId || !festivalId || !quantity) {
    return res.status(400).json({ message: "User ID, Festival ID, and quantity are required" });
  }

  const user = users.find(u => u.id === userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const festival = festivals.find(f => f.id === festivalId);
  if (!festival) {
    return res.status(404).json({ message: "Festival not found" });
  }

  const quantityInt = parseInt(quantity, 10);
  if (isNaN(quantityInt) || quantityInt <= 0) {
    return res.status(400).json({ message: "Quantity must be a positive integer" });
  }

  if (festival.availableTickets < quantityInt) {
    return res.status(400).json({ message: "Not enough tickets available" });
  }

  festival.availableTickets -= quantityInt;

  const newTicket = {
    festivalId,
    quantity: quantityInt,
    purchaseDate: new Date().toISOString()
  };

  if (!user.purchasedTickets) {
    user.purchasedTickets = [];
  }
  user.purchasedTickets.push(newTicket);

  // Write changes back to JSON files
  fs.writeFileSync(path.resolve('./data/users.json'), JSON.stringify(users, null, 2));
  fs.writeFileSync(path.resolve('./data/festivals.json'), JSON.stringify(festivals, null, 2));

  res.status(201).json({
    message: "Ticket purchased successfully",
    ticket: newTicket
  });
};
