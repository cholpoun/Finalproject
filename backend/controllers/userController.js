import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import UserModel from "../models/Users.js";

export const signup = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: "Alla fält måste fyllas i" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await UserModel.create({ username, email, password: hashedPassword });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.status(201).json({ user, token });
  } catch (error) {
    res.status(500).json({ error: "Registrering misslyckades" });
  }
};
