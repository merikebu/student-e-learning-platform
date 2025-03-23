import { create } from "zustand";
import axios from "axios";

const useStudentStore = create((set) => ({
  assignments: [],
  submissions: [],
  results: [],
  notifications: [],

  // Fetch assignments from the backend
  fetchAssignments: async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/student/assignments", {
        withCredentials: true, // Ensures authentication via cookies
      });
      set({ assignments: res.data });
    } catch (err) {
      console.error("Error fetching assignments:", err);
    }
  },

  // Submit an assignment
  submitAssignment: async (assignmentId, file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      await axios.post(`http://localhost:3000/api/student/submit/${assignmentId}`, formData, {
        withCredentials: true,
      });
    } catch (err) {
      console.error("Submission failed:", err);
    }
  },

  // Fetch student results
  fetchResults: async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/student/results", {
        withCredentials: true,
      });
      set({ results: res.data });
    } catch (err) {
      console.error("Error fetching results:", err);
    }
  },

  // Fetch AI-powered notifications
  fetchNotifications: async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/student/notifications", {
        withCredentials: true,
      });
      set({ notifications: res.data });
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  },
}));

export default useStudentStore;
