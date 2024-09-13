const Listing = require('./models/listing');
const Review = require('./models/review');
const { listingSchema, reviewSchema } = require('./schema');
const ExpressError = require('./utils/ExpressError');

module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash('error', 'You must be logged in!');
        res.redirect('/login');
    } else {
        next();
    };
};

module.exports.saveRedirectUrl = (req, res, next) => {
    if(req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner._id.equals(req.user._id)) {
        req.flash('error', "You don't have access to this listing!");
        res.redirect(`/listings/${ id }`);
    } else {
        next();
    }
};


module.exports.validateListing = (req,res,next) => {
    const { error } = listingSchema.validate(req.body);
    if(error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400,errMsg);
    } else {
        next();
    }
};

module.exports.isReviewAuthor = async (req, res, next) => {
    let { id ,review_id } = req.params;
    let review = await Review.findById(review_id);
    if(!review.author._id.equals(req.user._id)) {
        req.flash('error', "You aren't author of this review!");
        res.redirect(`/listings/${ id }`);
    } else {
        next();
    }
};

module.exports.validateReview = (req,res,next) => {
    const { error } = reviewSchema.validate(req.body);
    if(error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400,errMsg);
    } else {
        next();
    }
};