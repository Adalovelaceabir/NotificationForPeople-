const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const {
    getAds,
    getAd,
    createAd,
    updateAd,
    deleteAd,
    recordClick
} = require('../controllers/ads');

// @route   GET api/ads
// @desc    Get all ads
// @access  Public
router.get('/', getAds);

// @route   GET api/ads/:id
// @desc    Get single ad
// @access  Public
router.get('/:id', getAd);

// @route   POST api/ads
// @desc    Create ad
// @access  Private/Admin
router.post(
    '/',
    [
        auth,
        upload.single('image'),
        [
            check('title', 'Title is required').not().isEmpty(),
            check('url', 'URL is required').not().isEmpty(),
            check('position', 'Position is required').not().isEmpty(),
            check('startDate', 'Start date is required').not().isEmpty(),
            check('endDate', 'End date is required').not().isEmpty()
        ]
    ],
    createAd
);

// @route   PUT api/ads/:id
// @desc    Update ad
// @access  Private/Admin
router.put(
    '/:id',
    [
        auth,
        upload.single('image'),
        [
            check('title', 'Title is required').not().isEmpty(),
            check('url', 'URL is required').not().isEmpty(),
            check('position', 'Position is required').not().isEmpty(),
            check('startDate', 'Start date is required').not().isEmpty(),
            check('endDate', 'End date is required').not().isEmpty()
        ]
    ],
    updateAd
);

// @route   DELETE api/ads/:id
// @desc    Delete ad
// @access  Private/Admin
router.delete('/:id', auth, deleteAd);

// @route   POST api/ads/:id/click
// @desc    Record ad click
// @access  Public
router.post('/:id/click', recordClick);

module.exports = router;
