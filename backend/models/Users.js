import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },

    favouriteFestivals: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "festivals",
        unique: true, // Prevent duplicate festivals
      },
    ],

    purchasedTickets: [
      {
        festivalId: { type: mongoose.Schema.Types.ObjectId, ref: "festivals", required: true },
        quantity: { type: Number, required: true, min: 1 },
        purchaseDate: { type: Date, required: true, default: Date.now },
      },
    ],

    payments: [
      {
        amount: { type: Number, required: true, min: 1 },
        paymentMethod: { type: String, required: true, enum: ["Credit Card", "PayPal", "Bank Transfer"] },
        status: { type: String, enum: ["Pending", "Completed", "Failed"], default: "Completed" },
        paymentDate: { type: Date, default: Date.now },
      },
    ],

    role: { type: String, enum: ["user", "admin"], default: "user" },
  },
  { timestamps: true } // Adds `createdAt` & `updatedAt` fields
);

// ✅ Hash password before saving (only if modified)
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    console.log("Hashing password before saving...");
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (err) {
    next(err);
  }
});

// ✅ Prevent duplicate festival IDs in `favouriteFestivals`
UserSchema.methods.addFavoriteFestival = async function (festivalId) {
  if (!this.favouriteFestivals.includes(festivalId)) {
    this.favouriteFestivals.push(festivalId);
    await this.save();
  }
};

// ✅ Remove password from API responses
UserSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

const UserModel = mongoose.model("users", UserSchema);
export default UserModel;
