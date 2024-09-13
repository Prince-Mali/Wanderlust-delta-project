const express = require('express');
const Router = express.Router({ mergeParams : true });
const wrapAsync = require('../utils/wrapAsync');
const { isLoggedIn, validateReview, isReviewAuthor } = require('../middleware');
const reviewController = require('../controllers/reviews');


// Create review route --
Router.post('/', isLoggedIn, validateReview, wrapAsync(reviewController.createReview));

// Delete review route --
Router.delete('/:review_id', isLoggedIn, isReviewAuthor, wrapAsync(reviewController.destroyReview));

module.exports = Router;
