const Review = require('../models/review');
const Listing = require('../models/listing');

module.exports.createReview = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    let { review } = req.body;
    let newReview = new Review(review);
    newReview.author = req.user._id;

    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash('success', 'review added!');
    res.redirect(`/listings/${id}`);
};

module.exports.destroyReview = async (req, res) => {
    let { id, review_id } = req.params;
    await Listing.findByIdAndUpdate(id , {$pull : {reviews : review_id}});
    await Review.findByIdAndDelete(review_id);
    req.flash('success', 'review deleted!');
    res.redirect(`/listings/${id}`);
};
