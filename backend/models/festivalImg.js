import mongoose from 'mongoose';

const FestivalImg = mongoose.model('FestivalImg', {
  name: { type: String, required: true },
  imageUrl: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default FestivalImg;
