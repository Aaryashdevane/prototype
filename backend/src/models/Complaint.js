const mongoose = require("mongoose");

const ComplaintSchema = new mongoose.Schema({
  user: { type: String, ref: "User", required: true }, // link to user
  description: String,
  location: String,           // Human-readable address
  coordinates: String,        // New field: raw numeric coordinates as a JSON string, e.g. "[18.5204, 73.8567]"
  media: String,
  status: { type: String, default: "Pending" }, // Pending, In Progress, Resolved
}, { timestamps: true });

module.exports = mongoose.model("Complaint", ComplaintSchema);
