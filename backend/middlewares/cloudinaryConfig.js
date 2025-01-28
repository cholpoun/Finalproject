import cloudinaryFramework from 'cloudinary';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

const cloudinary = cloudinaryFramework.v2;

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // Your Cloudinary Cloud Name
  api_key: process.env.CLOUDINARY_API_KEY,      // Your Cloudinary API Key
  api_secret: process.env.CLOUDINARY_API_SECRET // Your Cloudinary API Secret
});

// Cloudinary storage configuration
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'Festivals', // Folder in your Cloudinary Media Library
    allowedFormats: ['jpg', 'png'], // Allowed file formats
    transformation: [{ width: 500, height: 500, crop: 'limit' }], // Image transformations
  },
});

// Multer parser middleware
const parser = multer({ storage });

export { cloudinary, parser };
