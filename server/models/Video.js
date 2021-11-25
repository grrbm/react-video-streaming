const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const video = new Schema(
  {
    name: { type: String, unique: true },
    group: { type: String },
    videoinformation: { type: String },
    videoThumbnail: { type: Buffer },
  },
  { timestamps: true }
);
module.exports = Video = mongoose.model("Video", video);
