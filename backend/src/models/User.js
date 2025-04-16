const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    mobile: { type: String, required: true },
    address: { type: String },
    role: { type: String, enum: ["user", "municipal", "ngo"], default: "user" },
    state: { type: String },
    district: { type: String },
    municipalCoordinates: { // Add municipalCoordinates field
      lat: { type: Number },
      lon: { type: Number },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
