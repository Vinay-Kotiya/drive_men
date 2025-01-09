const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const userModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const cookieParser = require("cookie-parser");
router.use(cookieParser());

router.get("/register", (req, res) => {
  res.json("register");
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
    console.log(hashPassword);

    const newUser = await userModel.create({
      username,
      email,
      password: hashPassword,
    });
    // console.log(newUser);
    // Remove multiple response sends - can only send one response
    // res.json(newUser);
    // res.redirect("/user/login");
    res.json({ message: "User created successfully" });
  }
);
router.get("/login", (req, res) => {
  res.json({ token: req.cookies.token });
});
router.post(
  "/login",
  body("username").trim().isLength({ min: 6 }),
  body("password").trim().isLength({ min: 6 }),
  async (req, res) => {
    const error = validationResult(req);
    // console.log("req.body =", req.body);

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
    // console.log(password, user.password);

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      console.log("password is incorrect");
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
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    // Set the token as a cookie
    res.cookie("token", token, {
      httpOnly: true, // Prevent access by client-side JavaScript
      secure: process.env.NODE_ENV === "production", // Ensure HTTPS in production
      // secure: false, // Use 'false' for local development
      maxAge: 3600000, // Cookie lifespan: 1 hour in milliseconds
      sameSite: "None", // Prevent cross-site request forgery
      path: "/", // Ensure the cookie is sent with all routes
    });
    res.json({ token: token });
    // console.log("token is", token);

    // console.log("login successful");
    // res.redirect("http://localhost:5173/home");
  }
);
router.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ message: "logout successful" });
});

module.exports = router;
