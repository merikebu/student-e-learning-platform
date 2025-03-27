const Submission = require("../models/Submission");
const Marks = require("../models/Marks");
const Assignment = require("../models/Assignment");
const sendEmail = require("../utils/sendEmail");

// ✅ View all assignments sent by admin
exports.viewAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find().sort({ createdAt: -1 }); // Fetch assignments sorted by latest
    res.status(200).json(assignments);
  } catch (error) {
    res.status(500).json({ message: "Error fetching assignments", error: error.message });
  }
};

// ✅ Submit an assignment
exports.submitAssignment = async (req, res) => {
  try {
    const { assignmentId, fileUrl } = req.body;

    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    const submission = await Submission.create({
      assignment: assignmentId,
      student: req.user.id,
      fileUrl,
    });

    res.status(201).json({ message: "Assignment submitted successfully", submission });
  } catch (error) {
    res.status(500).json({ message: "Error submitting assignment", error: error.message });
  }
};

// ✅ View all submissions by student
exports.viewSubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find({ student: req.user.id }).populate("assignment");
    res.status(200).json(submissions);
  } catch (error) {
    res.status(500).json({ message: "Error fetching submissions", error: error.message });
  }
};

// ✅ View marks for submitted assignments
exports.viewMarks = async (req, res) => {
  try {
    const marks = await Marks.find({ student: req.user.id })
      .populate({
        path: "submission",
        populate: { path: "assignment", select: "title" }
      })
      .populate("tutor", "name");

    if (!marks.length) {
      return res.status(404).json({ message: "No marks found for this student" });
    }

    res.status(200).json(marks);
  } catch (error) {
    res.status(500).json({ message: "Error fetching marks", error: error.message });
  }
};

// ✅ AI-powered notifications for assignments
exports.getNotifications = async (req, res) => {
  try {
    if (!req.user.email) {
      return res.status(400).json({ message: "User email not available" });
    }

    await sendEmail(req.user.email, "Assignment Reminder", "You have upcoming assignments due!");
    
    res.status(200).json({ message: "Notification sent!" });
  } catch (error) {
    res.status(500).json({ message: "Error sending notification", error: error.message });
  }
};