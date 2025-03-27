const jwt = require("jsonwebtoken");
const User = require("../models/User");
const dotenv = require("dotenv");

dotenv.config();

// Middleware to allow access to all authenticated users
exports.authMiddleware = async (req, res, next) => {
    try {
        // Get token from cookies
        const token = req.cookies?.token;

        // Check if token is missing
        if (!token) {
            return res.status(401).json({ message: "No authentication token found" });
        }

        // Verify the JWT token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Fetch the user from the database (excluding password)
        const user = await User.findById(decoded.id).select("-password");

        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        // Attach the authenticated user to the request
        req.user = user;

        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};