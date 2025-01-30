// import express from "express";
// import mongoose from "mongoose";
// import TicketModel from "../models/Tickets.js";
// import FestivalModel from "../models/Festivals.js";
// import UserModel from "../models/Users.js";
// import { authenticateUser } from "../middlewares/authMiddleware.js";

// const ticketRouter = express.Router();

// // Purchase Ticket API
// ticketRouter.post("/:festivalId", authenticateUser, async (req, res) => {
//   const { festivalId } = req.params;
//   const userId = req.user.id; 
//   const { quantity, paymentMethod } = req.body;

//   if (!quantity || !paymentMethod) {
//     return res.status(400).json({ error: "Quantity and payment method are required" });
//   }

//   const session = await mongoose.startSession();
//   session.startTransaction();

//   try {
//     const festival = await FestivalModel.findById(festivalId).session(session);
//     if (!festival) {
//       await session.abortTransaction();
//       return res.status(404).json({ error: "Festival not found" });
//     }

//     if (festival.availableTickets < quantity) {
//       await session.abortTransaction();
//       return res.status(400).json({ error: "Not enough tickets available" });
//     }

//     const totalPrice = quantity * festival.ticketPrice;

//     // 🛠️ Simulated Payment Processing (Replace with real Stripe/PayPal integration)
//     const paymentStatus = "Completed"; // Mocked payment success

//     if (paymentStatus !== "Completed") {
//       await session.abortTransaction();
//       return res.status(400).json({ error: "Payment failed" });
//     }

//     // Save Payment in User Profile
//     const updatedUser = await UserModel.findByIdAndUpdate(
//       userId,
//       {
//         $push: {
//           payments: {
//             amount: totalPrice,
//             paymentMethod,
//             status: paymentStatus,
//             paymentDate: new Date(),
//           },
//         },
//       },
//       { new: true, session }
//     );

//     // ✅ Fix: Include `name` and `price` when creating ticket
//     const ticket = await TicketModel.create(
//       [
//         {
//           festivalId,
//           userId,
//           quantity,
//           totalPrice,
//           name: festival.name, // ✅ Fetch from festival
//           price: festival.ticketPrice, // ✅ Fetch from festival
//         },
//       ],
//       { session }
//     );

//     // Reduce available tickets
//     festival.availableTickets -= quantity;
//     await festival.save({ session });

//     // Save purchased ticket in user's profile
//     await UserModel.findByIdAndUpdate(
//       userId,
//       {
//         $push: {
//           purchasedTickets: {
//             festivalId,
//             quantity,
//             purchaseDate: new Date(),
//           },
//         },
//       },
//       { new: true, session }
//     );

//     await session.commitTransaction();
//     session.endSession();

//     res.status(201).json({
//       message: "Payment successful, ticket purchased, and attached to user profile",
//       ticket,
//       updatedUser,
//     });
//   } catch (error) {
//     await session.abortTransaction();
//     session.endSession();
//     res.status(500).json({ error: "Ticket purchase failed", details: error.message });
//   }
// });

// export default ticketRouter;


import express from "express";
import mongoose from "mongoose";
import TicketModel from "../models/Tickets.js";
import FestivalModel from "../models/Festivals.js";
import UserModel from "../models/Users.js";
import { authenticateUser } from "../middlewares/authMiddleware.js";

const ticketRouter = express.Router();

// 🎟️ Purchase Ticket API
ticketRouter.post("/:festivalId", authenticateUser, async (req, res) => {
  const { festivalId } = req.params;
  const userId = req.user.id; 
  const { quantity, paymentMethod } = req.body;

  if (!quantity || !paymentMethod) {
    return res.status(400).json({ error: "Quantity and payment method are required" });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const festival = await FestivalModel.findById(festivalId).session(session);
    if (!festival) {
      await session.abortTransaction();
      return res.status(404).json({ error: "Festival not found" });
    }

    if (festival.availableTickets < quantity) {
      await session.abortTransaction();
      return res.status(400).json({ error: "Not enough tickets available" });
    }

    const totalPrice = quantity * festival.ticketPrice;

    // 🛠️ Simulated Payment Processing (Replace with Stripe/PayPal integration)
    const paymentStatus = "Completed"; // Mocked payment success

    if (paymentStatus !== "Completed") {
      await session.abortTransaction();
      return res.status(400).json({ error: "Payment failed" });
    }

    // ✅ Save Payment in User Profile
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      {
        $push: {
          payments: {
            amount: totalPrice,
            paymentMethod,
            status: paymentStatus,
            paymentDate: new Date(),
          },
        },
      },
      { new: true, session }
    );

    if (!updatedUser) {
      await session.abortTransaction();
      return res.status(404).json({ error: "User not found" });
    }

    // ✅ Create Ticket Entry
    const ticket = new TicketModel({
      festivalId,
      userId,
      quantity,
      totalPrice,
      name: festival.name, 
      price: festival.ticketPrice, 
    });

    await ticket.save({ session });

    // ✅ Reduce available tickets in the festival
    festival.availableTickets -= quantity;
    await festival.save({ session });

    // ✅ Save purchased ticket in user's profile
    const updatedUserWithTicket = await UserModel.findByIdAndUpdate(
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
      { new: true, session }
    );

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      message: "Payment successful, ticket purchased, and attached to user profile",
      ticket,
      user: updatedUserWithTicket,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("❌ Ticket purchase failed:", error);
    res.status(500).json({ error: "Ticket purchase failed", details: error.message });
  } finally {
    session.endSession();
  }
});

export default ticketRouter;

