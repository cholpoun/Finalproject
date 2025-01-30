import express from "express";
import mongoose from "mongoose";
import UserModel from "../models/Users.js";
import { authenticateUser } from "../middlewares/authMiddleware.js";

const paymentRouter = express.Router();

// Payment endpoint
paymentRouter.post("/", authenticateUser, async (req, res) => {
  const userId = req.user.id;
  const { amount, paymentMethod, festivalId } = req.body; // Optional: Link to ticket purchase

  if (!amount || !paymentMethod) {
    return res.status(400).json({ error: "Amount and payment method are required" });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 🚀 Simulated Payment Processing (Replace with Stripe/PayPal integration)
    const paymentStatus = "Completed"; // Change to "Pending" if real payment is required

    // If using Stripe/PayPal, verify payment here before continuing

    // Update user with new payment record
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      {
        $push: {
          payments: {
            amount,
            paymentMethod,
            status: paymentStatus,
            paymentDate: new Date(),
            festivalId: festivalId || null, // Link payment to a festival if provided
          },
        },
      },
      { new: true, session }
    );

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      message: "Payment successful and attached to user profile",
      paymentDetails: {
        amount,
        paymentMethod,
        status: paymentStatus,
        paymentDate: new Date(),
        festivalId: festivalId || null,
      },
      updatedUser,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ error: "Payment failed", details: error.message });
  }
});

export default paymentRouter;
