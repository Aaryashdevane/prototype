const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Authenticate user
const protect = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Not authorized, no token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Not authorized, token failed" });
  }
};

// Authorize only Municipal Staff
const municipalOnly = (req, res, next) => {
  if (req.user && req.user.role === "municipal") {
    next();
  } else {
    res.status(403).json({ message: "Access denied. Municipal staff only" });
  }
};

module.exports = { protect, municipalOnly };
