const Assignment = require("../models/Assignment")
const Submission = require("../models/Submission");
const Marks = require("../models/Marks");
console.log(Assignment)
// Create an assignment
exports.createAssignment = async (req, res) => {
  try {
    const { title, description, dueDate } = req.body;

    const assignment = await Assignment.create({
      title,
      description,
      dueDate,
      createdBy: req.user.id,
    });

    res
      .status(201)
      .json({ message: "Assignment created successfully", assignment });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating assignment", error: error.message });
  }
};

// View student submissions
exports.viewStudentSubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find().populate("student assignment");
    res.status(200).json(submissions);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching submissions", error: error.message });
  }
};

// Grade a submission
exports.gradeAssignment = async (req, res) => {
  try {
    const { submissionId, score, feedback } = req.body;

    // Find the submission to get the student ID
    const submission = await Submission.findById(submissionId);
    if (!submission) {
      return res.status(404).json({ message: "Submission not found" });
    }

    // Create marks entry with student ID from the submission
    const marks = await Marks.create({
      submission: submissionId,
      student: submission.student, // Extract student from submission
      tutor: req.user.id, // Tutor grading
      score,
      feedback,
    });

    res.status(201).json({ message: "Assignment graded successfully", marks });
  } catch (error) {
    console.error("Error grading assignment:", error);
    res
      .status(500)
      .json({ message: "Error grading assignment", error: error.message });
  }
};

// View student marks
exports.viewMarks = async (req, res) => {
  try {
    const marks = await Marks.find().populate("submission");
    res.status(200).json(marks);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching marks", error: error.message });
  }
};
