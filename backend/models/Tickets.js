import mongoose from "mongoose";

const TicketSchema = new mongoose.Schema({
  festivalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Festival",
    required: true,
  },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  quantity: { type: Number, required: true, min: 1 },
  totalPrice: { type: Number, required: true, min: 0 },
  name: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  purchaseDate: { type: Date, required: true, default: Date.now },
});

TicketSchema.methods.getTicketDetails = async function () {
  return await this.populate("festivalId", "name location date ticketPrice")
    .populate("userId", "username email")
    .execPopulate();
};

const TicketModel = mongoose.model("Ticket", TicketSchema);

export default TicketModel;
