const express = require('express');
const router = express.Router();

// Gets all listings that are available
router.route('/all').get(async (req, res) => {

});

// Gets listings that match the location
router.route('/search/:location').get(async (req, res) => {

});

// Creates new listing
// request body: image, name, description, price, (location?)
router.route('/create').post(async (req, res) => {

});

// (EXTRA FEATURE) Gets the user's favorite listings
router.route('/favorites').get(async (req, res) => {

});

// Edits an existing listing
// request body: image, name, description, price, (location?)
router.route('/edit/:listingId').post(async (req, res) => {

});

// Gets the listing with the specific listing id
router.route('/:listingId').get(async (req, res) => {

});

// Create a review for a listing
// request body: rating, description
router.route('/:listingId/review').get(async (req, res) => {

});

// (EXTRA FEATURE) Adds listing to the user's favorite listings
router.route('/:listingId/favorite').get(async (req, res) => {

});

module.exports = router;