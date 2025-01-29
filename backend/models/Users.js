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

// Hash password before saving (via pre-save hook)
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); // Om lösenordet inte är ändrat, gör ingenting
  try {
    console.log("Password before saving:", this.password); // Logga lösenordet innan hashning

    const hashedPassword = await bcrypt.hash(this.password, 10); // Hasha lösenordet om det är ändrat
    this.password = hashedPassword; // Ersätt det o-hashade lösenordet med det hashade
    next();
  } catch (err) {
    next(err);
  }
});

// Remove password from response (no need to expose password)
UserSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password; // Ta bort lösenordet från svaret
  return user;
};

const UserModel = mongoose.model("users", UserSchema);
export default UserModel;
