const express = require("express");
const { generateMarksReport } = require("../controllers/adminController");
const { authMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

// Allow all logged-in users (students, tutors, and admins) to access the report
router.get("/pdf", authMiddleware, generateMarksReport)

module.exports = router;