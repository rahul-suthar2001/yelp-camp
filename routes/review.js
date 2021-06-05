const express = require('express');
const router = express.Router({ mergeParams: true });
const CampGround = require('../models/campground');
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Review = require('../models/review');
const {isLoggedIn, isReviewAuthor} = require('../middelware');
const reviews = require('../controllers/review');

router.post('/',isLoggedIn, catchAsync(reviews.reviewcreate))
router.delete('/:reviewId',isLoggedIn, isReviewAuthor , catchAsync(reviews.deletereview))

module.exports = router;