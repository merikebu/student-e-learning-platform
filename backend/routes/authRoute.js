const express = require('express');
const { register, login, forgotPassword } = require('../controllers/authController');

const router = express.Router();

// Route for user registration
router.post('/register', register);

// Route for user login
router.post('/login', login);

// Route for password reset
router.post('/forgot-password', forgotPassword);

module.exports = router;