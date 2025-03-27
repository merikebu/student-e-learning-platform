const Assignment = require("../models/Assignment");
const Submission = require("../models/Submission");
const Marks = require("../models/Marks");
const User = require("../models/User"); // Ensure User model is imported


const PDFDocument = require("pdfkit");


// ✅ View all students
exports.getAllStudents = async (req, res) => {
  try {
    const students = await User.find({ role: "student" }).select("_id name email");
    res.status(200).json(students);
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({ message: "Error fetching students", error: error.message });
  }
};



// ✅ Remove a student
exports.removeStudent = async (req, res) => {
  const { studentId } = req.params;

  try {
    const deletedStudent = await User.findByIdAndDelete(studentId);
    if (!deletedStudent) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.status(200).json({ message: "Student removed successfully" });
  } catch (error) {
    console.error("Error removing student:", error);
    res.status(500).json({ message: "Error removing student", error: error.message });
  }
};


// ✅ View all assignments
exports.getAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find().populate("createdBy", "name");
    res.status(200).json(assignments);
  } catch (error) {
    res.status(500).json({ message: "Error fetching assignments", error: error.message });
  }
};

// ✅ Update an assignment
exports.updateAssignment = async (req, res) => {
  try {
    const { title, description, dueDate } = req.body;
    const { assignmentId } = req.params;

    const updatedAssignment = await Assignment.findByIdAndUpdate(
      assignmentId,
      { title, description, dueDate },
      { new: true }
    );

    if (!updatedAssignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    res.status(200).json({ message: "Assignment updated successfully", updatedAssignment });
  } catch (error) {
    res.status(500).json({ message: "Error updating assignment", error: error.message });
  }
};

// ✅ Delete an assignment
exports.deleteAssignment = async (req, res) => {
  try {
    const { assignmentId } = req.params;

    // Delete the assignment
    const deletedAssignment = await Assignment.findByIdAndDelete(assignmentId);
    if (!deletedAssignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    // Also delete related submissions & marks
    await Submission.deleteMany({ assignment: assignmentId });
    await Marks.deleteMany({ submission: { $in: deletedAssignment.submissions } });

    res.status(200).json({ message: "Assignment and related data deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting assignment", error: error.message });
  }
};

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
// ✅ Create an assignment and assign to all students
exports.createAssignment = async (req, res) => {
  const { title, description, dueDate } = req.body;

  // Fetch all students
  const students = await User.find({ role: "student" }).select("_id");

  // If no students exist, return an error
  if (!students.length) {
    return res.status(400).json({ message: "No students found to assign this assignment" });
  }

  // Create the assignment
  const assignment = await Assignment.create({
    title,
    description,
    dueDate,
    createdBy: req.user.id,
    studentsAssigned: students.map((student) => student._id), // Assign to all students
  });

  res.status(201).json({ message: "Assignment created for all students", assignment });
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