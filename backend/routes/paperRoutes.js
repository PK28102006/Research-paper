const express = require('express');
const router = express.Router();
const {
  getAllPapers,
  getPaperById,
  submitPaper,
  updatePaper,
  deletePaper,
  updatePaperStatus,
  assignPaperToReviewer
} = require('../controllers/paperController');
const { verifyToken, requireRole } = require('../middleware/auth');
const { paperValidation } = require('../middleware/validator');
const { asyncHandler } = require('../middleware/errorHandler');

// All routes require authentication
router.use(verifyToken);

// Get all papers (filtered by role)
router.get('/', asyncHandler(getAllPapers));

// Get single paper
router.get('/:id', asyncHandler(getPaperById));

// Submit paper (Student only)
router.post(
  '/',
  requireRole('student'),
  paperValidation.submit,
  asyncHandler(submitPaper)
);

// Update paper
router.put(
  '/:id',
  paperValidation.update,
  asyncHandler(updatePaper)
);

// Delete paper
router.delete('/:id', asyncHandler(deletePaper));

// Update paper status (Reviewer or Admin)
router.put(
  '/:id/status',
  requireRole('reviewer', 'admin'),
  paperValidation.updateStatus,
  asyncHandler(updatePaperStatus)
);

// Assign paper to reviewer (Admin only)
router.put(
  '/:id/assign',
  requireRole('admin'),
  asyncHandler(assignPaperToReviewer)
);

module.exports = router;
