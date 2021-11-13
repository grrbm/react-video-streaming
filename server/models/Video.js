const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const video = new Schema(
  {
    name: String,
    root: { type: String, unique: true },
  },
  { timestamps: true }
);
module.exports = Video = mongoose.model('Video', video);
