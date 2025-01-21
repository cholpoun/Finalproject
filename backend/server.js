import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import ticketRoutes from "./routes/ticketRoutes.js";
import festivalRouter from "./routes/festivalsRoutes.js";

// Load environment variables
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
const connectToDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
};

connectToDB();

// Load the JSON data files (updated to include the import assertion)
import { festivals } from './data/festivals.js';
import { users } from './data/users.js';
import { tickets } from './data/tickets.js';



// API overview and documentation
app.get("/", (req, res) => {
  res.send(`
    <h1>Welcome to the Festival API!</h1>
    <h2>Available Endpoints:</h2>
    <ul>
      <li><strong>GET /festivals</strong>: Get all festivals</li>
      <li><strong>GET /festivals/:id</strong>: Get a single festival by ID</li>
      <li><strong>POST /signup</strong>: Sign up a new user</li>
      <li><strong>POST /login</strong>: Log in a user</li>
      <li><strong>GET /users/:id/favourites</strong>: Get user's favourites</li>
      <li><strong>GET /users/:id/orders</strong>: Get user's orders</li>
      <li><strong>GET /tickets</strong>: Get all tickets</li>
      <li><strong>POST /tickets/purchase</strong>: Purchase tickets</li> 
    </ul>
  `);
});

// Route to get all festivals using festivalRouter
app.use("/festivals", festivalRouter);

// Route to get festival by ID (using hardcoded data for now)
// app.get("/festivals/:id", (req, res) => {
//   const festival = festivals.find(f => f.id === parseInt(req.params.id));
//   if (!festival) {
//     return res.status(404).json({ message: "Festival not found" });
//   }
//   res.json(festival);
// });

// Sign up endpoint
app.post("/signup", (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: "Name, email, and password are required" });
  }

  const existingUser = users.find(user => user.email === email);
  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }

  const newUser = { id: users.length + 1, name, email, password };
  users.push(newUser);
  res.status(201).json({ message: "User created", user: newUser });
});

// Login endpoint
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  const user = users.find(user => user.email === email);
  if (!user || user.password !== password) {
    return res.status(401).json({ message: "Invalid credentials" });
  }
  res.json({ message: "Login successful", user });
});

// Get user favourites (simulate with an empty array)
app.get("/users/:id/favourites", (req, res) => {
  const user = users.find(user => user.id === parseInt(req.params.id));
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  res.json({ favourites: [] });
});

// Get user orders (simulate with an empty array)
app.get("/users/:id/orders", (req, res) => {
  const user = users.find(user => user.id === parseInt(req.params.id));
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  res.json({ orders: [] });
});

// Get all tickets
app.get("/tickets", (req, res) => {
  res.json(tickets);
});

// Ticket purchase endpoint (simulated)
app.post("/tickets/purchase", (req, res) => {
  const { userId, festivalId, quantity } = req.body;
  const festival = festivals.find(f => f.id === festivalId);
  if (!festival) {
    return res.status(404).json({ message: "Festival not found" });
  }

  if (festival.availableTickets < quantity) {
    return res.status(400).json({ message: "Not enough tickets available" });
  }

  festival.availableTickets -= quantity;
  tickets.push({ userId, festivalId, quantity });
  res.status(201).json({ message: "Tickets purchased successfully" });
});

app.use('/tickets', ticketRoutes);

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
