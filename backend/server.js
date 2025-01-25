import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";  
import festivalRouter from "./routes/festivalsRoutes.js";
import ticketRouter from "./routes/ticketRoutes.js";
import userRoutes from "./routes/userRoutes.js"; 

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Hämta JWT_SECRET från miljövariabler
const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret) {
  console.error("JWT_SECRET is not defined in the .env file");
  process.exit(1); // Exit the process if the JWT_SECRET is not found
}

// Connect to MongoDB
const connectToDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
  }
};

connectToDB();

// API Overview and Documentation
app.get("/", (req, res) => {
  res.send(`
    <h1>Welcome to the Festival API!</h1>
    <h2>Available Endpoints:</h2>
    <ul>
      <li><strong>GET /festivals</strong>: Get a paginated list of all festivals</li>
      <li><strong>GET /festivals/:id</strong>: Get details of a specific festival by ID</li>
      <li><strong>POST /festivals/recreate-mongo-data-from-json</strong>: Recreate the MongoDB collection from JSON</li>
      <li><strong>POST /tickets/:festivalId</strong>: Purchase tickets for a festival (authenticated users only)</li>
      <li><strong>POST /users/favourites/:festivalId</strong>: Mark a festival as favorite (authenticated users only)</li>
      <li><strong>GET /users/:id/profile</strong>: Get the user's profile by ID (authenticated users only)</li>
      <li><strong>POST /users/register</strong>: Register a new user</li>
      <li><strong>POST /users/login</strong>: Log in an existing user</li>
    </ul>
    <h2>Authentication:</h2>
    <p>For endpoints requiring authentication, please provide a JWT token in the Authorization header as a Bearer token.</p>
  `);
});

// Routes
app.use("/festivals", festivalRouter);
app.use("/tickets", ticketRouter);
app.use("/users", userRoutes);

// Middleware för att verifiera JWT (autentisering)
const authenticate = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', ''); // Hämta token från headers

  if (!token) {
    return res.status(401).json({ error: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret); // Verifiera token
    req.user = decoded;  // Lägg till den dekodade användarinformationen i request
    next();  // Gå vidare till nästa middleware eller ruta
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Skyddad rutt som kräver autentisering
app.get('/users/:id/profile', authenticate, (req, res) => {
  const userProfile = { userId: req.user.userId, username: "JohnDoe" }; // Detta är en exempelprofil, ersätt med riktig logik.
  res.json(userProfile);
});

// Default Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!", details: err.message });
});

// Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
