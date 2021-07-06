const express = require('express');
const ejsMate = require('ejs-mate');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const path = require('path');
const mongoose = require('mongoose');
const { destinationSchema } = require('./schemas.js');
const {reviewSchema} = require('./schemas.js');
const Destination = require('./models/destination');
const Review = require('./models/reviews');
const methodOverride = require('method-override');
const { findByIdAndUpdate } = require('./models/destination');

mongoose.connect('mongodb://localhost:27017/WhereToRide', { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log("Database connected")
});

const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

const validateDestination = (req, res, next) => {
    const { error } = destinationSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

const validateReview = (req, res, next) => {
    const {error} = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

app.get('/', (req, res) => {
    res.render('home')
})

app.get('/destinations', catchAsync(async (req, res) => {
    const destinations = await Destination.find();
    res.render('destinations/index', { destinations });
}))

app.post('/destinations', validateDestination, catchAsync(async (req, res, next) => {
    const destination = new Destination(req.body.destination);
    await destination.save();
    res.redirect('/destinations')

}))



app.get('/destinations/new', (req, res) => {
    res.render('destinations/new')
})

app.get('/destinations/:id', catchAsync(async (req, res) => {
    const destination = await Destination.findById(req.params.id).populate('reviews');
    res.render('destinations/show', { destination });
}))

app.put('/destinations/:id', validateDestination, catchAsync(async (req, res) => {
    const destination = await Destination.findByIdAndUpdate(req.params.id, req.body.destination);
    res.redirect(`/destinations/${destination._id}`);
}))

app.delete('/destinations/:id', catchAsync(async (req, res) => {
    await Destination.findByIdAndDelete(req.params.id)
    res.redirect('/destinations')
}))



app.get('/destinations/:id/edit', catchAsync(async (req, res) => {
    const destination = await Destination.findById(req.params.id)
    res.render('destinations/edit', { destination });
}))

app.post('/destinations/:id/reviews',  validateReview, catchAsync(async (req,res) => {
    const destination = await Destination.findById(req.params.id);
    const review = new Review(req.body.review);
    destination.reviews.push(review);
    await review.save();
    await destination.save();
    res.redirect(`/destinations/${destination._id}`);


}))

app.delete('/destinations/:id/reviews/:reviewId', catchAsync(async(req,res)=>{
    const {id, reviewId} = req.params;
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/destinations/${id}`);
}))

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = "Oh no, Something wrong!"
    res.status(statusCode).render('error', { err })
})

app.listen(3000, () => {
    console.log('Server is running...');
})