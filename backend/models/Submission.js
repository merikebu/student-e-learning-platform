const mongoose = require("mongoose");

const SubmissionSchema = new mongoose.Schema(
  {
    assignment: { type: mongoose.Schema.Types.ObjectId, ref: "Assignment", required: true },
    student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    fileUrl: { type: String, required: true },
    submittedAt: { type: Date, default: Date.now },
    reminderSent: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Submission = mongoose.model("Submission", SubmissionSchema);
module.exports = Submission;