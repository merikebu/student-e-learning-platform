const Assignment = require("../models/Assignment");
const Submission = require("../models/Submission");
const Marks = require("../models/Marks");
const User = require("../models/User"); // Ensure User model is imported

// ✅ Create an assignment
exports.createAssignment = async (req, res) => {
  try {
    const { title, description, dueDate, studentsAssigned } = req.body;

    // Validate that all assigned students exist
    const validStudents = await User.find({ _id: { $in: studentsAssigned } });

    if (validStudents.length !== studentsAssigned.length) {
      return res.status(400).json({ message: "One or more students are invalid" });
    }

    // Create the assignment
    const assignment = await Assignment.create({
      title,
      description,
      dueDate,
      createdBy: req.user.id,
      studentsAssigned, // Include the valid students
    });

    res.status(201).json({ message: "Assignment created successfully", assignment });
  } catch (error) {
    res.status(500).json({ message: "Error creating assignment", error: error.message });
  }
};

// ✅ View student submissions
exports.viewStudentSubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find().populate("student assignment");
    res.status(200).json(submissions);
  } catch (error) {
    res.status(500).json({ message: "Error fetching submissions", error: error.message });
  }
};

// ✅ Grade a submission
exports.gradeAssignment = async (req, res) => {
  try {
    const { submissionId, score, feedback } = req.body;

    // Find the submission
    const submission = await Submission.findById(submissionId);
    if (!submission) {
      return res.status(404).json({ message: "Submission not found" });
    }

    // Create marks entry
    const marks = await Marks.create({
      submission: submissionId,
      student: submission.student, // Extract student ID
      tutor: req.user.id, // Tutor grading
      score,
      feedback,
    });

    res.status(201).json({ message: "Assignment graded successfully", marks });
  } catch (error) {
    console.error("Error grading assignment:", error);
    res.status(500).json({ message: "Error grading assignment", error: error.message });
  }
};

// ✅ View student marks
exports.viewMarks = async (req, res) => {
  try {
    const marks = await Marks.find().populate("submission");
    res.status(200).json(marks);
  } catch (error) {
    res.status(500).json({ message: "Error fetching marks", error: error.message });
  }
};