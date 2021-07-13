const express = require('express')
const router = express.Router()
const catchAsync = require('../utils/catchAsync');
const destinations = require('../controllers/destinations');
const multer  = require('multer')
const {storage} = require('../cloudinary');
const upload = multer({ storage })


const Destination = require('../models/destination');

const {isLoggedIn, isAuthor, validateDestination} = require('../middleware');


router.route('/')
    .get(catchAsync(destinations.index))
    .post(isLoggedIn,  upload.array('image'), validateDestination, catchAsync(destinations.createDestination))
    // .post(upload.array('image'), (req, res) =>{
    //     console.log(req.body, req.files);
    //     res.send('it worked')
    // })


router.get('/new', isLoggedIn,  destinations.renderNewForm);

router.route('/:id')
    .get(catchAsync(destinations.showDestination))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateDestination, catchAsync(destinations.updateDestination))
    .delete(isLoggedIn, isAuthor, catchAsync(destinations.deleteDestination));



router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(destinations.renderEditForm))

module.exports = router;