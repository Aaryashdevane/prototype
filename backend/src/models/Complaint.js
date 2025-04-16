const mongoose = require("mongoose");

const ComplaintSchema = new mongoose.Schema({
  user: { type: String, ref: "User", required: true }, // link to user
  description: String,
  location: String,           // Human-readable address
  coordinates: String,        // New field: raw numeric coordinates as a JSON string, e.g. "[18.5204, 73.8567]"
  media: String,
  nearestDistrictCoordinates: { // Store as an object instead of a string
    lat: { type: Number },
    lon: { type: Number },
  }, // New field: nearest district coordinates as a JSON string
  status: { type: String, default: "Pending" }, // Pending, In Progress, Resolved
}, { timestamps: true });

ComplaintSchema.index({ nearestDistrictCoordinates: "2dsphere" });
module.exports = mongoose.model("Complaint", ComplaintSchema);
