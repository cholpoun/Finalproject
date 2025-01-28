import express from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import FestivalImg from "../models/festivalImg.js";
import FestivalModel from "../models/Festivals.js"; // Importera festivalmodellen

const router = express.Router();

// Konfigurera Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer-konfiguration för Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "festival-images", // Mappen där bilderna lagras
    allowed_formats: ["jpg", "jpeg", "png"],
  },
});

const parser = multer({ storage });

// POST-rutt för att ladda upp en bild
router.post("/img", parser.single("image"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No image file uploaded" });
  }

  try {
    // Spara bilden i FestivalImg-samlingen med både url och public_id från Cloudinary
    const festivalImg = await new FestivalImg({
      url: req.file.path, // Cloudinary URL
      public_id: req.file.filename, // Cloudinary public_id
    }).save();

    res.status(201).json(festivalImg);
  } catch (err) {
    res
      .status(400)
      .json({ error: "Failed to save image", details: err.message });
  }
});

// GET-rutt för att hämta alla bilder
router.get("/img", async (req, res) => {
  try {
    const images = await FestivalImg.find();
    res.status(200).json(images);
  } catch (err) {
    res
      .status(400)
      .json({ error: "Failed to fetch images", details: err.message });
  }
});

// Rutt för att koppla en bild till en festival
router.put("/festival/:festivalId/img", async (req, res) => {
  const { festivalId } = req.params;
  const { imageId } = req.body; // Förväntar oss ett imageId från body

  try {
    // Uppdatera festivalen med bildens referens (imageId från FestivalImg)
    const updatedFestival = await FestivalModel.findByIdAndUpdate(
      festivalId,
      { imageUrl: imageId }, // Koppla festivalen till den valda bilden via imageId
      { new: true } // Returnera den uppdaterade festivalen
    );

    if (!updatedFestival) {
      return res.status(404).json({ error: "Festival not found" });
    }

    res.status(200).json(updatedFestival);
  } catch (err) {
    res.status(400).json({
      error: "Failed to update festival with image",
      details: err.message,
    });
  }
});

export default router;
