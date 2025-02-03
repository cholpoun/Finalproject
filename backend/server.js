import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import festivalRouter from "./routes/festivalsRoutes.js";
import ticketRouter from "./routes/ticketRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js"; // ✅ Import payment routes
import { authenticateUser } from "./middlewares/authMiddleware.js"; 

dotenv.config(); // ✅ Load environment variables

const app = express();

// ✅ Test if environment variables are loaded correctly
console.log("🟢 Loaded Environment Variables");
console.log("MongoDB URI:", process.env.MONGO_URI ? "✅ Loaded" : "❌ Not Found");
console.log("Stripe Secret Key:", process.env.VITE_STRIPE_SECRET_KEY ? "✅ Loaded" : "❌ Not Found");

// 🔹 CORS Configuration - Allow frontend access
app.use(
  cors({
    origin: ["http://localhost:5173"], // Allow frontend
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, // Allow cookies and authentication headers
  })
);

app.use(express.json()); // ✅ Middleware to handle JSON data

// ✅ Routes
app.use("/festivals", festivalRouter);
app.use("/tickets", ticketRouter); // Ensure ticket routes are included
app.use("/users", userRoutes);
app.use("/upload", uploadRoutes);
app.use("/payments", paymentRoutes);
app.use("/api/tickets", ticketRouter); // ✅ No duplicate `/tickets`

// ✅ Protected route to fetch user profile
app.get("/users/me/profile", authenticateUser, async (req, res) => {
  try {
    res.json({ userId: req.user.id, username: req.user.username });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch profile", details: error.message });
  }
});

// ✅ Test API route to ensure backend is running
app.get("/test", (req, res) => {
  res.json({ message: "🟢 Server is running!" });
});

// 🔹 Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.stack);
  res.status(500).json({
    error: "Something went wrong!",
    details: err.message,
  });
});

// 🔹 Connect to MongoDB with Error Handling
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

// ✅ Listen for MongoDB Connection Errors
mongoose.connection.on("error", (err) => {
  console.error("❌ MongoDB Connection Lost:", err.message);
});

connectToDB();

// 🔹 Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
