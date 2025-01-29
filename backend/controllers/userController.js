import jwt from "jsonwebtoken";
import UserModel from "../models/Users.js";

export const signup = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: "Alla fält måste fyllas i" });
  }

  try {
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "E-postadressen är redan registrerad" });
    }

    // Skapa användaren utan att hashningen görs här
    const user = await UserModel.create({
      username,
      email,
      password, // Lösenordet skickas oförändrat till databasen
    });

    // Skapa JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(201).json({ user, token });
  } catch (error) {
    res.status(500).json({
      error: "Registrering misslyckades",
      details: error.message,
    });
  }
};

// Hämta användarprofil (exempel på en skyddad rutt)
export const getUserProfile = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id); // Använda req.user från authMiddleware
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({
      error: "Kunde inte hämta användarprofil",
      details: error.message,
    });
  }
};
