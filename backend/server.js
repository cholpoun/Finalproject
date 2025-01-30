// import express from "express";
// import cors from "cors";
// import mongoose from "mongoose";
// import dotenv from "dotenv";
// import jwt from "jsonwebtoken";
// import festivalRouter from "./routes/festivalsRoutes.js";
// import ticketRouter from "./routes/ticketRoutes.js";
// import userRoutes from "./routes/userRoutes.js";
// import uploadRoutes from "./routes/uploadRoutes.js";
// import paymentRoutes from "./routes/paymentRoutes.js"; // Import the payment routes
// // import stripeRoutes from "./routes/stripeRoutes.js";  // Future Stripe integration
// import { authenticateUser } from "./middlewares/authMiddleware.js"; 

// dotenv.config(); // Load environment variables

// const app = express();

// // CORS Configuration - Allow frontend access
// app.use(
//   cors({
//     origin: ["http://localhost:5173", "https://yourfrontend.com"], // Allow local dev + production
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//   })
// );

// app.use(express.json()); // Middleware to handle JSON data

// // Routes
// app.use("/festivals", festivalRouter);
// app.use("/tickets", ticketRouter);
// app.use("/users", userRoutes); 
// app.use("/upload", uploadRoutes); 
// app.use("/payments", paymentRoutes); // Added payment routes
// // app.use("/api/stripe", stripeRoutes); // Uncomment when Stripe is integrated

// // Protected route example - Authentication via JWT
// app.get("/users/:id/profile", authenticateUser, (req, res) => {
//   res.json({ userId: req.user.id, username: req.user.username });
// });

// // Global Error Handling Middleware
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).json({
//     error: "Something went wrong!",
//     details: err.message,
//   });
// });

// // Connect to MongoDB
// const connectToDB = async () => {
//   try {
//     await mongoose.connect(process.env.MONGO_URI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//     console.log("✅ Connected to MongoDB");
//   } catch (error) {
//     console.error("❌ MongoDB Connection Error:", error.message);
//     process.exit(1);
//   }
// };
// connectToDB();

// // Start Server
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`🚀 Server running at http://localhost:${PORT}`);
// });





// NEW CODE 

import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import festivalRouter from "./routes/festivalsRoutes.js";
import ticketRouter from "./routes/ticketRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js"; // Import the payment routes
import { authenticateUser } from "./middlewares/authMiddleware.js"; 

dotenv.config(); // Load environment variables

const app = express();

// 🔹 CORS Configuration - Allow frontend access
app.use(
  cors({
    origin: ["http://localhost:5173", "https://yourfrontend.com"], // Allow local dev + production
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json()); // Middleware to handle JSON data

// 🔹 Routes
app.use("/festivals", festivalRouter);
app.use("/tickets", ticketRouter); // ✅ Ensure ticket routes are included
app.use("/users", userRoutes);
app.use("/upload", uploadRoutes);
app.use("/payments", paymentRoutes);

// ✅ Protected route to fetch user profile
app.get("/users/me/profile", authenticateUser, async (req, res) => {
  try {
    res.json({ userId: req.user.id, username: req.user.username });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch profile", details: error.message });
  }
});

// ✅ New Route to Fetch User Tickets (Ensures it's handled correctly)
app.use("/tickets", ticketRouter); // ✅ Ensure ticket routes are used

// 🔹 Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.stack);
  res.status(500).json({
    error: "Something went wrong!",
    details: err.message,
  });
});

// 🔹 Connect to MongoDB
const connectToDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message);
    process.exit(1);
  }
};
connectToDB();

// 🔹 Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
