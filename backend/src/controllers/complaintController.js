const Complaint = require("../models/Complaint");

// Register a complaint
const registerComplaint = async (req, res) => {
  try {
    const { description, location } = req.body;
    const media = req.file ? req.file.path : null;

    const newComplaint = new Complaint({
      user: req.user._id,
      description,
      location,
      media,
    });

    await newComplaint.save();
    res.status(201).json({ message: "Complaint registered successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get complaints of a user
const getComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({ user: req.user._id });
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { registerComplaint, getComplaints };
