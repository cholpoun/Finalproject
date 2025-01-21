import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  favouriteFestivals: [{ type: mongoose.Schema.Types.ObjectId, ref: "festivals" }],
  purchasedTickets: [
    {
      festivalId: { type: mongoose.Schema.Types.ObjectId, ref: "festivals" },
      quantity: { type: Number, required: true },
      purchaseDate: { type: Date, required: true },
    },
  ],
});

const UserModel = mongoose.model("users", UserSchema);

export default UserModel;
