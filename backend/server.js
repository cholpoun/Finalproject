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

const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret) {
  console.error("JWT_SECRET is not defined in the .env file");
  process.exit(1); 
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
  res.json({
    message: "Welcome to the Festival API! Here are the available endpoints:",
    description: {
      "/festivals": "Get a list of all festivals",
      "/festivals/:id": "Get details of a specific festival",
      "/festivals/recreate-mongo-data-from-json": "Recreate the MongoDB collection from JSON",
      "/tickets/:festivalId": "Purchase tickets for a festival (authenticated users only)",
      "/users/favourites/:festivalId": "Mark a festival as favorite (authenticated users only)",
      "/users/:id/profile": "Get the user's profile (authenticated users only)",
      "/users/register": "Register a new user",
      "/users/login": "Log in an existing user",
      "/profil": "User profile"
    },
    endpoints: [
      {
        path: "/festivals",
        methods: ["GET"],
        middlewares: ["anonymous"]
      },
      {
        path: "/festivals/:id",
        methods: ["GET"],
        middlewares: ["anonymous"]
      },
      {
        path: "/tickets/:festivalId",
        methods: ["POST"],
        middlewares: ["authenticated"]
      },
      {
        path: "/users/favourites/:festivalId",
        methods: ["POST"],
        middlewares: ["authenticated"]
      },
      {
        path: "/users/:id/profile",
        methods: ["GET"],
        middlewares: ["authenticated"]
      },
      {
        path: "/users/register",
        methods: ["POST"],
        middlewares: ["anonymous"]
      },
      {
        path: "/users/login",
        methods: ["POST"],
        middlewares: ["anonymous"]
      }
    ]
  });
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
