const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,

  },
  CourseName: {
    type: String,
    required: true,

  },
  Desc: {
    type: String,
  },
  Uid: {
    type: String,
  },
}, { timestamps: true });

module.exports = mongoose.model("Feed", ReviewSchema);
