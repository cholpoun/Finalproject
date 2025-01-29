import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import festivalRouter from "./routes/festivalsRoutes.js";
import ticketRouter from "./routes/ticketRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
// import stripeRoutes from "./routes/stripeRoutes.js";  // Import the stripe routes
import { authenticateUser } from "./middlewares/authMiddleware.js"; // Lägg till autentisering

dotenv.config(); // Ladda miljövariabler tidigt

const app = express();

// CORS-konfiguration - Tillåt bara din frontend-URL
app.use(
  cors({
    origin: "http://localhost:5173", // Din React frontends URL
    methods: ["GET", "POST", "PUT", "DELETE"], // Tillåtna HTTP-metoder
    allowedHeaders: ["Content-Type", "Authorization"], // Tillåtna headers
  })
);

app.use(express.json()); // Middleware för att hantera JSON-data

// Routes
app.use("/festivals", festivalRouter);
app.use("/tickets", ticketRouter);
app.use("/users", userRoutes); // Använd användarrutter för registrering, inloggning och profil
app.use("/upload", uploadRoutes); // Upload-routes för filhantering
// app.use("/api/stripe", stripeRoutes); // Add Stripe routes

// Skyddade routes exempel - Autentisering via JWT
app.get("/users/:id/profile", authenticateUser, (req, res) => {
  // Profilruta skyddad av JWT
  const userProfile = { userId: req.user.id, username: req.user.username }; // Här använder du korrekt ID
  res.json(userProfile);
});

// Felhantering Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: "Något gick fel!",
    details: err.message,
  });
});

// Anslutning till MongoDB
const connectToDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Ansluten till MongoDB");
  } catch (error) {
    console.error("Fel vid anslutning till MongoDB:", error.message);
    process.exit(1); // Avsluta processen om databasen inte ansluter
  }
};
connectToDB();

// Starta servern
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servern körs på http://localhost:${PORT}`);
});
