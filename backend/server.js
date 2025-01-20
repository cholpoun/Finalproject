import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import ticketRoutes from './routes/ticketRoutes.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Load the JSON data files
const festivals = JSON.parse(fs.readFileSync(path.resolve('./models/festivals.json')));
const users = JSON.parse(fs.readFileSync(path.resolve('./models/users.json')));
const tickets = JSON.parse(fs.readFileSync(path.resolve('./models/tickets.json')));

// Handle GET request to the root route
app.get("/", (req, res) => {
  res.send(`
    <h1>Welcome to the Festival API!</h1>
    <h2>Available Endpoints:</h2>
    <ul>
      <li><strong>GET /</strong>: Welcome message and API overview</li>
      <li><strong>GET /festivals/:id</strong>: Get festival by ID</li>
      <li><strong>GET /festivals</strong>: Get all festivals</li> 
      <li><strong>POST /signup</strong>: Sign up a new user</li>
      <li><strong>POST /login</strong>: Log in a user</li>
      <li><strong>GET /users/:id/favourites</strong>: Get user's favourites</li>
      <li><strong>GET /users/:id/orders</strong>: Get user's orders</li>
      <li><strong>GET /tickets</strong>: Get all tickets</li>
      <li><strong>POST /tickets/purchase</strong>: Purchase tickets</li> 
    </ul>
  `);
});

// Get all festivals
app.get("/festivals", (req, res) => {
  res.json(festivals);
});

// Get festival by ID
app.get("/festivals/:id", (req, res) => {
  const festival = festivals.find(f => f.id === req.params.id);
  if (!festival) {
    return res.status(404).json({ message: "Festival not found" });
  }
  res.json(festival);
});

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

  const newUser = { name, email, password };
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
  const user = users.find(user => user.id === req.params.id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  res.json({ favourites: [] });
});

// Get user orders (simulate with an empty array)
app.get("/users/:id/orders", (req, res) => {
  const user = users.find(user => user.id === req.params.id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  res.json({ orders: [] });
});

// Get all tickets
app.get("/tickets", (req, res) => {
  res.json(tickets);
});

app.use('/tickets', ticketRoutes);

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
