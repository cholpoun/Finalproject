import express from "express";
import { festivals } from "../data/festivals.js";
import FestivalModel from "../models/Festivals.js";
import ImageModel from "../models/Image.js";

const festivalRouter = express.Router();

/**
 * Utility function to attach a random image to each festival
 */
const attachRandomImages = async (festivals) => {
  try {
    const images = await ImageModel.find();

    // Kontrollera om vi har några bilder att koppla
    if (!images.length) {
      throw new Error("No images found in the database.");
    }

    // Koppla en slumpmässig bild till varje festival
    return festivals.map((festival) => {
      const randomImage = images[Math.floor(Math.random() * images.length)];
      return {
        ...festival.toObject(), // Mongoose till vanlig JavaScript-objekt
        image: randomImage.url, // Slumpmässig bild URL
      };
    });
  } catch (error) {
    console.error("Error attaching images:", error);
    throw new Error("Error attaching random images to festivals");
  }
};

// *** (WARNING) RE-CREATES ALL DATA in the Festival Collection ***

festivalRouter.get("/recreate-mongo-data-from-json", async (req, res) => {
  try {
    // Radera gammal data
    const deleteNullResults = await FestivalModel.deleteMany({ _id: null });
    const deleteResults = await FestivalModel.deleteMany({});
    console.log("Deleted old data", { deleteNullResults, deleteResults });

    // Kontrollera om `festivals` är tillgängligt från din fil
    if (!festivals || !festivals.length) {
      return res.status(400).json({ error: "No festival data available." });
    }

    // Skapa festivaler från JSON-filen
    const createResults = await FestivalModel.insertMany(festivals, {
      rawResult: true,
    });
    console.log("Re-created data from JSON file", { createResults });

    res.sendStatus(201);
  } catch (err) {
    console.error("Error during data recreation:", err);
    res.status(500).json({
      error: "Failed to recreate data from JSON.",
      details: err.message,
    });
  }
});

/**
 * Route to fetch festivals with pagination and random images attached
 */
festivalRouter.get("/", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  try {
    // Fetch paginated festivals
    const festivals = await FestivalModel.find().skip(skip).limit(limit);
    const totalItems = await FestivalModel.countDocuments();

    if (!festivals.length) {
      return res.status(404).json({ error: "No festivals found." });
    }

    // Koppla slumpmässiga bilder till festivaler
    const festivalsWithImages = await attachRandomImages(festivals);

    res.status(200).json({
      data: festivalsWithImages,
      currentPage: page,
      totalPages: Math.ceil(totalItems / limit),
      totalItems,
    });
  } catch (error) {
    console.error("Error fetching festivals:", error);
    res.status(500).json({
      error: "Failed to fetch festivals",
      details: error.message,
    });
  }
});

/**
 * Route to fetch a single festival by ID and attach a random image
 */
festivalRouter.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const festival = await FestivalModel.findById(id);
    if (!festival) {
      return res.status(404).json({ error: "Festival not found." });
    }

    const images = await ImageModel.find();
    if (!images.length) {
      return res
        .status(404)
        .json({ error: "No images found in the database." });
    }

    const randomImage = images[Math.floor(Math.random() * images.length)];
    const festivalWithImage = {
      ...festival.toObject(),
      image: randomImage.url,
    };

    res.status(200).json(festivalWithImage);
  } catch (error) {
    console.error("Error fetching festival by ID:", error);
    res.status(500).json({
      error: "Failed to fetch festival by ID.",
      details: error.message,
    });
  }
});

export default festivalRouter;
