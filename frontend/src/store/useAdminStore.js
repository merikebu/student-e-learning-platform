import { create } from "zustand";
import axios from "axios";

const useAdminStore = create((set) => ({
  assignments: [],
  students: [],

  // Fetch all students
  getStudents: async () => {
    try {
      const res = await axios.get("https://localhost:5000/api/admin/manage-students", {
        withCredentials: true,
      });
      set({ students: res.data });
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  },

  // Remove a student
  removeStudent: async (id) => {
    try {
      await axios.delete(`https://localhost:5000/api/admin/manage-students/${id}`, {
        withCredentials: true,
      });
      set((state) => ({
        students: state.students.filter((s) => s._id !== id),
      }));
    } catch (error) {
      console.error("Error removing student:", error);
    }
  },

  


  // Fetch assignments
  fetchAssignments: async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/assignments", {
        withCredentials: true,
      });
      set({ assignments: res.data });
    } catch (err) {
      console.error("Error fetching assignments:", err);
    }
  },

  // Create an assignment
  createAssignment: async (assignmentData) => {
    try {
      await axios.post("http://localhost:5000/api/admin/assignments", assignmentData, {
        withCredentials: true,
      });
      await useAdminStore.getState().fetchAssignments(); // Refresh the list
    } catch (err) {
      console.error("Error creating assignment:", err);
    }
  },

  // Update an assignment
  updateAssignment: async (assignmentId, updatedData) => {
    try {
      await axios.put(`http://localhost:5000/api/admin/assignments/${assignmentId}`, updatedData, {
        withCredentials: true,
      });
      await useAdminStore.getState().fetchAssignments(); // Refresh the list
    } catch (err) {
      console.error("Error updating assignment:", err);
    }
  },

  // Delete an assignment
  deleteAssignment: async (assignmentId) => {
    try {
      await axios.delete(`http://localhost:5000/api/admin/assignments/${assignmentId}`, {
        withCredentials: true,
      });
      await useAdminStore.getState().fetchAssignments(); // Refresh the list
    } catch (err) {
      console.error("Error deleting assignment:", err);
    }
  },
}));

export default useAdminStore;