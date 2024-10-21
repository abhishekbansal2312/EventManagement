// routes/facultyConvenerRoutes.js

const router = require("express").Router();
const {
  getAllFacultyConveners,
  addFacultyConvener,
  getFacultyConvener,
  updateFacultyConvener,
  deleteFacultyConvener,
} = require("../controllers/facultyController");
const authenticateToken = require("../middlewares/verifyToken");
const authenticateAdmin = require("../middlewares/authenticateAdmin");

// Route to get all faculty conveners, requires user authentication
router.get("/", authenticateToken, getAllFacultyConveners);

// Route to add a new faculty convener, requires admin authentication
router.post("/",authenticateAdmin, addFacultyConvener);

// Route to get details of a specific faculty convener by ID, requires user authentication and admin access
router.get("/:id", authenticateToken, authenticateAdmin, getFacultyConvener);

// Route to update a specific faculty convener by ID, requires admin authentication
router.put("/:id",authenticateAdmin, updateFacultyConvener);

// Route to delete a specific faculty convener by ID, requires admin authentication
router.delete("/:id", authenticateAdmin, deleteFacultyConvener);

module.exports = router;
