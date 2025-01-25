import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import UserModel from '../models/Users.js';

// Registrera användare
export const signup = async (req, res) => {
  const { username, email, password } = req.body;

  // Kontrollera att alla fält är ifyllda
  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Alla fält måste fyllas i' });
  }

  try {
    // Kolla om e-posten redan finns
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'E-postadressen är redan registrerad' });
    }

    // Hascha lösenordet
    const hashedPassword = await bcrypt.hash(password, 10);

    // Skapa användaren
    const user = await UserModel.create({ username, email, password: hashedPassword });

    // Skapa JWT-token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Returnera användardata och token
    res.status(201).json({ user, token });
  } catch (error) {
    res.status(500).json({ error: 'Registrering misslyckades', details: error.message });
  }
};

// Hämta användarprofil (exempel på en skyddad rutt)
export const getUserProfile = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id); // Använda req.user från authMiddleware
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Kunde inte hämta användarprofil', details: error.message });
  }
};
