// server.js - Main entry point of the backend server

// 1. Import required packages
const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser"); // Required for handling cookies

// 2. Load environment variables
dotenv.config();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// 3. Initialize Express app
const app = express();

// 4. Middleware setup
app.use(express.json()); // Parse JSON request bodies
app.use(cookieParser()); // Enable cookie handling

// CORS Middleware Setup
app.use(
  cors({
    origin: [process.env.FRONTEND_URL, "http://localhost:3000"], // Allow frontend & localhost
    credentials: true, // Allow cookies & authentication headers
    allowedHeaders: ["Content-Type", "Authorization"], // Allow necessary headers
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Allow common HTTP methods
  })
);

// 5. Connect to MongoDB
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

// 6. Import Routes
const authRoutes = require("./routes/authRoute");
const studentRoutes = require("./routes/studentRoute")
const adminRoutes = require("./routes/adminRoute");
const pdfRoutes = require("./routes/reportRoute");

// 7. Define API Endpoints
app.use("/api/auth", authRoutes); // Authentication (Register, Login, Forgot Password)
app.use("/api/student", studentRoutes); // Student functionalities (Submissions, Results, Notifications)
app.use("/api/admin", adminRoutes); // Admin functionalities (Create Assignments, Grading)
app.use("/api", pdfRoutes); // PDF Report Generation

// 8. Root Endpoint


// 9. Start Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));