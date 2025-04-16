const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Complaint = require("../models/Complaint");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

// Ensure uploads folder exists
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
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

// Serve Uploaded Files
router.use("/uploads",protect,express.static(uploadDir));

// Register Complaint endpoint (POST /register)
router.post("/register",protect,upload.single("file"), async (req, res) => {
  try {
    // Destructure new fields from the request body, including coordinates.
    const { location, description, user, coordinates } = req.body;
    const fileUrl = req.file ? `/uploads/${req.file.filename}` : null;

    // Require all fields (you can adapt as necessary)
    if (!location || !description || !fileUrl || !user || !coordinates) {
      return res.status(400).json({ error: "All fields are required including coordinates and user" });
    }

    const newComplaint = new Complaint({
      location,
      description,
      user,         // Make sure this is included
      media: fileUrl,
      coordinates,  // New field!
      status: "Pending",
    });
    
    await newComplaint.save();

    res.status(201).json({ 
      message: "Complaint registered successfully", 
      complaint: newComplaint 
    });
  } catch (error) {
    console.error("Error saving complaint:", error);
    res.status(500).json({ error: "Failed to register complaint" });
  }
});

// Other endpoints (get complaints, update status, etc.) remain unchanged.

module.exports = router;
