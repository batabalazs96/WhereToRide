// if (process.env.NODE_ENV !== "production") {
//     require('dotenv').config();
// }
require('dotenv').config();

const mongoSanitize = require('express-mongo-sanitize');
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
const User= require('./models/user');
const helmet= require('helmet');
const dbUrl = process.env.DB_URL;
const MongoStore = require('connect-mongo');

//'mongodb://localhost:27017/WhereToRide'
mongoose.connect(dbUrl ||  'mongodb://localhost:27017/WhereToRide', { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log("Database connected")
});

const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))
console.log("macseka");

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname, 'public')))
app.use(mongoSanitize());
app.use(helmet());

const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
];
const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",
];
const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/diavkvh4w/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);

const secret = process.env.SECRET || 'thisshouldbeabettersecret!';

if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}
const store =  MongoStore.create({
    mongoUrl: dbUrl,
    secret,
    touchAfter: 24 * 3600
  })


const sessionConfig = {
    store,
    name: 'blah',
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure: true,
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

console.log("macsek")

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running...${port}`);
})