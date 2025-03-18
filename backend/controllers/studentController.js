const Submission = require("../models/Submission");
const Marks = require("../models/Marks");


// Submit an assignment
exports.submitAssignment = async (req, res) => {
  try {
    const { assignmentId, fileUrl } = req.body;

    const submission = await Submission.create({
      assignment: assignmentId,
      student: req.user.id,
      fileUrl,
    });

    res
      .status(201)
      .json({ message: "Assignment submitted successfully", submission });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error submitting assignment", error: error.message });
  }
};

// View submissions
exports.viewSubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find({
      student: req.user.id,
    }).populate("assignment");
    res.status(200).json(submissions);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching submissions", error: error.message });
  }
};

// View marks
exports.viewMarks = async (req, res) => {
  try {
    const marks = await Marks.find({ student: req.user.id }).populate(
      "submission"
    );
    res.status(200).json(marks);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching marks", error: error.message });
  }
};

// AI-powered notifications
exports.getNotifications = async (req, res) => {
  try {
    await sendEmail(
      req.user.email,
      "Assignment Reminder",
      "You have upcoming assignments due!"
    );
    res.status(200).json({ message: "Notification sent!" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error sending notification", error: error.message });
  }
};
