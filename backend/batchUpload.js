import fs from "fs";
import path from "path";
import cloudinary from "./config/cloudinaryConfig.js";
import Image from "./models/Image.js";
import mongoose from "mongoose";
import dotenv from "dotenv";

// Ladda miljövariabler från .env-filen
dotenv.config();

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const uploadImages = async () => {
  // Här skapar vi rätt sökväg till mappen "uploads"
  const folderPath = path.resolve("uploads"); // Använd resolve istället

  // Kontrollera om katalogen finns innan vi fortsätter
  if (!fs.existsSync(folderPath)) {
    console.error("Katalogen 'uploads' finns inte.");
    return;
  }

  const files = fs.readdirSync(folderPath);

  for (const file of files) {
    const filePath = path.join(folderPath, file);

    try {
      const result = await cloudinary.uploader.upload(filePath, {
        folder: "festival-images",
      });

      const image = new Image({
        url: result.secure_url,
        public_id: result.public_id,
      });

      await image.save();
      console.log(`Uploaded and saved: ${result.public_id}`);
    } catch (error) {
      console.error(`Failed to upload ${file}:`, error);
    }
  }

  mongoose.disconnect();
};

uploadImages();
