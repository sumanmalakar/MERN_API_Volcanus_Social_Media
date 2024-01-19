import express from "express";
import {
  addPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
  likePostById,
  commentPostById,
  getCommentByPostId
  // findCommentByPostId,
} from "../controllers/post.js";

import { Authenticate } from "../middlewares/auth.js";

import {multerConfig} from '../utils/multer.js'

export const postRouter = express.Router();

postRouter.post("/addpost", Authenticate, addPost);

postRouter.get("/posts", getPosts);

postRouter.get("/post/:id", Authenticate, getPostById);

postRouter.put("/post/:id", Authenticate, updatePost);

postRouter.delete("/post/:id", Authenticate, deletePost);
 
postRouter.post("/post/like/:id",Authenticate, likePostById);

postRouter.post("/post/comment/:id",Authenticate, commentPostById);

postRouter.get("/post/comment/:id", Authenticate, getCommentByPostId);



// file uplaod
import mongoose from "mongoose";
import cloudinary from "cloudinary";

const { v2: cloudinaryV2 } = cloudinary;

// Configure Cloudinary
cloudinaryV2.config({
  cloud_name: "dhnat7kyj",
  api_key: "913248448857885",
  api_secret: "S1mgGlkv8yYjcPMEuDkERpO20Gc",
});

// Create a mongoose model for your files and user information
const User = mongoose.model("UserFile", {
  name: String,
  email: String,
  password: String,
  file: String,
  public_id: String,
  url: String,
});

// Assuming postRouter and cloudinaryV2 are properly defined
postRouter.post("/upload", multerConfig.single("file"), async (req, res) => {
  try {
    // Ensure that a file was uploaded
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    // Access the file information
    const file = req.file;

    // Assuming cloudinaryV2 is properly configured and imported
    const uploadResponse = await cloudinaryV2.uploader.upload(req.file.path);

    // Save file and user information to MongoDB
    // Assuming User model is properly defined
    const newUser = await User.create({
      file: file.originalname,
      public_id: uploadResponse.public_id,
      url: uploadResponse.secure_url,
    });

    // Send response with user data and file upload URL
    res.status(200).json({
      message: "File and user information uploaded to Cloudinary successfully",
      user: newUser,
      fileUrl: uploadResponse.secure_url,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


// nodemailer

import nodemailer from "nodemailer";
// Nodemailer configuration
const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  auth: {
    user: "tamia.stiedemann49@ethereal.email",
    pass: "wDSEb43HSrDThuu8bq",
  },
});

// Express route to send an email
postRouter.get("/email", (req, res) => {
  // Email options
  const mailOptions = {
    from: "'r'<tamia.stiedemann49@ethereal.email>", // Sender's email address
    to: "codesnippet02@gmail.com,", // Receiver's email address
    subject: "Test Email",
    text: "Hello, this is a test email from Nodemailer in Node.js Express.",
  };

  // Send email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    } else {
      console.log("Email sent: " + info.response);
      res.status(200).json({ success: true, message: "Email sent successfully" });
    }
  });
});

