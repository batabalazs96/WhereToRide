const ExpressError = require('./utils/ExpressError');
const {destinationSchema} = require('./schemas.js');
const Destination = require('./models/destination');
const {reviewSchema} = require('./schemas.js');

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/login');
    }
    next();
}

module.exports.validateDestination = (req, res, next) => {
    const { error } = destinationSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

module.exports.isAuthor = async ( req, res, next) =>{
    const {id} = req.params;
    const destination = await Destination.findById(id);
    if( !destination.author.equals(req.user._id)){
        req.flash('error', 'You not have premission to do that');
        return res.redirect(`/destinations/${id}`);
    }
    next();
}

module.exports.validateReview = (req, res, next) => {
    const {error} = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}
