import mongoose from "mongoose";

const ImageSchema = new mongoose.Schema({
  url: { type: String, required: true },
  public_id: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now },
});

const Image = mongoose.model("Image", ImageSchema);
export default Image;
