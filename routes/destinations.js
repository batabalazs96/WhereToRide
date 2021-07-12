const express = require('express')
const router = express.Router()
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Destination = require('../models/destination');
const {destinationSchema} = require('../schemas.js');
const {isLoggedIn} = require('../middleware');

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
    destination.author = req.user._id;
    await destination.save();
    req.flash('success', 'Succesfully made a new destination!');
    res.redirect('/destinations');

}))



router.get('/new', isLoggedIn,  (req, res) => {
    res.render('destinations/new')
})

router.get('/:id', catchAsync(async (req, res) => {
    const destination = await Destination.findById(req.params.id).populate('reviews').populate('author');
    if(!destination){
        req.flash('error', 'Cannot find the destination!')
        return res.redirect('/destinations')
    }
    res.render('destinations/show', { destination });
}))

router.put('/:id', isLoggedIn, validateDestination, catchAsync(async (req, res) => {
    const destination = await Destination.findByIdAndUpdate(req.params.id, req.body.destination);
    res.redirect(`/destinations/${destination._id}`);
}))

router.delete('/:id', isLoggedIn, catchAsync(async (req, res) => {
    await Destination.findByIdAndDelete(req.params.id);
    req.flash('success', 'Successfully deleted destination');
    res.redirect('/destinations');
}))



router.get('/:id/edit', isLoggedIn, catchAsync(async (req, res) => {
    const destination = await Destination.findById(req.params.id)
    if(!destination){
        req.flash('error', 'Cannot find the destination what you want edit!')
        return res.redirect('/destinations')
    }
    res.render('destinations/edit', { destination });
}))

module.exports = router;