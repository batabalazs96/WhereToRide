const express = require('express')
const router = express.Router()
const catchAsync = require('../utils/catchAsync');

const Destination = require('../models/destination');

const {isLoggedIn, isAuthor, validateDestination} = require('../middleware');



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
    const destination = await Destination.findById(req.params.id).populate({
        path: 'reviews',
        populate: {path: 'author'}   
    }).populate('author');
    if(!destination){
        req.flash('error', 'Cannot find the destination!')
        return res.redirect('/destinations')
    }
    
    res.render('destinations/show', { destination });
}))

router.put('/:id', isLoggedIn, isAuthor,  validateDestination, catchAsync(async (req, res) => {
    const {id} = req.params;
    const destination = await Destination.findById(id, {...req.body.destination});
    //const destination = await Destination.findByIdAndUpdate(id, req.body.destination);
    req.flash('success', 'Successfully deleted destination');
    res.redirect(`/destinations/${destination._id}`);
}))

router.delete('/:id', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    await Destination.findByIdAndDelete(req.params.id);
    req.flash('success', 'Successfully deleted destination');
    res.redirect('/destinations');
}))



router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const {id} = req.params;
    const destination = await Destination.findById(id)
    if(!destination){
        req.flash('error', 'Cannot find the destination what you want edit!')
        return res.redirect('/destinations')
    }
    
    res.render('destinations/edit', { destination });
}))

module.exports = router;