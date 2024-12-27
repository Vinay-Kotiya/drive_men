const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const userModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

router.get("/register", (req, res) => {
  res.render("register");
});
router.post(
  "/register",
  body("username").trim().isLength({ min: 6 }),
  body("email").trim().isEmail().isLength({ min: 13 }),
  body("password").trim().isLength({ min: 6 }),

  async (req, res) => {
    const error = validationResult(req);

    if (!error.isEmpty()) {
      return res
        .status(400)
        .json({ error: error.array(), message: "invalid data" }); // Fixed typo in "message"
    }
    const { username, email, password } = req.body;
    const hashPassword = await bcrypt.hash(password, 10);
    // console.log(hashPassword);

    const newUser = await userModel.create({
      username,
      email,
      password: hashPassword,
    });
    // console.log(newUser);
    // Remove multiple response sends - can only send one response
    // res.json(newUser);
    res.redirect("/user/login");
  }
);
router.get("/login", (req, res) => {
  res.render("login");
});
router.post(
  "/login",
  body("username").trim().isLength({ min: 6 }),
  body("password").trim().isLength({ min: 6 }),
  async (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res
        .status(400)
        .json({ error: error.array(), message: "invalid data" }); // Fixed typo in "message"
    }
    const { username, password } = req.body;
    const user = await userModel.findOne({ username: username });
    if (!user) {
      return res
        .status(400)
        .json({ message: "username or password is incorrect" }); // Fixed typo in "message"
    }

    const isMatch = bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "username or password is incorrect" }); // Fixed typo in "message"
    }

    const token = jwt.sign(
      {
        userId: user._id,
        username: user.username,
        email: user.email,
      },
      process.env.JWT_SECRET
    );
    res.cookie("token", token);
    // res.json({ message: "login successful" }); // Added proper response
    res.redirect("/home");
    // res.render("home");
    // res.alert("login successful");
  }
);

module.exports = router;
