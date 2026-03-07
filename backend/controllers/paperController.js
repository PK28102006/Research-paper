const Paper = require('../models/Paper');
const User = require('../models/User');

// @desc    Get all papers
// @route   GET /api/papers
// @access  Private
const getAllPapers = async (req, res, next) => {
  try {
    let papers = Paper.findAll();

    // Filter based on user role
    if (req.user.role === 'student') {
      // Students see only their own papers
      papers = papers.filter(p => p.authorId === req.user.id);
    } else if (req.user.role === 'reviewer') {
      // Reviewers see ONLY papers assigned to them
      papers = papers.filter(p => p.reviewerId === req.user.id);
    }
    // Admins see all papers

    res.json({
      success: true,
      count: papers.length,
      papers
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single paper
// @route   GET /api/papers/:id
// @access  Private
const getPaperById = async (req, res, next) => {
  try {
    const paper = Paper.findById(req.params.id);

    if (!paper) {
      return res.status(404).json({
        success: false,
        message: 'Paper not found'
      });
    }

    // Check access permissions
    if (
      req.user.role === 'student' && 
      paper.authorId !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this paper'
      });
    }

    res.json({
      success: true,
      paper
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit new paper
// @route   POST /api/papers
// @access  Private (Student only)
const submitPaper = async (req, res, next) => {
  try {
    const paperData = {
      ...req.body,
      authorId: req.user.id,
      authorName: req.user.name
    };

    // If reviewerId is provided, fetch reviewer name
    if (paperData.reviewerId) {
      const reviewer = User.findById(paperData.reviewerId);
      if (reviewer) {
        paperData.reviewerName = reviewer.name;
      }
    }

    const paper = Paper.create(paperData);

    res.status(201).json({
      success: true,
      message: 'Paper submitted successfully',
      paper
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update paper
// @route   PUT /api/papers/:id
// @access  Private
const updatePaper = async (req, res, next) => {
  try {
    const paper = Paper.findById(req.params.id);

    if (!paper) {
      return res.status(404).json({
        success: false,
        message: 'Paper not found'
      });
    }

    // Only author can update paper (and only if not yet reviewed)
    if (paper.authorId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this paper'
      });
    }

    if (paper.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Cannot update paper that is already under review or reviewed'
      });
    }

    const updatedPaper = Paper.update(req.params.id, req.body);

    res.json({
      success: true,
      message: 'Paper updated successfully',
      paper: updatedPaper
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete paper
// @route   DELETE /api/papers/:id
// @access  Private (Author or Admin)
const deletePaper = async (req, res, next) => {
  try {
    const paper = Paper.findById(req.params.id);

    if (!paper) {
      return res.status(404).json({
        success: false,
        message: 'Paper not found'
      });
    }

    // Only author or admin can delete
    if (req.user.role !== 'admin' && paper.authorId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this paper'
      });
    }

    Paper.delete(req.params.id);

    res.json({
      success: true,
      message: 'Paper deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update paper status (review)
// @route   PUT /api/papers/:id/status
// @access  Private (Reviewer or Admin)
const updatePaperStatus = async (req, res, next) => {
  try {
    const { status, comments } = req.body;
    const paper = Paper.findById(req.params.id);

    if (!paper) {
      return res.status(404).json({
        success: false,
        message: 'Paper not found'
      });
    }

    // Update paper with reviewer info
    const updateData = {
      status,
      reviewedAt: new Date().toISOString(),
      reviewedBy: req.user.name,
      reviewerId: req.user.id
    };

    if (comments) {
      updateData.comments = [
        ...(paper.comments || []),
        {
          text: comments,
          reviewerName: req.user.name,
          createdAt: new Date().toISOString()
        }
      ];
    }

    const updatedPaper = Paper.update(req.params.id, updateData);

    res.json({
      success: true,
      message: 'Paper status updated successfully',
      paper: updatedPaper
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Assign paper to reviewer
// @route   PUT /api/papers/:id/assign
// @access  Private (Admin only)
const assignPaperToReviewer = async (req, res, next) => {
  try {
    const { reviewerId } = req.body;

    // Verify reviewer exists
    const reviewer = User.findById(reviewerId);
    if (!reviewer || reviewer.role !== 'reviewer') {
      return res.status(400).json({
        success: false,
        message: 'Invalid reviewer'
      });
    }

    const updatedPaper = Paper.update(req.params.id, {
      reviewerId,
      reviewerName: reviewer.name,
      status: 'under_review'
    });

    res.json({
      success: true,
      message: 'Paper assigned to reviewer successfully',
      paper: updatedPaper
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllPapers,
  getPaperById,
  submitPaper,
  updatePaper,
  deletePaper,
  updatePaperStatus,
  assignPaperToReviewer
};
