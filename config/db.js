const mongoose = require("mongoose");
const connectToDB = () => {
  mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log("Database connected");
  });
};
module.exports = connectToDB;
