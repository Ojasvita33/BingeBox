const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: "" },
  genre: { type: String, default: "" },
  releaseYear: { type: Number, default: 0 },
  videoUrl: { type: String, required: true },   // Internet Archive MP4 or YouTube embed
  posterUrl: { type: String, default: "" },
  rating: { type: Number, default: 0, min: 0, max: 10 }
}, { timestamps: true });

module.exports = mongoose.model("Movie", movieSchema);
