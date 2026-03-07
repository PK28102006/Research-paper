const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUsersByRole,
  getReviewers
} = require('../controllers/userController');
const { verifyToken, requireRole } = require('../middleware/auth');
const { userValidation } = require('../middleware/validator');
const { asyncHandler } = require('../middleware/errorHandler');

// All routes require authentication
router.use(verifyToken);

// Get all reviewers (Private)
router.get('/reviewers', asyncHandler(getReviewers));

// Get all users (Admin only)
router.get('/', requireRole('admin'), asyncHandler(getAllUsers));

// Get users by role (Admin only)
router.get('/role/:role', requireRole('admin'), asyncHandler(getUsersByRole));

// Get single user
router.get('/:id', asyncHandler(getUserById));

// Update user
router.put('/:id', userValidation.update, asyncHandler(updateUser));

// Delete user (Admin only)
router.delete('/:id', requireRole('admin'), asyncHandler(deleteUser));

module.exports = router;
