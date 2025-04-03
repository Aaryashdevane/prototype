const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Complaint = require("../models/Complaint");

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

// 📌 Serve Uploaded Files
router.use("/uploads", express.static(uploadDir));

// 📌 Register Complaint
router.post("/register", upload.single("file"), async (req, res) => {
  try {
    const { location, description, user } = req.body;
    const fileUrl = req.file ? `/uploads/${req.file.filename}` : null;

    if (!location || !description || !fileUrl || !user) {
      return res.status(400).json({ error: "All fields are required including user" });
    }

    const newComplaint = new Complaint({
      location,
      description,
      user,  // ✅ Make sure this is included
      fileUrl,
      status: "Pending",
    });
    

    await newComplaint.save();

    res.status(201).json({ message: "Complaint registered successfully", complaint: newComplaint });
  } catch (error) {
    console.error("Error saving complaint:", error);
    res.status(500).json({ error: "Failed to register complaint" });
  }
});

// 📌 Get Complaints for a Specific User
router.get("/user/:email", async (req, res) => {
  console.log("hello");
  const { email } = req.params;

  try {
    const userComplaints = await Complaint.find({ user: email }).sort({ createdAt: -1 });

    res.json({ complaints: userComplaints }); // ✅ Ensuring correct response format
  } catch (error) {
    res.status(500).json({ error: "Error fetching user's complaints" });
  }
});

// 📌 Get All Complaints (for Admin/Municipal Dashboard)
router.get("/all", async (req, res) => {
  try {
    const complaints = await Complaint.find();
    res.json({ complaints });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 📌 Update Complaint Status
router.put("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    const complaint = await Complaint.findById(id);
    if (!complaint) {
      return res.status(404).json({ error: "Complaint not found" });
    }

    complaint.status = status;
    await complaint.save();

    res.json({ message: "Status updated successfully", complaint });
  } catch (error) {
    res.status(500).json({ error: "Failed to update status" });
  }
});

module.exports = router;
