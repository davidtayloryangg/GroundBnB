const express = require('express');
const router = express.Router();

// Gets all bookings that are belong to the user
router.route('/all').get(async (req, res) => {

});

// Creates a new booking based on a listing available
// request body: date, timeStart, timeEnd, numberOfPeople
router.route('/create').post(async (req, res) => {

});

// Cancels an existing booking
router.route('/cancel/:bookingId').get(async (req, res) => {

});

module.exports = router;