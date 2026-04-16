const Paper = require('../models/Paper');
const User = require('../models/User');

// @desc    Get all papers
// @route   GET /api/papers
// @access  Private
const getAllPapers = async (req, res, next) => {
  try {
    let papers;

    // Filter based on user role directly if possible, or filter array
    if (req.user.role === 'student') {
      // Students see only their own papers
      papers = await Paper.findByAuthor(req.user.id);
    } else if (req.user.role === 'reviewer' || req.user.role === 'teacher') {
      // Reviewers see ONLY papers assigned to them
      papers = await Paper.findByReviewer(req.user.id);
    } else {
      // Admins see all papers
      papers = await Paper.findAll();
    }

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
    const paper = await Paper.findById(req.params.id);

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
      const reviewer = await User.findById(paperData.reviewerId);
      if (reviewer) {
        paperData.reviewerName = reviewer.name;
      }
    }

    const paper = await Paper.create(paperData);

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
    const paper = await Paper.findById(req.params.id);

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

    const updatedPaper = await Paper.update(req.params.id, req.body);

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
    const paper = await Paper.findById(req.params.id);

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

    await Paper.delete(req.params.id);

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
    const { status, comments, rejectionReason } = req.body;
    let paper = await Paper.findById(req.params.id);

    if (!paper) {
      return res.status(404).json({
        success: false,
        message: 'Paper not found'
      });
    }

    const commentData = comments ? {
      id: Date.now().toString(),
      text: comments,
      authorName: req.user.name,
      createdAt: new Date().toISOString()
    } : null;

    paper = await Paper.updateStatus(req.params.id, status, req.user.id, commentData, rejectionReason, req.user.name);

    res.json({
      success: true,
      message: 'Paper status updated successfully',
      paper
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add comment to paper
// @route   POST /api/papers/:id/comments
// @access  Private (Author, Reviewer or Admin)
const addCommentToPaper = async (req, res, next) => {
  try {
    const { text } = req.body;
    const paper = await Paper.findById(req.params.id);

    if (!paper) {
      return res.status(404).json({
        success: false,
        message: 'Paper not found'
      });
    }

    // Verify access
    if (
      req.user.role === 'student' &&
      paper.authorId !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to comment on this paper'
      });
    }

    if (!text) {
      return res.status(400).json({
        success: false,
        message: 'Comment text is required'
      });
    }

    const commentData = JSON.stringify({
      id: Date.now().toString(),
      text,
      authorName: req.user.name,
      createdAt: new Date().toISOString()
    });

    const pgDb = require('../config/db');
    await pgDb.query(
      'INSERT INTO reviews (paper_id, reviewer_id, comments, review_date) VALUES ($1, $2, $3, $4)',
      [req.params.id, req.user.id, commentData, new Date().toISOString()]
    );

    const updatedPaper = await Paper.findById(req.params.id);

    res.json({
      success: true,
      message: 'Comment added successfully',
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
    const reviewer = await User.findById(reviewerId);
    if (!reviewer || (reviewer.role !== 'reviewer' && reviewer.role !== 'teacher')) {
      return res.status(400).json({
        success: false,
        message: 'Invalid reviewer'
      });
    }

    const updatedPaper = await Paper.update(req.params.id, {
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
  addCommentToPaper,
  assignPaperToReviewer
};
