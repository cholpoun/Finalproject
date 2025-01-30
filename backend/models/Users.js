import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new mongoose.Schema(
  {
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

    payments: [
      {
        amount: { type: Number, required: true },
        paymentMethod: { type: String, required: true }, // Example: "Credit Card", "PayPal"
        status: { type: String, enum: ["Pending", "Completed", "Failed"], default: "Completed" },
        paymentDate: { type: Date, default: Date.now },
      },
    ],

    role: { type: String, enum: ["user", "admin"], default: "user" },

    // Timestamps for user creation & updates
  },
  { timestamps: true }
);

// Hash password before saving (via pre-save hook)
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); // Om lösenordet inte är ändrat, gör ingenting
  try {
    console.log("Password before saving:", this.password);

    const hashedPassword = await bcrypt.hash(this.password, 10);
    this.password = hashedPassword;
    next();
  } catch (err) {
    next(err);
  }
});

// Remove password from response (no need to expose password)
UserSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

const UserModel = mongoose.model("users", UserSchema);
export default UserModel;
