const express = require('express');
const campground = require('../models/campground');
const router = express.Router({ mergeParams: true });
const CampGround = require('../models/campground');
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const { isLoggedIn, isAuthor } = require('../middelware')
const campgrounds = require('../controllers/campground');
const multer = require('multer')
const { storage } = require('../cloudinary/index');
const upload = multer({ storage });
// const { body, validationResult } = require('express-validator');



router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn, upload.array('img'), catchAsync(campgrounds.createcamp));

router.get('/new', isLoggedIn, campgrounds.newcamp);

router.route('/:id')
    .get(catchAsync(campgrounds.view))
    .put(isLoggedIn, isAuthor, upload.array('img'), catchAsync(campgrounds.updateCampground))
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deletecamp));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.edit));




module.exports = router;
