const express = require('express')
const router = express.Router()
const catchAsync = require('../utils/catchAsync');
const destinations = require('../controllers/destinations');

const Destination = require('../models/destination');

const {isLoggedIn, isAuthor, validateDestination} = require('../middleware');



router.get('/', catchAsync(destinations.index));

router.post('/', validateDestination, catchAsync(destinations.createDestination));



router.get('/new', isLoggedIn,  destinations.renderNewForm);

router.get('/:id', catchAsync(destinations.showDestination));

router.put('/:id', isLoggedIn, isAuthor,  validateDestination, catchAsync(destinations.updateDestination))

router.delete('/:id', isLoggedIn, isAuthor, catchAsync(destinations.deleteDestination))



router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(destinations.renderEditFormn))

module.exports = router;