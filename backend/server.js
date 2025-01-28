import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import festivalRouter from "./routes/festivalsRoutes.js";
import ticketRouter from "./routes/ticketRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import imgRouter from "./routes/imgRoutes.js";
import { parser } from "./config/cloudinaryConfig.js";

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
      "/festivals": "Get a paginated list of all festivals",
      "/festivals/:id": "Get details of a specific festival",
      "/festivals/recreate-mongo-data-from-json": "Recreate the MongoDB collection from JSON",
      "/tickets/:festivalId": "Purchase tickets for a specific festival (authenticated users only)",
      "/users/register": "Register a new user",
      "/users/login": "Log in an existing user",
      "/users/profile": "Get the profile of the currently logged-in user (authenticated users only)",
      "/img": "Upload an image and save metadata to the database",
      "/home": "Upload an image directly to Cloudinary and return URL and ID"
    },
    endpoints: [
      {
        path: "/festivals",
        methods: ["GET"],
        middlewares: ["anonymous"],
        description: "Get a paginated list of all festivals"
      },
      {
        path: "/festivals/:id",
        methods: ["GET"],
        middlewares: ["anonymous"],
        description: "Get details of a specific festival"
      },
      {
        path: "/festivals/recreate-mongo-data-from-json",
        methods: ["GET"],
        middlewares: ["anonymous"],
        description: "Recreate the MongoDB collection from JSON"
      },
      {
        path: "/tickets/:festivalId",
        methods: ["POST"],
        middlewares: ["authenticated"],
        description: "Purchase tickets for a specific festival"
      },
      {
        path: "/users/register",
        methods: ["POST"],
        middlewares: ["anonymous"],
        description: "Register a new user"
      },
      {
        path: "/users/login",
        methods: ["POST"],
        middlewares: ["anonymous"],
        description: "Log in an existing user"
      },
      {
        "path": "/users/profile",
        "methods": ["GET"],
        "middlewares": ["authenticateUser"],
        "description": "Get the profile of the currently logged-in user"
      },
      {
        path: "/img",
        methods: ["POST"],
        middlewares: ["authenticated"],
        description: "Upload an image and save metadata to the database"
      },
      {
        path: "/home",
        methods: ["POST"],
        middlewares: ["anonymous"],
        description: "Upload an image directly to Cloudinary and return URL and ID"
      }
    ]
  });
});

// Routes
app.use("/festivals", festivalRouter);
app.use("/tickets", ticketRouter);
app.use("/users", userRoutes);
app.use('/img', imgRouter);

// Middleware to Verify JWT (Authentication)
const authenticate = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Protected Route (Requires Authentication)
app.get('/users/:id/profile', authenticate, (req, res) => {
  const userProfile = { userId: req.user.userId, username: "JohnDoe" }; // Example profile
  res.json(userProfile);
});

// Default Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!", details: err.message });
});

// Start the Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
