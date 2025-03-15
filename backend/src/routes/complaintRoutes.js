const express = require("express");
const multer = require("multer");
const path = require("path");
const Complaint = require("../models/Complaint");

const router = express.Router(); // ✅ Define the router

// Set up storage for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Store uploads in "uploads" folder
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "video/mp4"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPEG, PNG, and MP4 files are allowed"), false);
  }
};

const upload = multer({ storage, fileFilter });

// ✅ Route to register a complaint
router.post("/register", upload.single("file"), async (req, res) => {
  try {
    const { location, description } = req.body;
    const filePath = req.file ? req.file.path : null;

    if (!location || !description || !filePath) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newComplaint = new Complaint({
      location,
      description,
      fileUrl: filePath,
      status: "Pending",
    });

    await newComplaint.save();

    res.status(201).json({ message: "Complaint registered successfully", complaint: newComplaint });
  } catch (error) {
    console.error("Error saving complaint:", error);
    res.status(500).json({ error: "Failed to register complaint" });
  }
});

module.exports = router; // ✅ Export the router properly
