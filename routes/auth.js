const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/User.js');

// Register page
router.get('/register', (req, res) => {
    res.render('auth/register', { 
        title: 'Register',
        error: req.query.error
    });
});

// Register handler
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ 
            $or: [{ email }, { username }] 
        });

        if (existingUser) {
            return res.redirect('/auth/register?error=User already exists');
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const user = new User({
            username,
            email,
            password: hashedPassword
        });

        await user.save();

        // Set user session
        req.session.user = {
            id: user._id,
            username: user.username,
            email: user.email
        };

        res.redirect('/');
    } catch (error) {
        console.error('Registration error:', error);
        res.redirect('/auth/register?error=Registration failed');
    }
});

// Login page
router.get('/login', (req, res) => {
    res.render('auth/login', { 
        title: 'Login',
        error: req.query.error
    });
});

// Login handler
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.redirect('/auth/login?error=Invalid credentials');
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.redirect('/auth/login?error=Invalid credentials');
        }

        // Set user session
        req.session.user = {
            id: user._id,
            username: user.username,
            email: user.email
        };

        res.redirect('/');
    } catch (error) {
        console.error('Login error:', error);
        res.redirect('/auth/login?error=Login failed');
    }
});

// Logout handler
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

module.exports = router; 