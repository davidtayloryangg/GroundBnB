const express = require('express');
const router = express.Router();
const usersData = require('../data').users;

// Logs a user into the system
// request body: username, password
router.route('/login').post(async (req, res) => {

});

// Creates a new user account
// request body: userId, email, firstName, lastName, birthDay, birthMonth, birthYear (EXTRA profilePicture), 
router.route('/signup').post(async (req, res) => {
  let userId = req.body.userId;
  let email = req.body.email;
  let firstName = req.body.firstName;
  let lastName = req.body.lastName;
  let birthDay = req.body.birthDay;
  let birthMonth = req.body.birthMonth;
  let birthYear = req.body.birthYear;
  try {
    // check if request body inputs are valid
  } catch (e) {
    return res.status(400).json({ error: e });
  }

  try {
    await usersData.createUser(userId,email, firstName, lastName, birthDay, birthMonth, birthYear);
  } catch (e) {
    return res.status(500).json({ error: e });
  }
  return res.status(200).json({ result: 'success' });
});

// Logs the current user out
router.route('/logout').get(async (req, res) => {

});

// Gets information for the user's profile
router.route('/profile').get(async (req, res) => {

});

module.exports = router;