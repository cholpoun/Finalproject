import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import FestivalImg from '../models/festivalImg.js';

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
    folder: 'festival-images', // Mappen där bilderna lagras
    allowed_formats: ['jpg', 'jpeg', 'png'],
  },
});

const parser = multer({ storage });

// POST-rutt för att ladda upp en bild
router.post('/img', parser.single('image'), async (req, res) => {
  try {
    const festivalImg = await new FestivalImg({
      name: req.body.name || req.file.originalname, // Namnet på bilden
      imageUrl: req.file.path, // Cloudinary-URL
    }).save();

    res.status(201).json(festivalImg);
  } catch (err) {
    res.status(400).json({ error: 'Failed to save image', details: err.message });
  }
});

// GET-rutt för att hämta bilder
router.get('/img', async (req, res) => {
  try {
    const images = await FestivalImg.find();
    res.status(200).json(images);
  } catch (err) {
    res.status(400).json({ error: 'Failed to fetch images', details: err.message });
  }
});

export default router;
