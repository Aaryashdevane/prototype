const mongoose = require("mongoose");

const ComplaintSchema = new mongoose.Schema({
  user: { type: String, ref: "User", required: true }, // link to user
  description: String,
  location: String,
  media: String, // make sure this matches what you're saving (in controller you had media, here it's fileUrl)
  status: { type: String, default: "Pending" }, // Pending, In Progress, Resolved
}, { timestamps: true });

module.exports = mongoose.model("Complaint", ComplaintSchema);
