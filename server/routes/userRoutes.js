const express = require("express");
const router = express.Router();
const {
  allUsers,
  singleUser,
  createUser,
  updateUser,
  deleteUser,
  getParticipatedEvents,
} = require("../controllers/userController");
const authenticateToken = require("../middlewares/verifyToken");
const authenticateAdmin = require("../middlewares/authenticateAdmin");

// Define routes
router.get("/",authenticateAdmin, allUsers);
router.post("/", authenticateAdmin, createUser);
router.get("/:id", authenticateAdmin, singleUser);

// Apply both token and admin verification
router.put("/:id", authenticateToken,updateUser);
router.delete("/:id",authenticateAdmin, deleteUser);
router.get("/:id/participated-events", authenticateToken, getParticipatedEvents);

// 404 Route
router.use((req, res) => {
  res.status(404).send("<h2>Resource not found</h2>");
});

module.exports = router;
