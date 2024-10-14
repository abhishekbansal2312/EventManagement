// routes/memberRoutes.js

const router = require("express").Router();
const {
  getAllMembers,
  addMember,
  getMember,
  updateMember,
  deleteMember,
} = require("../controllers/memberController");
const authenticateToken = require("../middlewares/verifyToken");
const authenticateAdmin = require("../middlewares/authenticateAdmin");

router.get("/", authenticateToken, getAllMembers);
router.post("/", addMember);
// router.get("/:id", authenticateToken, authenticateAdmin, getMember);
router.put("/:id", authenticateAdmin, updateMember);
router.delete("/:id", authenticateAdmin, deleteMember);

module.exports = router;
