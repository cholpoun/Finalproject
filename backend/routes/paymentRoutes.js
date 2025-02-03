import express from "express";
import mongoose from "mongoose";
import Stripe from "stripe";
import UserModel from "../models/Users.js";
import { authenticateUser } from "../middlewares/authMiddleware.js";
import dotenv from "dotenv";

dotenv.config();

const stripe = new Stripe(process.env.VITE_STRIPE_SECRET_KEY);
const paymentRouter = express.Router();

// 🎟️ Create Payment Intent API (For Frontend)
paymentRouter.post("/create-payment-intent", authenticateUser, async (req, res) => {
  const { amount, currency = "usd" } = req.body;

  if (!amount) {
    return res.status(400).json({ error: "Amount is required" });
  }

  try {
    // ✅ Create a Stripe Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Convert to cents
      currency,
      automatic_payment_methods: { enabled: true },
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      message: "✅ Payment intent created.",
    });
  } catch (error) {
    console.error("❌ Stripe Payment Intent Error:", error.message);
    res.status(500).json({ error: "Error creating payment intent" });
  }
});

// 🎟️ Process Payment & Save to User Profile
paymentRouter.post("/process-payment", authenticateUser, async (req, res) => {
  const userId = req.user.id;
  const { paymentIntentId, festivalId } = req.body;

  if (!paymentIntentId) {
    return res.status(400).json({ error: "Payment Intent ID is required" });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // ✅ Retrieve Payment from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    console.log("🟢 Stripe Payment Response:", paymentIntent);

    if (!paymentIntent || paymentIntent.status !== "succeeded") {
      console.log("❌ Payment not successful");
      await session.abortTransaction();
      return res.status(400).json({ error: "Payment was not successful" });
    }

    const amountPaid = (paymentIntent.amount / 100).toFixed(2); // Convert back from cents

    // ✅ Fetch User Before Update
    const user = await UserModel.findById(userId).session(session);
    if (!user) {
      console.log("❌ User not found");
      await session.abortTransaction();
      return res.status(404).json({ error: "User not found" });
    }

    console.log("🔍 User before payment update:", user);

    // ✅ Add Payment Record to User
    user.payments.push({
      amount: amountPaid,
      paymentMethod: "Stripe",
      status: "Completed",
      paymentDate: new Date(),
      festivalId: festivalId || null, // Link payment to festival if provided
    });

    await user.save({ session });

    await session.commitTransaction();
    session.endSession();

    console.log("✅ Successfully updated user payment record:", user);

    return res.status(201).json({
      message: "✅ Payment successful and added to user profile",
      paymentDetails: {
        amount: amountPaid,
        paymentMethod: "Stripe",
        status: "Completed",
        paymentDate: new Date(),
        festivalId: festivalId || null,
      },
      user,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("❌ Payment processing failed:", error.message);
    return res.status(500).json({ error: "Payment processing failed", details: error.message });
  }
});

export default paymentRouter;
