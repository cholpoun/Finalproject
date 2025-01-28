import express from "express";
import mongoose from "mongoose";
import FestivalModel from "../models/Festivals.js"; // Import your Festival model
import { festivals } from "../data/festivals.js";
import { parser } from "../config/cloudinaryConfig.js"; // Import Cloudinary parser

const festivalRouter = express.Router(); // Router initialization

// *** (WARNING) RE-CREATES ALL DATA in the Festival Collection ***
festivalRouter.get("/recreate-mongo-data-from-json", async (req, res) => {
  try {
    const deleteNullResults = await FestivalModel.deleteMany({ _id: null });
    const deleteResults = await FestivalModel.deleteMany({});
    console.log("Deleted old data", { deleteNullResults, deleteResults });

    const createResults = await FestivalModel.insertMany(festivals, { rawResult: true });
    console.log("Re-created data from JSON file", { createResults });

    res.sendStatus(201);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

// Route to upload a festival image
festivalRouter.post("/upload", parser.single("image"), async (req, res) => {
  try {
    // Access the uploaded file's Cloudinary URL
    const imageUrl = req.file.path;

    res.status(200).json({ message: "Image uploaded successfully", imageUrl });
  } catch (error) {
    console.error("Image upload failed", error);
    res.status(500).json({ error: "Failed to upload image", details: error.message });
  }
});

// Route to get all festivals with pagination
festivalRouter.get("/", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  try {
    // Fetch paginated festivals
    const festivals = await FestivalModel.find().skip(skip).limit(limit);
    const totalItems = await FestivalModel.countDocuments();

    res.status(200).json({
      data: festivals,
      currentPage: page,
      totalPages: Math.ceil(totalItems / limit),
      totalItems,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch festivals", details: error.message });
  }
});

// Route to get a festival by ID
festivalRouter.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const festival = await FestivalModel.findById(id);
    if (!festival) {
      return res.status(404).json({ error: "Festival not found" });
    }

    res.json(festival);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch festival", details: error.message });
  }
});

export default festivalRouter;
