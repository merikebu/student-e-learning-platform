const Assignment = require("../models/Assignment");
const Submission = require("../models/Submission");
const User = require("../models/User");


/**
 * Sends reminders to students for upcoming assignments.
 */
exports.sendAssignmentReminders = async () => {
  try {
    const today = new Date();
    const threeDaysLater = new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000);

    // Get assignments due in the next 3 days
    const upcomingAssignments = await Assignment.find({
      dueDate: { $gte: today, $lte: threeDaysLater },
    });

    if (!upcomingAssignments.length) {
      console.log("✅ No upcoming assignments.");
      return;
    }

    for (const assignment of upcomingAssignments) {
      // Get assigned students who have NOT submitted
      const submittedStudents = await Submission.find({ assignment: assignment._id }).distinct("student");

      const studentsToNotify = assignment.studentsAssigned.filter(studentId => !submittedStudents.includes(studentId));

      for (const studentId of studentsToNotify) {
        const student = await User.findById(studentId);

        if (student) {
          const message = `Reminder: Assignment "${assignment.title}" is due on ${assignment.dueDate.toDateString()}. Don't forget to submit on time!`;
          
          await sendEmail(student.email, "Assignment Reminder", message);

          // Mark reminder as sent
          await Submission.updateOne({ student: studentId, assignment: assignment._id }, { reminderSent: true }, { upsert: true });
        }
      }
    }

    console.log("✅ Assignment reminders sent successfully.");
  } catch (error) {
    console.error(`❌ Error sending reminders: ${error.message}`);
  }
};