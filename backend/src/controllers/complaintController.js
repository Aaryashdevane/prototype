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

const getAllComplaints = async (req, res) => {
  try {
    const { municipalCoordinates } = req.body;
    if (!municipalCoordinates) {
      return res.status(400).json({ error: "Municipal coordinates are required" });
    }

    const parsedCoordinates = JSON.parse(municipalCoordinates);
    parsedCoordinates.lat = parseFloat(parsedCoordinates.lat);
    parsedCoordinates.lon = parseFloat(parsedCoordinates.lon);
    console.log("Printing",parsedCoordinates);
    // Find complaints where nearestDistrictCoordinates match municipalCoordinates
    const complaints = await Complaint.find({
      "nearestDistrictCoordinates.lat": parsedCoordinates.lat,
      "nearestDistrictCoordinates.lon": parsedCoordinates.lon,
    });
    res.json({ message:"Success",ok:true, complaints:complaints });
  } catch (error) {
    console.error("Error fetching complaints:", error);
    res.status(500).json({ error: "Failed to fetch complaints" });
  }
};

module.exports = { registerComplaint, getComplaints,getAllComplaints };
