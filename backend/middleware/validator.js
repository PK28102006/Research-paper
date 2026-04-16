const { body, param, validationResult } = require('express-validator');

// Middleware to check validation results
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(err => err.msg).join(', ');
    return res.status(400).json({ 
      success: false, 
      message: errorMessages,
      errors: errors.array() 
    });
  }
  next();
};

// User validation rules
const userValidation = {
  register: [
    body('name')
      .trim()
      .isLength({ min: 2 })
      .withMessage('Name must be at least 2 characters long'),
    body('email')
      .trim()
      .isEmail()
      .withMessage('Valid email is required')
      .normalizeEmail(),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long'),
    body('role')
      .isIn(['student', 'reviewer', 'admin'])
      .withMessage('Role must be student, reviewer, or admin'),
    validate
  ],
  login: [
    body('email')
      .trim()
      .isEmail()
      .withMessage('Valid email is required')
      .normalizeEmail(),
    body('password')
      .notEmpty()
      .withMessage('Password is required'),
    validate
  ],
  update: [
    param('id').notEmpty().withMessage('User ID is required'),
    body('name')
      .optional()
      .trim()
      .isLength({ min: 2 })
      .withMessage('Name must be at least 2 characters long'),
    body('email')
      .optional()
      .trim()
      .isEmail()
      .withMessage('Valid email is required')
      .normalizeEmail(),
    validate
  ]
};

// Paper validation rules
const paperValidation = {
  submit: [
    body('title')
      .trim()
      .isLength({ min: 5 })
      .withMessage('Title must be at least 5 characters long'),
    body('abstract')
      .trim()
      .isLength({ min: 50 })
      .withMessage('Abstract must be at least 50 characters long'),
    body('keywords')
      .trim()
      .isLength({ min: 3 })
      .withMessage('Keywords are required'),
    body('authorId')
      .notEmpty()
      .withMessage('Author ID is required'),
    body('authorName')
      .notEmpty()
      .withMessage('Author name is required'),
    validate
  ],
  update: [
    param('id').notEmpty().withMessage('Paper ID is required'),
    validate
  ],
  updateStatus: [
    param('id').notEmpty().withMessage('Paper ID is required'),
    body('status')
      .isIn(['pending', 'under_review', 'approved', 'rejected'])
      .withMessage('Invalid status'),
    validate
  ]
};

module.exports = {
  validate,
  userValidation,
  paperValidation
};
