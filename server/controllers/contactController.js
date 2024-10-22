const Contact = require("../models/Contact");
const User = require("../models/User"); // Import User model
const mongoose = require("mongoose"); // Ensure you import mongoose

// Controller to create a new contact message
const jwt = require('jsonwebtoken'); // Import the jsonwebtoken library


// Controller to create a new contact message
exports.createContact = async (req, res) => {
    try {
        const token = req.cookies.authtoken; // Get the JWT from cookies
        // Check if token is provided
        if (!token) {
            return res.status(400).json({ message: "Authentication token is required" });
        }

        // Decode the token
        let userId;
        try {
            const decoded = jwt.verify(token, 'nobodyknows'); // Use your secret key here
            userId = decoded.id; // Extract the user ID from the decoded token
        } catch (err) {
            return res.status(401).json({ message: "Invalid or expired token" });
        }

        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Invalid user ID format" });
        }

        // Fetch user details
        const user = await User.findById(userId).select("name email");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const { message, subject } = req.body; // Extract message and subject from the request body

        // Validate input fields
        if (!message || !subject) {
            return res.status(400).json({ message: "Message and subject are required" });
        }

        // Create a new contact message
        const newContact = await Contact.create({
            user: userId,
            name: user.name,
            email: user.email,
            message,
            subject,
        });

        // Populate the contact message with user details
        const populatedContact = await Contact.findById(newContact._id).populate("user", "name email");

        res.status(201).json({ message: "Contact message created successfully", contact: populatedContact });
    } catch (error) {
        console.error("Error creating contact message:", error);
        res.status(500).json({ message: "An error occurred", error: error.message });
    }
};


// Controller to get all contact messages for admin
exports.getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().populate("user", "name email"); // Populate user details
    res.status(200).json(contacts);
  } catch (error) {
    console.error("Error fetching contact messages:", error);
    res.status(500).json({ message: "An error occurred", error: error.message }); // Consider simplifying error message
  }
};

// Controller to reply to a contact message
exports.replyToContact = async (req, res) => {
  try {
    const { id, reply } = req.body; // Expecting the ID of the contact message and reply message

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid contact ID format" });
    }

    const contact = await Contact.findById(id);
    if (!contact) {
      return res.status(404).json({ message: "Contact message not found" });
    }

    // Update the reply and status of the contact message
    contact.reply = reply;
    contact.status = "replied";
    await contact.save();

    // Populate the contact message with user details
    const populatedContact = await Contact.findById(contact._id).populate("user", "name email");

    res.status(200).json({ message: "Reply sent successfully", contact: populatedContact });
  } catch (error) {
    console.error("Error replying to contact message:", error);
    res.status(500).json({ message: "An error occurred", error: error.message }); // Consider simplifying error message
  }
};

// Controller to mark a contact message as read/unread
exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params; // Get the contact message ID from the request parameters
    const { status } = req.body; // Expecting the new status ("read" or "unread")

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid contact ID format" });
    }

    const contact = await Contact.findById(id);
    if (!contact) {
      return res.status(404).json({ message: "Contact message not found" });
    }

    // Update the status of the contact message
    contact.status = status;
    await contact.save();

    // Populate the contact message with user details
    const populatedContact = await Contact.findById(contact._id).populate("user", "name email");

    res.status(200).json({ message: "Contact message status updated successfully", contact: populatedContact });
  } catch (error) {
    console.error("Error marking contact message as read/unread:", error);
    res.status(500).json({ message: "An error occurred", error: error.message }); // Consider simplifying error message
  }
};
