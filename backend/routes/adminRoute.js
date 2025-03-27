const express = require("express");
const {
  createAssignment,
  viewStudentSubmissions,
  gradeAssignment,
  viewMarks,
  getAssignments,
  updateAssignment,
  deleteAssignment,
  getAllStudents, // ✅ View all students
  removeStudent, // ✅ Remove a student
} = require("../controllers/adminController");

const { authMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

// ✅ Tutor creates an assignment
router.post("/create-assignment", authMiddleware, createAssignment);

// ✅ Tutor views all assignments
router.get("/assignments", authMiddleware, getAssignments);

// ✅ Tutor updates an assignment
router.put("/assignments/:assignmentId", authMiddleware, updateAssignment);

// ✅ Tutor deletes an assignment
router.delete("/assignments/:assignmentId", authMiddleware, deleteAssignment);

// ✅ Tutor views all student submissions (unchanged)
router.get("/submissions", authMiddleware, viewStudentSubmissions);

// ✅ Tutor grades a submission (unchanged)
router.post("/grade", authMiddleware, gradeAssignment);

// ✅ Tutor views student marks (unchanged)
router.get("/marks", authMiddleware, viewMarks);

// ✅ Tutor views all students
router.get("/manage-students", authMiddleware, getAllStudents);

// ✅ Tutor removes a student
router.delete("/manage-students/:id", authMiddleware, removeStudent);

module.exports = router;