const express = require('express')
const router = express.Router()
const catchAsync = require('../utils/catchAsync');
const destinations = require('../controllers/destinations');

const Destination = require('../models/destination');

const {isLoggedIn, isAuthor, validateDestination} = require('../middleware');


router.route('/')
    .get(catchAsync(destinations.index))
    .post(validateDestination, catchAsync(destinations.createDestination))



router.get('/new', isLoggedIn,  destinations.renderNewForm);

router.route('/:id')
    .get(catchAsync(destinations.showDestination))
    .put(isLoggedIn, isAuthor,  validateDestination, catchAsync(destinations.updateDestination))
    .delete(isLoggedIn, isAuthor, catchAsync(destinations.deleteDestination));



router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(destinations.renderEditFormn))

module.exports = router;