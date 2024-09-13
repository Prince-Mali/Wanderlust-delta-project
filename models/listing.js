const { ref, required } = require("joi");
const mongoose = require("mongoose");
const Review = require("./review");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  title : {
    type : String,
    required : true
  },
  description : {
    type : String,
  },
  image : {
    url : String,
    filename : String
  },
  price : {
    type : Number
  },
  location : {
    type : String
  },
  country : {
    type : String
  },
  reviews : [
    {
      type : Schema.Types.ObjectId,
      ref : 'Review'
    }
  ],
  owner : {
    type : Schema.Types.ObjectId,
    ref : 'User'
  },
  cordinates : {
    latitude : {
      type : Number,
      required : true
    },
    longitude : {
      type : Number,
      required : true
    }
  },
  category : {
    type : String,
    enum : ['Trending','Rooms','Iconic cities', 'Mountains', 'Castels', 'Amazing pools', 'Camping', 'Farms', 'Arctic', 'Beachfront'],
    required : true
  }
});

listingSchema.post('findOneAndDelete', async (listing,next) => {
  if(listing.reviews.length) {
    await Review.deleteMany({_id : {$in : listing.reviews}});
  } else {
    next();
  }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
