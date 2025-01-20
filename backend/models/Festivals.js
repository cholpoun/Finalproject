import mongoose from "mongoose";

const FestivalSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  genre: { type: String, required: true },
  date: { type: Date, required: true },
  ticketPrice: { type: Number, required: true },
  availableTickets: { type: Number, required: true },
});

const FestivalModel = mongoose.model("festivals", FestivalSchema);

export default FestivalModel;
