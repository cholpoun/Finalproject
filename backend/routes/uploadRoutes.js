import express from "express";
import { parser } from "../config/cloudinaryConfig.js";
import Image from "../models/Image.js";

const router = express.Router();

// Uppladdnings-API
router.post("/", parser.single("image"), async (req, res) => {
  try {
    const { path, filename } = req.file;

    // Spara metadata i MongoDB
    const image = new Image({
      url: path,
      public_id: filename,
    });

    await image.save();

    res.status(200).json({ message: "Image uploaded and saved!", image });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: "Upload failed" });
  }
});

export default router;
