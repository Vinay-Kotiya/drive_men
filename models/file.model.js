const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
  path: {
    type: String,
    required: [true, "Path is Required"],
  },
  originalname: {
    type: String,
    required: [true, "OriginalName is Required"],
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: [true, "User is Required"],
  },
});
const file = mongoose.model("file", fileSchema);
module.exports = file;
