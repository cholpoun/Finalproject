import jwt from "jsonwebtoken";
import UserModel from "../models/Users.js";

export const authenticateUser = async (req, res, next) => {
  // Hämta token från Authorization header
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ error: "Inloggning krävs" });
  }

  try {
    // Verifiera JWT-token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Hitta användaren baserat på ID från token
    const user = await UserModel.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ error: "Ogiltig användare" });
    }

    // Lägg till användaren i request-objektet så andra funktioner kan använda det
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: "Ogiltig eller utgången token" });
  }
};
