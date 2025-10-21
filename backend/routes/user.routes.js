const express = require('express');
const { Register, Login, GetProfile, Logout, UpdateSettings } = require('../controllers/user.controller');
const { auth } = require('../middleware/auth');

const router = express.Router();

//user registrations
router.post('/register', Register);

//user login
router.post('/login', Login);

//user profile (protected route)
router.get('/profile', auth, GetProfile);

//user logout
router.get('/logout', Logout);

//update user settings (protected route)
router.put('/settings', auth, UpdateSettings);

module.exports = router;
