// routes/taskRoutes.js

const router = require("express").Router();
const {
  getAllTasks,
  addTask,
  getTask,
  updateTask,
  deleteTask,
} = require("../controllers/taskController"); // Adjust the path according to your structure
const authenticateToken = require("../middlewares/verifyToken");
const authenticateAdmin = require("../middlewares/authenticateAdmin");

// Route to get all tasks for a specific event
router.get("/:eventId", getAllTasks); // Get all tasks for a specific event

// Route to add a new task to a specific event
router.post("/:eventId", addTask); // Add a new task to a specific event

// Route to get a specific task by ID under a specific event
router.get("/:eventId/:taskId", getTask); // Get a specific task by ID for a specific event

// Route to update a specific task by ID under a specific event
router.put("/:eventId/:taskId", updateTask); // Update a specific task for a specific event

// Route to delete a specific task by ID under a specific event
router.delete("/:eventId/:taskId", deleteTask); // Delete a specific task for a specific event

module.exports = router;
