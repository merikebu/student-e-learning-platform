const jwt = require("jsonwebtoken");
const User = require("../models/User");
const dotenv = require("dotenv");

dotenv.config(); // Load environment variables from .env file

// Middleware to allow access to all authenticated users
exports.authMiddleware = async (req, res, next) => {
    // Get the Authorization header from the request
    const authHeader = req.header("Authorization");

    // Check if Authorization header is missing or incorrectly formatted
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "No token, authorization denied" });
    }

    // Extract the token by removing the "Bearer " prefix
    const token = authHeader.split(" ")[1];

    try {
        // Verify the JWT token using the secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Fetch the user from the database (excluding the password for security reasons)
        const user = await User.findById(decoded.id).select("-password");

        // If the user is not found in the database, deny access
        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        // Attach the authenticated user to the request object
        req.user = user;

        // Proceed to the next middleware or route handler
        next();
    } catch (error) {
        // Handle token expiration error separately
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Token expired, please log in again" });
        }

        // Handle other JWT-related errors
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};