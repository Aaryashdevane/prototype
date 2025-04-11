const express = require('express');
const axios = require('axios');
const rateLimit = require('express-rate-limit'); // Rate limiter to avoid overloading the external service
const router = express.Router();

// Apply rate limiter middleware to this route
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes window
  max: 100, // Limit each IP to 100 requests per window
  message: 'Too many requests from this IP, please try again later.',
});

router.use(limiter); // Apply the rate limiter to all reverse geocoding requests

router.get('/reverse', async (req, res) => {
  const { lat, lon } = req.query;

  if (!lat || !lon) {
    return res.status(400).json({ error: 'Missing required parameters: lat and lon' });
  }

  try {
    // Ensure your identifying email is set (replace with a valid one)
    const email = 'your-email@example.com';  // Replace with a valid email
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&email=${email}`;
    
    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    console.error('Error in reverse geocoding proxy:', error.message);
    
    // Provide a better error message based on the error response
    if (error.response) {
      res.status(error.response.status).json({ error: `Reverse geocoding failed: ${error.response.data.error}` });
    } else {
      res.status(500).json({ error: 'Reverse geocoding failed: Internal server error' });
    }
  }
});

module.exports = router;
