const cloudinary = require("cloudinary").v2;
const fs = require("fs");
require("dotenv").config();

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET, // Click 'View API Keys' above to copy your API secret
});

const uploadFileOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    console.log(
      "File has uploaded successfully on Cloudinary",
      response.secure_url
    );
    fs.unlinkSync(localFilePath); // Delete local file after successful upload
    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath);
    console.error("Error in uploading file on Cloudinary:", error); // Log the actual error
    return null;
  }
};

module.exports = uploadFileOnCloudinary;
