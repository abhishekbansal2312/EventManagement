const router = require("express").Router();
const {
  getAllEvents,
  addEvent,
  getEvent,
  updateEvent,
  deleteEvent,
  updateEventGallery,
  addParticipants, // Import the addParticipants controller
  deleteImageFromGallery,
  removeParticipants
} = require("../controllers/eventController");
const authenticateToken = require("../middlewares/verifyToken");
const authenticateAdmin = require("../middlewares/authenticateAdmin");

// Routes accessible by authenticated users
router.get("/", getAllEvents); // Any authenticated user can view all events
router.get("/:id", authenticateToken, getEvent); // Any authenticated user can view a specific event

// Routes requiring admin access
router.post("/",authenticateAdmin, addEvent); // Only admin can create an event
router.put("/:id",authenticateAdmin, updateEvent); // Only admin can update an event
router.delete("/:id",authenticateAdmin, deleteEvent); // Only admin can delete an event

// Route to add participants to an event by eventId (Admin only)
router.post("/:id/participants",authenticateAdmin, addParticipants); 
router.delete("/:id/participants",authenticateAdmin, removeParticipants)

router.put("/:id/gallery",authenticateAdmin, updateEventGallery);
router.delete("/:id/gallery",authenticateAdmin, deleteImageFromGallery)

module.exports = router;
