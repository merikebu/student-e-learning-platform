const mongoose = require("mongoose");

const MarksSchema = new mongoose.Schema(
  {
    submission: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Submission",
      required: true,
    }, // Reference to the submitted assignment

    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }, // The student who submitted the assignment

    tutor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }, // The tutor who graded the assignment

    score: {
      type: Number,
      required: true,
    }, // Marks awarded for the submission

    feedback: {
      type: String,
    }, // Feedback from the tutor

    gradedAt: {
      type: Date,
      default: Date.now,
    }, // Timestamp when grading was done
  },
  { timestamps: true }
);

// Export the Marks model
const Marks = mongoose.model("Marks", MarksSchema);
module.exports = Marks;