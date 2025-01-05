const express = require("express");
const router = express.Router();
// const cloudinary = require("../config/cloudinary.config");
const uploadCloud = require("../config/multer.config");
const fileModel = require("../models/file.model");
const authMiddleware = require("../middlewares/authe");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
require("dotenv").config();

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET, // Click 'View API Keys' above to copy your API secret
});
// router.get("/", (req, res) => {
//   res.redirect("/home");
// });
// router.get("/", (req, res) => {
//   UserModel.find({})
//     .then((users) => res.json(users))
//     .catch((error) => res.json(error));
// });
router.get("/home", authMiddleware, async (req, res) => {
  try {
    // console.log(req.user.userId);

    const files = await fileModel.find({ user: req.user.userId });
    // console.log("username =>", req.user.username);
    const username = req.user.username;
    // res.render("home", { files });
    res.json({ files, username });
  } catch (error) {
    console.log(error);

    res
      .status(500)
      .json({ message: "Error fetching files", error: error.message });
  }
});

router.post(
  "/upload",
  authMiddleware,
  uploadCloud.single("uploadfile"),
  async (req, res) => {
    try {
      // console.log("uploading file");
      // console.log(req.file);

      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const newFile = await fileModel.create({
        path: req.file.path,
        originalname: req.file.originalname,
        user: req.user.userId,
      });
      res.json(newFile);
      // res.redirect("/home");
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error uploading file", error: error.message });
    }
  }
);

router.get("/download/:id", authMiddleware, async (req, res) => {
  try {
    const loggedInUserId = req.user.userId;
    const id = req.params.id;

    if (!id) {
      return res.status(400).json({ message: "File ID is required" });
    }

    const file = await fileModel.findOne({
      user: loggedInUserId,
      _id: id,
    });
    // console.log(" one file =", file);

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }
    // console.log("success");
    // console.log(file.path, file.id);

    // // Generate a signed download URL with an expiration time of 5 minutes (300 seconds)
    // const signedUrl = cloudinary.utils.private_download_url(
    //   file.id, // The public ID of the file
    //   null, // No transformations
    //   {
    //     resource_type: "raw", // For non-image resources like documents or videos
    //     expires_at: Math.floor(Date.now() / 1000) + 300, // Expire in 5 minutes
    //   }
    // );
    // console.log("Private Signed URL:", signedUrl);

    // Fetch the file's download URL from Cloudinary (we use the secure_url)
    const signedUrl = cloudinary.url(file.path, {
      secure: true, // Use HTTPS for secure download
      resource_type: "auto", // Let Cloudinary determine the resource type
    });
    // console.log("Private Signed URL:", signedUrl);
    if (!signedUrl || !signedUrl[0]) {
      return res.status(500).json({ message: "Error generating download URL" });
    }

    res.json(signedUrl);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error downloading file", error: error.message });
  }
});

module.exports = router;
