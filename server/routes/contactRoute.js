const express = require("express");
const router = express.Router();
const Contact = require("../models/Contact");

// Handle contact form submission
router.post("/", async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Save contact message to MongoDB
    const contactMessage = new Contact({ name, email, message });
    await contactMessage.save();

    res.status(200).json({ message: "Message saved successfully" });
  } catch (error) {
    console.error("Error handling contact form submission:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
