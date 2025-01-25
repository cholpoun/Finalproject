import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import UserModel from '../models/Users.js';

const router = express.Router();
const jwtSecret = process.env.JWT_SECRET;


console.log(process.env.JWT_SECRET)

// Registrering av användare
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: "Alla fält är obligatoriska" });
  }

  try {
    // Kontrollera om användaren redan finns
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Användaren finns redan" });
    }

    // Hasha lösenordet
    const hashedPassword = await bcrypt.hash(password, 10);

    // Skapa en ny användare
    const newUser = new UserModel({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({ message: "Användare registrerad" });
  } catch (error) {
    res.status(500).json({ error: "Kunde inte registrera användaren", details: error.message });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email och lösenord är obligatoriska" });
  }

  try {
    // Hitta användaren i databasen
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Användaren finns inte" });
    }

    // Kontrollera lösenordet
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Felaktigt lösenord" });
    }

    // Skapa JWT token
    const token = jwt.sign({ userId: user._id, email: user.email }, jwtSecret, { expiresIn: '1h' });

    res.json({ message: "Inloggning lyckades", token });
  } catch (error) {
    res.status(500).json({ error: "Fel vid inloggning", details: error.message });
  }
});


export default router;
