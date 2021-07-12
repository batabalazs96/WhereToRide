const express = require('express');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError');
const path = require('path');
const mongoose = require('mongoose');
const { destinationSchema } = require('./schemas.js');
const {reviewSchema} = require('./schemas.js');
const Destination = require('./models/destination');
const Review = require('./models/reviews');
const methodOverride = require('method-override');
const { findByIdAndUpdate } = require('./models/destination');
const destinations = require('./routes/destinations');
const reviews = require('./routes/reviews');
const session = require('express-session');

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
app.use(express.static(path.join(__dirname, 'public')))


const sessionConfig = {
    secret : 'thisshouldbeabettersecret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 *7,
        maxAge: 1000 * 60 * 60 * 24 *7
    }
}
app.use(session(sessionConfig))

app.use('/destinations', destinations)
app.use('/destinations/:id/reviews', reviews)


app.get('/', (req, res) => {
    res.render('home')
})




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