import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true },

    favouriteFestivals: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Festival",
      },
    ],

    purchasedTickets: [
      {
        ticketId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Ticket",
          required: true,
        },
        festivalId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Festival",
          required: true,
        },
        quantity: { type: Number, required: true, min: 1 },
        purchaseDate: { type: Date, required: true, default: Date.now },
      },
    ],

    payments: [
      {
        amount: { type: Number, required: true, min: 1 },
        paymentMethod: {
          type: String,
          required: true,
          enum: ["Credit Card", "Stripe"],
        },
        status: {
          type: String,
          enum: ["Pending", "Completed", "Failed"],
          default: "Completed",
        },
        paymentDate: { type: Date, default: Date.now },
        festivalId: { type: mongoose.Schema.Types.ObjectId, ref: "Festival" },
      },
    ],

    role: { type: String, enum: ["user", "admin"], default: "user" },
  },
  { timestamps: true }
);

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

UserSchema.methods.addFavoriteFestival = async function (festivalId) {
  if (!this.favouriteFestivals.includes(festivalId.toString())) {
    this.favouriteFestivals.push(festivalId);
    await this.save();
  }
};

UserSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

UserSchema.methods.getPurchasedTickets = async function () {
  return await this.populate({
    path: "purchasedTickets.festivalId",
    select: "name ticketPrice location date",
  }).execPopulate();
};

const UserModel = mongoose.model("users", UserSchema);
export default UserModel;
