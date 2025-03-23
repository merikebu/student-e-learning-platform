import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import ForgotPassword from "./components/Auth/ForgotPassword";

import StudentDashboard from "./components/Student/Dashboard";
import Assignments from "./components/Student/Assignments";
import Submissions from "./components/Student/Submissions";
import Results from "./components/Student/Results";
//import Notifications from "./components/Student/Notifications";

import AdminDashboard from "./components/Admin/Dashboard";
import ManageStudents from "./components/Admin/ManageStudents";
import CreateAssignment from "./components/Admin/CreateAssignment";
import ViewSubmissions from "./components/Admin/ViewSubmissions";
import GradeAssignments from "./components/Admin/GradeAssignments";
//import ViewResults from "./components/Admin/ViewResults";

function App() {
  return (
    
      <Routes>
        {/* Auth Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Student Routes */}
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/student/assignments" element={<Assignments />} />
        <Route path="/student/submissions" element={<Submissions />} />
        <Route path="/student/results" element={<Results />} />
        

        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/manage-students" element={<ManageStudents />} />
        <Route path="/admin/create-assignment" element={<CreateAssignment />} />
        <Route path="/admin/view-submissions" element={<ViewSubmissions />} />
        <Route path="/admin/grade-assignments" element={<GradeAssignments />} />
        
      </Routes>
    
  );
}

export default App;
