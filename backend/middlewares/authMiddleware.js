import jwt from "jsonwebtoken";
import UserModel from "../models/Users.js";

export const authenticateUser = async (req, res, next) => {
  // Försök att hämta token från Authorization headern
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ error: "Authentication required" });
  }

  try {
    console.log("Token received:", token); // Debugging - visa den mottagna token

    // Visa vilken JWT Secret som används för verifiering
    console.log("Verifying token with secret:", process.env.JWT_SECRET);

    // Verifiera JWT-token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Debugging - visa den dekrypterade token
    console.log("Decoded JWT:", decoded);

    // Hämta användaren baserat på ID lagrat i token
    const user = await UserModel.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ error: "Invalid user" });
    }

    // Fäst användaren till requesten (utan lösenord)
    req.user = user;
    next();
  } catch (error) {
    console.log("Error verifying token:", error.message); // Debugging - visa eventuella fel vid verifikation

    res.status(401).json({ error: "Invalid or expired token" });
  }
};
