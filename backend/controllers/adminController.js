const Assignment = require("../models/Assignment");
const Submission = require("../models/Submission");
const Marks = require("../models/Marks");
const User = require("../models/User"); // Ensure User model is imported


const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

exports.generateMarksReport = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    // Fetch marks data and sort from highest to lowest score
    const marks = await Marks.find()
      .populate("student", "name")
      .populate("tutor", "name")
      .sort({ score: -1 }); // Sort in descending order

    if (!marks.length) {
      return res.status(404).json({ message: "No marks data available" });
    }

    // Ensure the reports directory exists
    const reportsDir = path.join(__dirname, "../reports");
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }

    // Generate PDF
    const doc = new PDFDocument({ size: "A4", layout: "landscape" });
    const filePath = path.join(reportsDir, "student_marks_report.pdf");
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    // Title
    doc.fontSize(20).text("Student Marks Report", { align: "center" }).moveDown(1);

    // Add date at the top-right corner
    doc.fontSize(12).text(`Date: ${new Date().toLocaleDateString()}`, 700, 50);

    // Table Header
    doc.fontSize(14).text("Position", 50, 120, { bold: true });
    doc.text("Student", 150, 120, { bold: true });
    doc.text("Score", 350, 120, { bold: true });
    doc.text("Graded By", 500, 120, { bold: true });

    doc.moveDown(0.5);
    doc.moveTo(50, 140).lineTo(700, 140).stroke(); // Draw line under headers

    let yPosition = 160;
    let position = 1; // Start position from 1
    let previousScore = null;
    let samePosition = 1;

    marks.forEach((mark, index) => {
      // If the score is the same as the previous student's, keep the same position
      if (previousScore !== null && mark.score === previousScore) {
        samePosition = position;
      } else {
        samePosition = index + 1; // Update position for new score
      }

      doc.fontSize(12).text(samePosition.toString(), 50, yPosition); // Position
      doc.text(mark.student?.name || "N/A", 150, yPosition);
      doc.text(mark.score.toString(), 350, yPosition);
      doc.text(mark.tutor?.name || "Unknown", 500, yPosition);

      previousScore = mark.score;
      yPosition += 25; // Move to the next row
      position++;
    });

    doc.end();

    // Send the file after it's written
    stream.on("finish", () => {
      res.download(filePath, "student_marks_report.pdf", (err) => {
        if (err) {
          console.error("Download Error:", err);
          res.status(500).json({ message: "Error downloading the PDF", error: err.message });
        }
      });
    });
  } catch (error) {
    console.error("PDF Generation Error:", error);
    res.status(500).json({ message: "Error generating PDF", error: error.message });
  }
};
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
    // Ensure a student is logged in
    if (!req.user || req.user.role !== "student") {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    // Fetch marks only for the logged-in student
    const marks = await Marks.find({ student: req.user.id }) // Filter by logged-in student ID
      .populate({
        path: "submission",
        populate: { path: "assignment", model: "Assignment" }, // Populate full assignment details
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