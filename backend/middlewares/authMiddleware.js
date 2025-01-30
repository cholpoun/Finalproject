// import jwt from "jsonwebtoken";
// import UserModel from "../models/Users.js";

// export const authenticateUser = async (req, res, next) => {
//   // Försök att hämta token från Authorization headern
//   const token = req.header("Authorization")?.replace("Bearer ", "");

//   if (!token) {
//     return res.status(401).json({ error: "Authentication required" });
//   }

//   try {
//     // Debugging - visa den mottagna token
//     console.log("Token received:", token);

//     // Verifiera JWT-token
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     // Debugging - visa den dekrypterade token
//     console.log("Decoded JWT:", decoded);

//     // Hämta användaren baserat på userId från den dekrypterade token
//     const user = await UserModel.findById(decoded.userId).select("-password");

//     // Kontrollera om användaren finns
//     if (!user) {
//       return res.status(401).json({ error: "Invalid user" });
//     }

//     // Logga användarens ID och den begärda användaren
//     console.log("Authenticated User ID:", user._id.toString());

//     // Kontrollera om den begärda användaren matchar den autentiserade användaren
//     if (user._id.toString() !== req.params.id) {
//       return res.status(403).json({ error: "Access denied. User mismatch." });
//     }

//     // Fäst användaren till requesten (utan lösenord)
//     req.user = user;

//     // Skicka användar-ID till nästa middleware eller rutt
//     req.userId = user._id.toString();
//     next();
//   } catch (error) {
//     console.log("Error verifying token:", error.message); // Debugging - visa eventuella fel vid verifikation

//     res.status(401).json({ error: "Invalid or expired token" });
//   }
// };


import jwt from "jsonwebtoken";
import UserModel from "../models/Users.js";

export const authenticateUser = async (req, res, next) => {
  // Get token from Authorization header
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    console.log("❌ No token provided");
    return res.status(401).json({ error: "Authentication required" });
  }

  try {
    // Debugging - Show received token
    console.log("✅ Token received:", token);

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Debugging - Show decoded token
    console.log("✅ Decoded JWT:", decoded);

    // Extract the correct user ID (Fix: use `userId` instead of `id`)
    const userId = decoded.userId; // ✅ Corrected!
    console.log("🔍 Extracted User ID from token:", userId);

    // Fetch user from database
    const user = await UserModel.findById(userId).select("-password");

    if (!user) {
      console.log("❌ No user found in database for this ID");
      return res.status(401).json({ error: "Invalid user" });
    }

    // Debugging - Log authenticated user ID
    console.log("✅ Authenticated User ID:", user._id.toString());

    // Attach user to request
    req.user = user;
    req.userId = user._id.toString();

    next(); // Continue to next middleware/route
  } catch (error) {
    console.log("❌ Error verifying token:", error.message);
    res.status(401).json({ error: "Invalid or expired token" });
  }
};
