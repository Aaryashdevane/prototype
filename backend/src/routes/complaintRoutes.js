const express = require("express");
const multer = require("multer");
const path = require("path");
const Complaint = require("../models/Complaint");

const router = express.Router();

// File upload config (keeping as-is)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
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


router.post("/register", upload.single("file"), async (req, res) => {
  try {
    const { location, description, user } = req.body;
    const filePath = req.file ? req.file.path : null;

    if (!location || !description || !filePath || !user) {
      return res.status(400).json({ error: "All fields are required including user" });
    }

    const newComplaint = new Complaint({
      location,
      description,
      user, // ✅ Add user field here!
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


// GET complaints specific to a user
router.get("/user/:email", async (req, res) => {
  const { email } = req.params;

  try {
    const userComplaints = await Complaint.find({ user: email }).sort({ createdAt: -1 });
    res.json(userComplaints);
  } catch (error) {
    res.status(500).json({ error: "Error fetching user's complaints" });
  }
});

// Get all complaints (for municipal dashboard)
router.get("/all", async (req, res) => {
  try {
    const complaints = await Complaint.find();
    res.json(complaints);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});




// ✅ Update Status (for MC dashboard)
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

    res.json({ message: "Status updated", complaint });
  } catch (error) {
    res.status(500).json({ error: "Failed to update status" });
  }
});
// PATCH route on complaintRoutes.js
router.patch("/update-status/:id", async (req, res) => {
  const { status } = req.body;
  try {
    await Complaint.findByIdAndUpdate(req.params.id, { status });
    res.json({ message: "Status updated successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to update status" });
  }
});





module.exports = router;
