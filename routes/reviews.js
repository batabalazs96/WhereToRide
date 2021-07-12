const express = require('express')
const router = express.Router({mergeParams:true})
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Destination = require('../models/destination');
const Review = require('../models/reviews');
const {isLoggedIn, isAuthor, validateReview, isReviewAuthor} = require('../middleware');




router.post('/', isLoggedIn, validateReview, catchAsync(async (req,res) => {
    const destination = await Destination.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    destination.reviews.push(review);
    await review.save();
    await destination.save();
    req.flash('success', 'Created a review')
    res.redirect(`/destinations/${destination._id}`);


}))

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(async(req,res)=>{
    const {id, reviewId} = req.params;
    await Destination.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted review');
    res.redirect(`/destinations/${id}`);
}))


module.exports = router;