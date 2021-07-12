const express = require('express')
const router = express.Router()
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Destination = require('../models/destination');
const {destinationSchema} = require('../schemas.js');

const validateDestination = (req, res, next) => {
    const { error } = destinationSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

router.get('/', catchAsync(async (req, res) => {
    const destinations = await Destination.find();
    res.render('destinations/index', { destinations });
}))

router.post('/', validateDestination, catchAsync(async (req, res, next) => {
    const destination = new Destination(req.body.destination);
    await destination.save();
    req.flash('success', 'Succesfully made a new destination!');
    res.redirect('/destinations');

}))



router.get('/new', (req, res) => {
    res.render('destinations/new')
})

router.get('/:id', catchAsync(async (req, res) => {
    const destination = await Destination.findById(req.params.id).populate('reviews');
    res.render('destinations/show', { destination });
}))

router.put('/:id', validateDestination, catchAsync(async (req, res) => {
    const destination = await Destination.findByIdAndUpdate(req.params.id, req.body.destination);
    res.redirect(`/destinations/${destination._id}`);
}))

router.delete('/:id', catchAsync(async (req, res) => {
    await Destination.findByIdAndDelete(req.params.id)
    res.redirect('/destinations')
}))



router.get('/:id/edit', catchAsync(async (req, res) => {
    const destination = await Destination.findById(req.params.id)
    res.render('destinations/edit', { destination });
}))

module.exports = router;