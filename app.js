const express = require("express");
const userRouter = require("./routes/user.route");
const indexRouter = require("./routes/index.route");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
dotenv.config();
const connectToDB = require("./config/db");
const bodyParser = require("body-parser");
connectToDB();

// app.set("view engine", "ejs");
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//cors configuration
app.use(
  // cors()
  cors({
    // origin: "http://localhost:5173",
    origin: "https://driveclone.vercel.app",
    credentials: true,
  })
);
// Handle preflight requests
app.options("*", cors()); // This line handles OPTIONS requests globally

app.use("/", indexRouter);
app.use("/user", userRouter);
process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  console.log(err.name, err.message);
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server is running on port ", PORT);
});
