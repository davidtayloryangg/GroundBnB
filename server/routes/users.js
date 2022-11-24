const express = require('express');
const router = express.Router();

// Logs a user into the system
// request body: username, password
router.route('/login').post(async (req, res) => {

});

// Creates a new user account
// request body: username, password, (confirmPassword?)
router.route('/signup').post(async (req, res) => {

});

// Logs the current user out
router.route('/logout').get(async (req, res) => {

});

// Gets information for the user's profile
router.route('/profile').get(async (req, res) => {

});

module.exports = router;