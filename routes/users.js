const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');
const passport = require('passport');
const users = require('../controllers/users');


router.get('/register', users.registerFrom)

router.post('/register', catchAsync(users.registration))

router.get('/login', users.renderLogin)

router.post('/login', passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}),)

router.get('/logout', )

module.exports= router;
