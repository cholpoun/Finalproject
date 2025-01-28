import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

// Konfigurera Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Konfigurera CloudinaryStorage för Multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'festival-images', // Cloudinary-mapp för att spara bilder
    allowed_formats: ['jpg', 'png', 'jpeg'],
  },
});

const parser = multer({ storage }); // Multer konfigurerad för Cloudinary
