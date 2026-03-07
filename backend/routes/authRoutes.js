const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('../controllers/authController');
const { verifyToken } = require('../middleware/auth');
const { userValidation } = require('../middleware/validator');
const { asyncHandler } = require('../middleware/errorHandler');

// Public routes
router.post('/register', userValidation.register, asyncHandler(register));
router.post('/login', userValidation.login, asyncHandler(login));

// Protected routes
router.get('/me', verifyToken, asyncHandler(getMe));

module.exports = router;
