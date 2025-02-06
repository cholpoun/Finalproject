import mongoose from "mongoose";

const FestivalSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    ticketPrice: { type: Number, required: true, min: 0 },
    availableTickets: { type: Number, required: true, min: 0 },
    location: { type: String, required: true, trim: true },
    date: {
      type: Date,
      required: true,
      validate: {
        validator: function (value) {
          return value > new Date();
        },
        message: "Festival date must be in the future.",
      },
    },
    genre: { type: String, required: true, trim: true },
    bio: { type: String, required: true, trim: true },
    image: { type: String, default: "" },
  },
  { timestamps: true }
);

const FestivalModel = mongoose.model("Festival", FestivalSchema);
export default FestivalModel;
