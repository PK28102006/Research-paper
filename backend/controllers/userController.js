const User = require('../models/User');

// @desc    Get all users
// @route   GET /api/users
// @access  Private (Admin only)
const getAllUsers = async (req, res, next) => {
  try {
    const users = User.findAll();
    const sanitizedUsers = users.map(user => User.sanitize(user));

    res.json({
      success: true,
      count: sanitizedUsers.length,
      users: sanitizedUsers
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private
const getUserById = async (req, res, next) => {
  try {
    const user = User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const sanitizedUser = User.sanitize(user);

    res.json({
      success: true,
      user: sanitizedUser
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private
const updateUser = async (req, res, next) => {
  try {
    // Users can only update their own profile unless they're admin
    if (req.user.role !== 'admin' && req.user.id !== req.params.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this user'
      });
    }

    const updatedUser = User.update(req.params.id, req.body);
    const sanitizedUser = User.sanitize(updatedUser);

    res.json({
      success: true,
      message: 'User updated successfully',
      user: sanitizedUser
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private (Admin only)
const deleteUser = async (req, res, next) => {
  try {
    // Prevent admin from deleting themselves
    if (req.user.id === req.params.id) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete your own account'
      });
    }

    User.delete(req.params.id);

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get users by role
// @route   GET /api/users/role/:role
// @access  Private (Admin only)
const getUsersByRole = async (req, res, next) => {
  try {
    const { role } = req.params;
    const allUsers = User.findAll();
    const users = allUsers.filter(u => u.role === role);
    const sanitizedUsers = users.map(user => User.sanitize(user));

    res.json({
      success: true,
      count: sanitizedUsers.length,
      users: sanitizedUsers
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all reviewers
// @route   GET /api/users/reviewers
// @access  Private
const getReviewers = async (req, res, next) => {
  try {
    const allUsers = User.findAll();
    const reviewers = allUsers.filter(u => u.role === 'reviewer');
    const sanitizedReviewers = reviewers.map(user => User.sanitize(user));

    res.json({
      success: true,
      count: sanitizedReviewers.length,
      reviewers: sanitizedReviewers
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUsersByRole,
  getReviewers
};
