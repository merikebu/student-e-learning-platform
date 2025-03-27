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

  // Fetch student submissions
  fetchSubmissions: async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/student/submissions", {
        withCredentials: true,
      });
      set({ submissions: res.data });
    } catch (err) {
      console.error("Error fetching submissions:", err);
    }
  },

  // Submit an assignment (PDF upload)
  submitAssignment: async (assignmentId, file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      await axios.post(`http://localhost:5000/api/student/submit/${assignmentId}`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Refresh submissions after upload
      await useStudentStore.getState().fetchSubmissions();
    } catch (err) {
      console.error("Submission failed:", err);
    }
  },

  // Delete a submission
  deleteSubmission: async (submissionId) => {
    try {
      await axios.delete(`http://localhost:5000/api/student/submissions/${submissionId}`, {
        withCredentials: true,
      });

      // Refresh submissions after deletion
      await useStudentStore.getState().fetchSubmissions();
    } catch (err) {
      console.error("Failed to delete submission:", err);
    }
  },

  // Fetch student results
  fetchResults: async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/student/results", {
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
      const res = await axios.get("http://localhost:5000/api/student/notifications", {
        withCredentials: true,
      });
      set({ notifications: res.data });
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  },
}));

export default useStudentStore;