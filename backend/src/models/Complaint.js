const mongoose = require("mongoose");

const ComplaintSchema = new mongoose.Schema({
  
  description: String,
  location: String,
  fileUrl: String, // Optional: Image/Video
  status: { type: String, default: "Pending" }, // Default Status
});

module.exports = mongoose.model("Complaint", ComplaintSchema);
