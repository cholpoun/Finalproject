// // NEW CODE 

// import express from "express";
// import cors from "cors";
// import mongoose from "mongoose";
// import dotenv from "dotenv";
// import festivalRouter from "./routes/festivalsRoutes.js";
// import ticketRouter from "./routes/ticketRoutes.js";
// import userRoutes from "./routes/userRoutes.js";
// import uploadRoutes from "./routes/uploadRoutes.js";
// import paymentRoutes from "./routes/paymentRoutes.js"; // Import the payment routes
// import { authenticateUser } from "./middlewares/authMiddleware.js"; 

// dotenv.config(); // Load environment variables

// const app = express();

// // 🔹 CORS Configuration - Allow frontend access
// app.use(
//   cors({
//     origin: ["http://localhost:5173", "https://yourfrontend.com"], // Allow local dev + production
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//   })
// );

// app.use(express.json()); // Middleware to handle JSON data

// // 🔹 Routes
// app.use("/festivals", festivalRouter);
// app.use("/tickets", ticketRouter); // ✅ Ensure ticket routes are included
// app.use("/users", userRoutes);
// app.use("/upload", uploadRoutes);
// app.use("/payments", paymentRoutes);

// // ✅ Protected route to fetch user profile
// app.get("/users/me/profile", authenticateUser, async (req, res) => {
//   try {
//     res.json({ userId: req.user.id, username: req.user.username });
//   } catch (error) {
//     res.status(500).json({ error: "Failed to fetch profile", details: error.message });
//   }
// });

// // ✅ New Route to Fetch User Tickets (Ensures it's handled correctly)
// app.use("/tickets", ticketRouter); // ✅ Ensure ticket routes are used

// // 🔹 Global Error Handling Middleware
// app.use((err, req, res, next) => {
//   console.error("❌ Error:", err.stack);
//   res.status(500).json({
//     error: "Something went wrong!",
//     details: err.message,
//   });
// });

// // 🔹 Connect to MongoDB
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

// // 🔹 Start Server
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`🚀 Server running at http://localhost:${PORT}`);
// });


// CODE WITH STRIPE 

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
    origin: ["http://localhost:5173"], // Allow your frontend origin
    methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
    credentials: true, // Allow cookies and authentication headers
  })
);

app.use(express.json()); // Middleware to handle JSON data

// 🔹 Routes
app.use("/festivals", festivalRouter);
app.use("/tickets", ticketRouter); // ✅ Ensure ticket routes are included
app.use("/users", userRoutes);
app.use("/upload", uploadRoutes);
app.use("/payments", paymentRoutes);
app.use("/api/tickets", ticketRouter);


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
