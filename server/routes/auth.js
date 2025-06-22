const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const { login, getMe } = require('../controllers/auth');

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post(
    '/login',
    [
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'Password is required').exists()
    ],
    login
);

// @route   GET api/auth/me
// @desc    Get logged in user
// @access  Private
router.get('/me', auth, getMe);

module.exports = router;
