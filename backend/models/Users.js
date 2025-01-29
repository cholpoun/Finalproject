import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  favouriteFestivals: [
    { type: mongoose.Schema.Types.ObjectId, ref: "festivals" },
  ],
  purchasedTickets: [
    {
      festivalId: { type: mongoose.Schema.Types.ObjectId, ref: "festivals" },
      quantity: { type: Number, required: true },
      purchaseDate: { type: Date, required: true },
    },
  ],
});

// Hash password before saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const hashedPassword = await bcrypt.hash(this.password, 10);
    this.password = hashedPassword;
    next();
  } catch (err) {
    next(err);
  }
});

// Remove password from response
UserSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password; // Password is removed from the response
  return user;
};

const UserModel = mongoose.model("users", UserSchema);
export default UserModel;
