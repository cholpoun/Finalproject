import jwt from "jsonwebtoken";
import UserModel from "../models/Users.js";

export const authenticateUser = async (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ error: "Inloggning krävs" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await UserModel.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ error: "Användare hittades inte" });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: "Ogiltig token" });
  }
};
