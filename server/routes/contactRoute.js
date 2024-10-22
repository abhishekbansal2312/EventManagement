const express = require("express");
const router = express.Router();
const contactController = require("../controllers/contactController"); // Verify this path

// Route to create a new contact message
router.post("/", contactController.createContact); // This should not be undefined

// Route to get all contact messages (for admin)
router.get("/", contactController.getAllContacts); // This should not be undefined

// Route to reply to a contact message
router.post("/reply", contactController.replyToContact); // This should not be undefined

// Route to mark a contact message as read/unread
router.patch("/:id/read", contactController.markAsRead); // This should not be undefined

module.exports = router;
