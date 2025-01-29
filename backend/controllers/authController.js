import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import UserModel from "../models/Users.js";

// Login-funktion
export const login = async (req, res) => {
  const { email, password } = req.body;

  // Kontrollera att fälten är ifyllda
  if (!email || !password) {
    return res.status(400).json({ error: "Alla fält måste fyllas i" });
  }

  try {
    // Hitta användaren i databasen
    const user = await UserModel.findOne({ email });
    console.log("Hittad användare:", user); // Debugga för att se om användaren finns i databasen
    if (!user) return res.status(400).json({ error: "Användaren finns inte" });

    // Jämför lösenordet
    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Lösenordsjämförelse:", isMatch);
    if (!isMatch) return res.status(400).json({ error: "Felaktigt lösenord" });

    // Skapa JWT-token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    console.log("Generated token:", token); // Debugging - logga token här

    // Returnera användardata och token
    res.status(200).json({ user, token });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Inloggning misslyckades", details: error.message });
  }
};
