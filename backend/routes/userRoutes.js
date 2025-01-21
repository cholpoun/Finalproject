import express from "express";
import UserModel from "../models/Users.js"; // Skapa denna modell om den inte finns
import { users } from "../data/users.js"; // Din JSON-fil

const userRouter = express.Router();

// *** Route: Återställ users-data ***
userRouter.post("/recreate-mongo-data-from-json", async (req, res) => {
  const { apiKey } = req.body;
  const validApiKey = "your-secret-key";

  if (apiKey !== validApiKey) {
    return res.status(403).json({ error: "Unauthorized" });
  }

  try {
    await UserModel.deleteMany({});
    const createResults = await UserModel.insertMany(users);
    res.status(201).json({ message: "Users recreated successfully", createResults });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to recreate users", details: error.message });
  }
});

// *** Route: Hämta alla användare ***
userRouter.get("/", async (req, res) => {
  try {
    const allUsers = await UserModel.find();
    res.status(200).json(allUsers);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch users", details: error.message });
  }
});

// *** Route: Hämta specifik användare ***
userRouter.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const user = await UserModel.findById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user", details: error.message });
  }
});

export default userRouter;
