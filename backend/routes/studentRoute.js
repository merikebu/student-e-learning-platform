const express = require('express');
const {
  submitAssignment,
  viewSubmissions,
  viewMarks,
  getNotifications,
  viewAssignments
} = require('../controllers/studentController');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

// ✅ View all assignments sent by admin
router.get('/assignments', authMiddleware, viewAssignments);

// ✅ Student submits an assignment
router.post('/submit', authMiddleware, submitAssignment);

// ✅ Student views their submissions
router.get('/submissions', authMiddleware, viewSubmissions);

// ✅ Student views awarded marks
router.get('/marks', authMiddleware, viewMarks);

// ✅ Student receives AI-powered notifications
router.get('/notifications', authMiddleware, getNotifications);

module.exports = router;