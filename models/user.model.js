const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    minLenght: [6, "username must be at least 6 characters"],
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minLenght: [13, "email must be at least 13 characters"],
  },
  password: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minLenght: [6, "password must be at least 6 characters"],
  },
});

const user = mongoose.model("user", userSchema);
module.exports = user;
