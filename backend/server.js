// server.js
// Main entry point of the backend server

// 1️⃣ Import required packages
const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");

// Import authentication middleware
//const authMiddleware = require("./middleware/authMiddleware");

// 2️⃣ Load environment variables
dotenv.config();
const PORT = process.env.PORT || 5000;
const DB_URI = process.env.DB_URI;

// 3️⃣ Initialize Express app
const app = express();

// 4️⃣ Middleware setup
app.use(express.json()); // Parse JSON request bodies
app.use(cors()); // Enable CORS for frontend communication

// 5️⃣ Connect to MongoDB;
mongoose
  .connect(DB_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// 6️⃣ Import Routes
const authRoutes = require("./routes/authRoute");
const studentRoutes = require("./routes/studentRoute");
const adminRoutes = require("./routes/adminRoute");


// 7️⃣ Define API Endpoints
app.use("/api/auth", authRoutes); // Authentication (Register, Login, Forgot Password)
app.use("/api/student", studentRoutes); // Student functionalities (Submissions, Results, Notifications)
app.use("/api/admin", adminRoutes); // Admin functionalities (Create Assignments, Grading)
//pdf
const pdfRoutes = require("./routes/reportRoute");
app.use("/api", pdfRoutes);

// 8️⃣ Root Endpoint
app.get("/", (req, res) => {
  res.send("🎉 Student Portal Backend Running!");
});

// 9️⃣ Start Server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
