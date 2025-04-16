const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register User
const registerUser = async (req, res) => {
  const {
    name,
    email,
    password,
    mobile,
    address,
    role,
    state,
    district,
    municipalCoordinates,
  } = req.body;

  try {
    console.log("📥 Incoming Data:", req.body); // Log incoming data

    const userExists = await User.findOne({ email });
    if (userExists) {
      console.log("❌ User already exists");
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      mobile,
      address,
      role,
      state,
      district,
      municipalCoordinates,
    });

    console.log("✅ User Created:", user); // Log the created user
    res.status(201).json({ message: "User registered successfully!", user });
  } catch (error) {
    console.error("❌ Error:", error.message); // Log the error
    res.status(500).json({ error: error.message });
  }
};

// Login User
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user and include the password field
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    // Compare the provided password with the hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    // Generate a JWT token
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "30d" });

    // Exclude the password field from the response
    const { password: _, ...userWithoutPassword } = user.toObject();

    // Return the token and user data
    res.json({ token, user: userWithoutPassword });
  } catch (error) {
    console.error("❌ Error during login:", error.message);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { registerUser, loginUser };
