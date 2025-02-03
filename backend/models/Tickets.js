import mongoose from "mongoose";

const TicketSchema = new mongoose.Schema({
  festivalId: { type: mongoose.Schema.Types.ObjectId, ref: "Festival", required: true }, // ✅ Fix: Ensure correct model reference
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // ✅ Fix: Ensure correct model reference
  quantity: { type: Number, required: true, min: 1 },
  totalPrice: { type: Number, required: true, min: 0 },
  name: { type: String, required: true }, // ✅ Festival name for reference
  price: { type: Number, required: true, min: 0 }, // ✅ Price per ticket
  purchaseDate: { type: Date, required: true, default: Date.now }, // ✅ New: Tracks when the ticket was purchased
});

// ✅ Ensure population of festival and user data when querying tickets
TicketSchema.methods.getTicketDetails = async function () {
  return await this.populate("festivalId", "name location date ticketPrice")
    .populate("userId", "username email")
    .execPopulate();
};

const TicketModel = mongoose.model("Ticket", TicketSchema);

export default TicketModel;
