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

    // Hämta användaren baserat på userId från den dekrypterade token
    const user = await UserModel.findById(decoded.userId).select("-password");

    // Kontrollera om användaren finns
    if (!user) {
      return res.status(401).json({ error: "Invalid user" });
    }

    // Kontrollera om den begärda användaren matchar den autentiserade användaren
    console.log("Requested User ID:", req.params.id);
    console.log("Authenticated User ID:", user._id.toString());

    // Om användarens ID inte matchar, ge åtkomstvägran
    if (user._id.toString() !== req.params.id) {
      return res.status(403).json({ error: "Access denied. User mismatch." });
    }

    // Fäst användaren till requesten (utan lösenord)
    req.user = user;
    next();
  } catch (error) {
    console.log("Error verifying token:", error.message); // Debugging - visa eventuella fel vid verifikation

    res.status(401).json({ error: "Invalid or expired token" });
  }
};
