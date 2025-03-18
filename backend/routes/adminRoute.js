const express = require('express');
const { createAssignment, viewStudentSubmissions, gradeAssignment, viewMarks } = require('../controllers/adminController');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

// Tutor creates an assignment
router.post('/create-assignment', authMiddleware, createAssignment);

// Tutor views all student submissions
router.get('/submissions', authMiddleware, viewStudentSubmissions)

// Tutor grades a submission
router.post('/grade', authMiddleware, gradeAssignment);

// Tutor views student marks
router.get('/marks', authMiddleware, viewMarks);

module.exports = router;