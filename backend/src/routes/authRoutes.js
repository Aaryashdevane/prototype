const express = require("express");
const { registerUser, loginUser } = require("../controllers/authController");
const { protect, municipalOnly } = require("../middleware/authMiddleware");

const router = express.Router();

// User registration
router.post("/register", registerUser);

// User login
router.post("/login", loginUser);

// Protected route example (Municipal Only)
router.get("/municipal-dashboard", protect, municipalOnly, (req, res) => {
  res.json({ message: "Welcome to the Municipal Dashboard" });
});

// Example protected NGO route
router.get("/ngo-dashboard", protect, (req, res) => {
  if (req.user.role !== "ngo") {
    return res.status(403).json({ message: "Access Denied" });
  }
  res.json({ message: "Welcome to the NGO Dashboard" });
});

  
module.exports = router;
