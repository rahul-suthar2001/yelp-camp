const express = require('express');
const router = express.Router({ mergeParams: true });
const User = require("../models/user");
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');
const users = require('../controllers/user');
router.route('/register')
    .get(users.register)
    .post(catchAsync(users.create));

router.route('/login')
    .get(users.loginform)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.login);


router.get('/logout', users.logout);

module.exports = router;
