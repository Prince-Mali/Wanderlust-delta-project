const mongoose = require('mongoose');
const Listing = require('../models/listing');
const initData = require('./data');

main().then(() => {
    console.log("Connection successful.")
}).catch((err) => {
    console.log(err);
});

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
};

const initDb = async () => {
    await Listing.deleteMany({});
    initData.data.map((obj) => obj.owner = '66dd6b98969ba573ca23fd88');
    await Listing.insertMany(initData.data);
    console.log('Data was initialized!');
};

initDb();
