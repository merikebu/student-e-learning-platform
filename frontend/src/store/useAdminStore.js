import { create } from "zustand";
import axios from "axios";

const useAdminStore = create((set) => ({
  students: [],
  submissions: [],
  assignments: [],

  // Fetch all students
  fetchStudents: async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/students", {
        withCredentials: true,
      });
      set({ students: res.data });
    } catch (err) {
      console.error("Error fetching students:", err);
    }
  },

  // Add a new student
  addStudent: async (studentData) => {
    try {
      await axios.post("http://localhost:3000/api/admin/students", studentData, {
        withCredentials: true,
      });
      set((state) => ({ students: [...state.students, studentData] }));
    } catch (err) {
      console.error("Error adding student:", err);
    }
  },

  // Remove a student
  removeStudent: async (studentId) => {
    try {
      await axios.delete(`http://localhost:3000/api/admin/students/${studentId}`, {
        withCredentials: true,
      });
      set((state) => ({ students: state.students.filter((s) => s._id !== studentId) }));
    } catch (err) {
      console.error("Error removing student:", err);
    }
  },

  // Fetch all submissions
  fetchSubmissions: async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/admin/submissions", {
        withCredentials: true,
      });
      set({ submissions: res.data });
    } catch (err) {
      console.error("Error fetching submissions:", err);
    }
  },

  // Grade an assignment
  gradeAssignment: async (submissionId, grade) => {
    try {
      await axios.post(
        `http://localhost:3000/api/admin/grade/${submissionId}`,
        { grade },
        { withCredentials: true }
      );
      set((state) => ({
        submissions: state.submissions.map((sub) =>
          sub._id === submissionId ? { ...sub, grade } : sub
        ),
      }));
    } catch (err) {
      console.error("Error grading assignment:", err);
    }
  },

  // Create a new assignment
  createAssignment: async (assignmentData) => {
    try {
      const res = await axios.post("http://localhost:3000/api/admin/assignments", assignmentData, {
        withCredentials: true,
      });
      set((state) => ({ assignments: [...state.assignments, res.data] }));
    } catch (err) {
      console.error("Error creating assignment:", err);
    }
  },
}));

export default useAdminStore;
