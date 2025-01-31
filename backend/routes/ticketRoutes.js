// import express from "express";
// import mongoose from "mongoose";
// import TicketModel from "../models/Tickets.js";
// import FestivalModel from "../models/Festivals.js";
// import UserModel from "../models/Users.js";
// import { authenticateUser } from "../middlewares/authMiddleware.js";

// const ticketRouter = express.Router();

// // 🎟️ Purchase Ticket API (Already Exists)
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

//     // 🛠️ Simulated Payment Processing
//     const paymentStatus = "Completed"; // Mocked payment success

//     if (paymentStatus !== "Completed") {
//       await session.abortTransaction();
//       return res.status(400).json({ error: "Payment failed" });
//     }

//     // ✅ Save Payment in User Profile
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

//     if (!updatedUser) {
//       await session.abortTransaction();
//       return res.status(404).json({ error: "User not found" });
//     }

//     // ✅ Create Ticket Entry
//     const ticket = new TicketModel({
//       festivalId,
//       userId,
//       quantity,
//       totalPrice,
//       name: festival.name,
//       price: festival.ticketPrice,
//     });

//     await ticket.save({ session });

//     // ✅ Reduce available tickets in the festival
//     festival.availableTickets -= quantity;
//     await festival.save({ session });

//     // ✅ Save purchased ticket in user's profile
//     const updatedUserWithTicket = await UserModel.findByIdAndUpdate(
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
//       user: updatedUserWithTicket,
//     });
//   } catch (error) {
//     await session.abortTransaction();
//     session.endSession();
//     console.error("❌ Ticket purchase failed:", error);
//     res.status(500).json({ error: "Ticket purchase failed", details: error.message });
//   } finally {
//     session.endSession();
//   }
// });

// // ✅ NEW: Fetch User Tickets API
// ticketRouter.get("/user", authenticateUser, async (req, res) => {
//   try {
//     const userId = req.user.id;
//     console.log("Fetching tickets for user:", userId);

//     const tickets = await TicketModel.find({ userId });

//     if (!tickets.length) {
//       return res.status(200).json({ tickets: [] }); // Return empty array if no tickets
//     }

//     res.status(200).json({ tickets });
//   } catch (error) {
//     console.error("❌ Error fetching user tickets:", error);
//     res.status(500).json({ error: "Failed to retrieve user tickets" });
//   }
// });

// export default ticketRouter;

import express from "express";
import mongoose from "mongoose";
import Stripe from "stripe";
import TicketModel from "../models/Tickets.js";
import FestivalModel from "../models/Festivals.js";
import UserModel from "../models/Users.js";
import { authenticateUser } from "../middlewares/authMiddleware.js";
import dotenv from "dotenv";

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const ticketRouter = express.Router();

// 🎟️ Create Payment Intent API
ticketRouter.post("/create-payment-intent", authenticateUser, async (req, res) => {
  const { festivalId, quantity } = req.body;

  if (!festivalId || !quantity) {
    return res.status(400).json({ error: "Festival ID and quantity are required" });
  }

  const userId = req.user.id;

  try {
    // 🔍 Fetch festival details
    const festival = await FestivalModel.findById(festivalId);
    if (!festival) {
      return res.status(404).json({ error: "Festival not found" });
    }

    // 💰 Calculate the total price
    const totalPrice = festival.ticketPrice * quantity;

    // 🏦 Create a Stripe PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalPrice * 100, // Stripe uses cents
      currency: "sek",
      automatic_payment_methods: { enabled: true },
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      message: "Payment intent created.",
    });
  } catch (error) {
    console.error("❌ Error creating payment intent:", error.message);
    res.status(500).json({ error: "An error occurred while processing the request." });
  }
});

// 🎟️ Purchase Ticket API with Stripe
ticketRouter.post("/:festivalId", authenticateUser, async (req, res) => {
  const { festivalId } = req.params;
  const userId = req.user.id;
  const { quantity, paymentIntentId } = req.body;

  if (!quantity || !paymentIntentId) {
    return res.status(400).json({ error: "Quantity and Payment Intent ID are required" });
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

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    if (paymentIntent.status !== "succeeded") {
      await session.abortTransaction();
      return res.status(400).json({ error: "Payment not successful" });
    }

    const totalPrice = (paymentIntent.amount / 100).toFixed(2);

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

    // ✅ Update User Profile with Purchased Ticket
    console.log("🔍 Updating user profile with ticket purchase...");
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      {
        $push: {
          purchasedTickets: {
            festivalId,
            quantity,
            purchaseDate: new Date(),
          },
          payments: {
            amount: totalPrice,
            paymentMethod: "Stripe",
            status: "Completed",
            paymentDate: new Date(),
          },
        },
      },
      { new: true, session }
    );

    if (!updatedUser) {
      console.log("❌ User not found, cannot update profile");
      await session.abortTransaction();
      return res.status(404).json({ error: "User not found" });
    }

    await session.commitTransaction();
    session.endSession();

    console.log("✅ Successfully updated user profile:", updatedUser);

    res.status(201).json({
      message: "✅ Payment successful, ticket purchased, and attached to user profile",
      ticket,
      user: updatedUser,
    });

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("❌ Ticket purchase failed:", error.message);
    res.status(500).json({ error: "Ticket purchase failed", details: error.message });
  }
});

 

// ✅ Fetch User Tickets API

ticketRouter.get("/user", authenticateUser, async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch the user with populated tickets
    const user = await UserModel.findById(userId)
      .select("purchasedTickets")
      .populate({
        path: "purchasedTickets.festivalId",
        model: "Festival", // ✅ Ensure it matches the registered model name
        select: "name ticketPrice location date",
      });

    if (!user || user.purchasedTickets.length === 0) {
      return res.status(200).json({ tickets: [] });
    }

    res.status(200).json({ tickets: user.purchasedTickets });
  } catch (error) {
    console.error("❌ Error fetching user tickets:", error.message);
    res.status(500).json({ error: "Failed to retrieve user tickets" });
  }
});


export default ticketRouter;
