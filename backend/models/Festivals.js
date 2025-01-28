import mongoose from "mongoose";

// Skapa schema för festival med tomt 'image' fält
const FestivalSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  genre: { type: String, required: true },
  date: { type: Date, required: true },
  ticketPrice: { type: Number, required: true },
  availableTickets: { type: Number, required: true },
  image: { type: String, default: "" }, // Fält för bild, kan vara tomt från början
});

const Festival = mongoose.model("Festival", FestivalSchema);

export default Festival;
