const jwt = require("jsonwebtoken");
const User = require("../models/User");
const dotenv = require("dotenv");

dotenv.config(); // Load environment variables

// Middleware to protect routes
exports.authMiddleware = async (req, res, next) => {
    // Get the Authorization header from the request
    const authHeader = req.header("Authorization");

    // Check if Authorization header is missing or does not start with "Bearer "
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "No token, authorization denied" });
    }

    // Extract the token (remove "Bearer " part)
    const token = authHeader.split(" ")[1];

    try {
        // Verify the token using JWT_SECRET
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Find the user in the database (excluding the password)
        req.user = await User.findById(decoded.id).select("-password");

        // If user not found in database (maybe deleted), deny access
        if (!req.user) {
            return res.status(401).json({ message: "User not found" });
        }

        // Proceed to the next middleware or route
        next();
    } catch (error) {
        // Handle specific JWT errors
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Token expired, please log in again" });
        }
        res.status(401).json({ message: "Invalid token" });
    }
};