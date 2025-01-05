const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
app.use(bodyParser.json());
app.use(cookieParser());

function auth(req, res, next) {
  const token = req.cookies.token;
  //   res.send(token);
  // console.log(token);

  if (!token) {
    console.log("Unauthorized token is empty");
    return res.status(401).json({ message: "Unauthorized token is empty" });

    // res.redirect("/user/login");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    // console.log(req.user, "decoded");

    return next();
  } catch (error) {
    console.log(error);

    // return res.status(400).json({ message: "Unauthorized token is invalid" });
    // .send(error);
  }
}

module.exports = auth;
