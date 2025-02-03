import express from "express";
import mongoose from "mongoose";
import Stripe from "stripe";
import TicketModel from "../models/Tickets.js";
import FestivalModel from "../models/Festivals.js";
import UserModel from "../models/Users.js";
import { authenticateUser } from "../middlewares/authMiddleware.js";
import dotenv from "dotenv";

dotenv.config();

const stripe = new Stripe(process.env.VITE_STRIPE_SECRET_KEY);
const ticketRouter = express.Router();

// 🎟️ Create Payment Intent API
ticketRouter.post("/create-payment-intent", authenticateUser, async (req, res) => {
  const { festivalId, quantity } = req.body;

  if (!festivalId || !quantity) {
    return res.status(400).json({ error: "Festival ID and quantity are required" });
  }

  try {
    // 🔍 Fetch Festival Details
    const festival = await FestivalModel.findById(festivalId);
    if (!festival) {
      return res.status(404).json({ error: "Festival not found" });
    }

    // 💰 Calculate Total Price
    const totalPrice = festival.ticketPrice * quantity;

    // 🏦 Create a Stripe Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalPrice * 100, // Stripe uses cents
      currency: "sek",
      automatic_payment_methods: { enabled: true },
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      message: "✅ Payment intent created.",
    });
  } catch (error) {
    console.error("❌ Error creating payment intent:", error.message);
    res.status(500).json({ error: "Error processing payment intent" });
  }
});

// 🎟️ Purchase Ticket API
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
    console.log("🟢 Processing ticket purchase...");
    console.log("User ID:", userId);
    console.log("Festival ID:", festivalId);
    console.log("Quantity:", quantity);
    console.log("Payment Intent ID:", paymentIntentId);

    // 🔍 Fetch Festival
    const festival = await FestivalModel.findById(festivalId).session(session);
    if (!festival) {
      console.log("❌ Festival not found");
      await session.abortTransaction();
      return res.status(404).json({ error: "Festival not found" });
    }

    if (festival.availableTickets < quantity) {
      console.log("❌ Not enough tickets available");
      await session.abortTransaction();
      return res.status(400).json({ error: "Not enough tickets available" });
    }

    // 🏦 Retrieve Payment from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    console.log("🟢 Stripe Payment Response:", paymentIntent);

    if (!paymentIntent || paymentIntent.status !== "succeeded") {
      console.log("❌ Payment not successful");
      await session.abortTransaction();
      return res.status(400).json({ error: "Payment was not successful" });
    }

    const totalPrice = (paymentIntent.amount / 100).toFixed(2);
    console.log("🟢 Payment Verified. Total Price:", totalPrice);

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
    console.log("✅ Ticket saved in database.");

    // ✅ Reduce Festival Tickets
    festival.availableTickets -= quantity;
    await festival.save({ session });

    // ✅ Fetch User Before Update
    const user = await UserModel.findById(userId).session(session);
    if (!user) {
      console.log("❌ User not found");
      await session.abortTransaction();
      return res.status(404).json({ error: "User not found" });
    }

    console.log("🔍 User before update:", user);

    // ✅ Ensure `purchasedTickets` is initialized
    if (!user.purchasedTickets) {
      user.purchasedTickets = [];
    }
    if (!user.payments) {
      user.payments = [];
    }

    // ✅ Manually Push Purchased Ticket (Include ticketId)
    user.purchasedTickets.push({
      festivalId,
      ticketId: ticket._id, // Link the ticketId
      quantity,
      purchaseDate: new Date(),
    });

    // ✅ Save Payment Information to User Profile
    user.payments.push({
      amount: totalPrice,
      paymentMethod: "Stripe",
      status: "Completed",
      paymentDate: new Date(),
      festivalId: festivalId, // Link payment to this festival
    });

    await user.save({ session });
    console.log("✅ Successfully updated user profile:", user);

    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({
      message: "✅ Payment successful, ticket purchased, and added to user profile",
      ticket,
      user,
    });

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("❌ Ticket purchase failed:", error.message);
    return res.status(500).json({ error: "Ticket purchase failed", details: error.message });
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
