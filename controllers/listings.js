const { query } = require('express');
const Listing = require('../models/listing');
const NodeGeocoder = require('node-geocoder');
const mapToken = process.env.MAP_TOKEN;

var options = {
    provider: 'tomtom',
    httpAdapter: 'https', // Default
    apiKey: mapToken, // for Mapquest, OpenCage, Google Premier
    formatter: null // 'gpx', 'string', ...
};

const geocoder = NodeGeocoder(options);


module.exports.index = async (req, res) => {
    const listings = await Listing.find();
    res.render('./listings/index', { listings });
};

module.exports.search = async(req, res) => {
    let { country } = req.body;
    const listings = await Listing.find({country : country});
    if(listings.length) {
        res.render('./listings/index', { listings });
    } else {
        req.flash('error', 'No listings in selected location');
        res.redirect('/listings');
    }
};

module.exports.filter = async(req, res) => {
    let { category } = req.params;
    const listings = await Listing.find({category : category});
    if(listings.length) {
        res.render('./listings/index', { listings });
    } else {
        req.flash('error', 'No listings in this category!');
        res.redirect('/listings');
    }
};

module.exports.newListingForm = (req, res) => {
    res.render('./listings/new');
};

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({path : 'reviews', populate : {path : 'author'}}).populate('owner');
    if(!listing) {
        req.flash('error', "Listing doesn't exist!");
        res.redirect('/listings');
    } else {
        res.render('./listings/show', { listing });
    }
};

module.exports.createListing = async (req, res, next) => {
    let { listing } = req.body;
    // console.log(listing);
    let response = await geocoder.geocode(listing.location);
    listing.cordinates = response[0];
    listing.image = {
        url : req.file.path,
        filename : req.file.filename
    };
    listing.owner = req.user._id;
    await Listing.create(listing);
    req.flash('success', 'New Listing created!');
    res.redirect('/listings');
};

module.exports.editListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing) {
        req.flash('error', "Listing doesn't exist!");
        res.redirect('/listings');
    }
    let newImageUrl = listing.image.url.replace('/upload','/upload/h_200,w_200/bo_5px_solid_lightblue/');
    listing.image.url = newImageUrl;
    res.render('./listings/edit', { listing });
};

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    let response = await geocoder.geocode(req.body.listing.location);
    req.body.listing.cordinates = response[0];
    let newListing = await Listing.findByIdAndUpdate(id , req.body.listing);
    if(typeof req.file !== 'undefined') {
        newListing.image = {
            url : req.file.path,
            filename : req.file.filename
        };
        await newListing.save();
    };
    req.flash('success', 'Listing Updated!');
    res.redirect(`/listings/${ id }`);
};

module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash('success', 'Listing deleted!');
    res.redirect('/listings');
};
