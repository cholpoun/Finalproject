import mongoose from "mongoose";

const TicketSchema = new mongoose.Schema({
  festivalId: { type: mongoose.Schema.Types.ObjectId, ref: "festivals", required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
  quantity: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  name: { type: String, required: true },  // Add name field
  price: { type: Number, required: true }, // Add price field
});

const TicketModel = mongoose.model("tickets", TicketSchema);

export default TicketModel;
