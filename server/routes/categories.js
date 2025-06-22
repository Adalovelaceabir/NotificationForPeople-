const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const {
    getCategories,
    getCategory,
    createCategory,
    updateCategory,
    deleteCategory
} = require('../controllers/categories');

// @route   GET api/categories
// @desc    Get all categories
// @access  Public
router.get('/', getCategories);

// @route   GET api/categories/:slug
// @desc    Get single category
// @access  Public
router.get('/:slug', getCategory);

// @route   POST api/categories
// @desc    Create category
// @access  Private/Admin
router.post(
    '/',
    [
        auth,
        upload.single('featuredImage'),
        [check('name', 'Name is required').not().isEmpty()]
    ],
    createCategory
);

// @route   PUT api/categories/:id
// @desc    Update category
// @access  Private/Admin
router.put(
    '/:id',
    [
        auth,
        upload.single('featuredImage'),
        [check('name', 'Name is required').not().isEmpty()]
    ],
    updateCategory
);

// @route   DELETE api/categories/:id
// @desc    Delete category
// @access  Private/Admin
router.delete('/:id', auth, deleteCategory);

module.exports = router;
