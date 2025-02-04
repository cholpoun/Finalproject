import mongoose from "mongoose";

const FestivalSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true }, // ✅ Ensures unique festival names
    ticketPrice: { type: Number, required: true, min: 0 }, // ✅ Prevents negative prices
    availableTickets: { type: Number, required: true, min: 0 }, // ✅ Prevents negative ticket count
    location: { type: String, required: true, trim: true },
    date: { 
      type: Date, 
      required: true,
      validate: {
        validator: function (value) {
          return value > new Date(); // Ensures the festival date is in the future
        },
        message: "Festival date must be in the future.",
      },
    },
    genre: { type: String, required: true, trim: true }, // ✅ Add genre field
    bio: { type: String, required: true, trim: true }, // ✅ Add bio field
    image: { type: String, default: "" }, // ✅ Add image field with default value
  },
  { timestamps: true } // ✅ Adds createdAt & updatedAt fields automatically
);

const FestivalModel = mongoose.model("Festival", FestivalSchema); // ✅ Ensure "Festival" matches your `ref`
export default FestivalModel;
