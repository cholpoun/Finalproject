import express from "express";
import { festivals } from "../data/festivals.js";
import FestivalModel from "../models/Festivals.js";
import ImageModel from "../models/Image.js";

const festivalRouter = express.Router();

const attachRandomImages = async (festivals) => {
  try {
    const images = await ImageModel.find();

    if (!images.length) {
      throw new Error("No images found in the database.");
    }

    return festivals.map((festival) => {
      const randomImage = images[Math.floor(Math.random() * images.length)];
      return {
        ...festival.toObject(),
        image: randomImage.url,
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
    await FestivalModel.deleteMany({});
    console.log("Deleted old festival data");

    if (!festivals || !festivals.length) {
      return res.status(400).json({ error: "No festival data available." });
    }

    await FestivalModel.insertMany(festivals);
    console.log("Re-created data from JSON file");

    res.sendStatus(201);
  } catch (err) {
    console.error("Error during data recreation:", err);
    res.status(500).json({
      error: "Failed to recreate data from JSON.",
      details: err.message,
    });
  }
});

festivalRouter.get("/", async (req, res) => {
  const genreFilter = req.query.genre || "";

  try {
    let festivalsQuery = FestivalModel.find();

    if (genreFilter) {
      festivalsQuery = festivalsQuery.where("genre").equals(genreFilter);
    }

    const festivals = await festivalsQuery;

    if (!festivals.length) {
      return res.status(404).json({ error: "No festivals found." });
    }

    const festivalsWithImages = await attachRandomImages(festivals);

    res.status(200).json({
      data: festivalsWithImages,
      totalItems: festivals.length,
    });
  } catch (error) {
    console.error("Error fetching festivals:", error);
    res.status(500).json({
      error: "Failed to fetch festivals",
      details: error.message,
    });
  }
});

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
      bio: festival.bio,
      genre: festival.genre,
      location: festival.location,
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
