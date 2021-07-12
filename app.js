if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

console.log(process.env.CLOUDINARY_CLOUD_NAME)

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
const destinationRoutes = require('./routes/destinations');
const reviewRoutes = require('./routes/reviews');
const userRoutes = require('./routes/users');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy= require('passport-local');
const User= require('./models/user')


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

if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}


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
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next)=> {
    console.log(req.session);
    res.locals.success= req.flash('success');
    res.locals.error= req.flash('error');
    res.locals.currentUser = req.user;
    next();
})

app.get('/fakeUser', async(req, res) => {
    const user = new User({email: 'bataa@gmail.com', username: 'bata'})
    const newUser = await User.register(user, 'chicken');
    res.send(newUser);
})

app.use('/', userRoutes);
app.use('/destinations', destinationRoutes);
app.use('/destinations/:id/reviews', reviewRoutes);



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