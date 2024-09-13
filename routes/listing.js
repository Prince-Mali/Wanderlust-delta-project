const express = require('express');
const Router = express.Router();
const wrapAsync = require('../utils/wrapAsync');
const { isLoggedIn, isOwner, validateListing } = require('../middleware');
const listingControllers = require('../controllers/listings');
const multer = require('multer');
const {storage} = require('../CloudConfig');
const upload = multer({storage});

// New route --
Router.get('/new', isLoggedIn, listingControllers.newListingForm);

// search listing --
Router.post('/country', wrapAsync(listingControllers.search));

// filter listings--
Router.get('/filter/:category', wrapAsync(listingControllers.filter));

// "/" route --
Router.route("/")
.get(wrapAsync(listingControllers.index))
.post(isLoggedIn, upload.single('listing[image]'), validateListing, wrapAsync(listingControllers.createListing));

// "/:id" route ---
Router.route("/:id")
.get(wrapAsync(listingControllers.showListing))
.put(isLoggedIn, isOwner, upload.single('listing[image]'), validateListing, wrapAsync(listingControllers.updateListing))
.delete(isLoggedIn, isOwner, wrapAsync(listingControllers.destroyListing));

// Edit route --
Router.get('/:id/edit', isLoggedIn, isOwner, wrapAsync(listingControllers.editListing));

module.exports = Router;
