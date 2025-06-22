const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const {
    getArticles,
    getArticle,
    createArticle,
    updateArticle,
    deleteArticle
} = require('../controllers/articles');

// @route   GET api/articles
// @desc    Get all articles
// @access  Public
router.get('/', getArticles);

// @route   GET api/articles/:slug
// @desc    Get single article
// @access  Public
router.get('/:slug', getArticle);

// @route   POST api/articles
// @desc    Create article
// @access  Private/Admin/Editor
router.post(
    '/',
    [
        auth,
        upload.single('featuredImage'),
        [
            check('title', 'Title is required').not().isEmpty(),
            check('content', 'Content is required').not().isEmpty(),
            check('excerpt', 'Excerpt is required').not().isEmpty(),
            check('category', 'Category is required').not().isEmpty()
        ]
    ],
    createArticle
);

// @route   PUT api/articles/:id
// @desc    Update article
// @access  Private/Admin/Editor
router.put(
    '/:id',
    [
        auth,
        upload.single('featuredImage'),
        [
            check('title', 'Title is required').not().isEmpty(),
            check('content', 'Content is required').not().isEmpty(),
            check('excerpt', 'Excerpt is required').not().isEmpty(),
            check('category', 'Category is required').not().isEmpty()
        ]
    ],
    updateArticle
);

// @route   DELETE api/articles/:id
// @desc    Delete article
// @access  Private/Admin/Editor
router.delete('/:id', auth, deleteArticle);

module.exports = router;
