import cloudinaryFramework from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

const cloudinary = cloudinaryFramework.v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // From .env
  api_key: process.env.CLOUDINARY_API_KEY,      // From .env
  api_secret: process.env.CLOUDINARY_API_SECRET // From .env
});

// Configure Cloudinary Storage
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'Home', // Folder name in Cloudinary
    allowed_formats: ['jpg', 'png'], // Allowed image formats
    transformation: [{ width: 500, height: 500, crop: 'limit' }], // Resize options
  },
});

// Set up Multer parser
const parser = multer({ storage });

export { cloudinary, parser };
