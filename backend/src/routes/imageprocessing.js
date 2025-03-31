const express = require("express");
const multer = require("multer");
const axios = require("axios");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// Send image to Python Microservice
router.post("/process-image", upload.single("image"), async (req, res) => {
    try {
        const file = req.file;
        const pythonApiUrl = "http://localhost:8000/process-image/";

        const formData = new FormData();
        formData.append("file", fs.createReadStream(file.path));

        const response = await axios.post(pythonApiUrl, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });

        res.json(response.data);
    } catch (error) {
        console.error("Error processing image:", error);
        res.status(500).json({ error: "Failed to process image" });
    }
});

module.exports = router;
