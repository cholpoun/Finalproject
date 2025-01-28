import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";  
import festivalRouter from "./routes/festivalsRoutes.js";
import ticketRouter from "./routes/ticketRoutes.js";
import userRoutes from "./routes/userRoutes.js"; 
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "cloudinary";

// Load environment variables
dotenv.config();

// Create Express app
const app = express();
app.use(cors());
app.use(express.json());

// Check if JWT secret is available
const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
  console.error("JWT_SECRET is not defined in the .env file");
  process.exit(1); 
}

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Log Cloudinary environment variables for debugging
console.log('Cloudinary Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME);
console.log('Cloudinary API Key:', process.env.CLOUDINARY_API_KEY);
console.log('Cloudinary API Secret:', process.env.CLOUDINARY_API_SECRET);

// Multer Configuration with Cloudinary Storage
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'Home', // Specify your folder name (e.g., "Home")
    allowedFormats: ['jpg', 'jpeg', 'png'],
  },
});

const parser = multer({ storage }); // Multer setup

// POST route to upload images to Cloudinary
app.post('/Home', parser.single('image'), async (req, res) => {
  try {
    console.log(req.file); // Log the file object for debugging

    if (!req.file) {
      return res.status(400).json({ message: 'No image file uploaded' });
    }

    // Respond with image data from Cloudinary
    res.json({ imageUrl: req.file.path, imageId: req.file.filename });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ error: 'Failed to upload image', details: error.message });
  }
});

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
      "/users/profile": "Get the profile of the currently logged-in user (authenticated users only)"
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
        path: "/users/profile",
        methods: ["GET"],
        middlewares: ["authenticated"],
        description: "Get the profile of the currently logged-in user"
      }
    ]
  });
});

// Routes
app.use("/festivals", festivalRouter);
app.use("/tickets", ticketRouter);
app.use("/users", userRoutes);

// Middleware for JWT authentication
const authenticate = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', ''); // Get token from headers

  if (!token) {
    return res.status(401).json({ error: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret); // Verify token
    req.user = decoded;  // Add decoded user info to the request
    next();  // Proceed to the next middleware or route
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
