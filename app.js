if(process.env.Node_ENV  != 'production') {
    require('dotenv').config();
};

const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const listingRoute = require('./routes/listing');
const reviewRoute = require('./routes/review');
const userRoute = require('./routes/user');
const User = require('./models/user');
const ExpressError = require('./utils/ExpressError');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const { register } = require('module');

// const { title } = require('process');
// const exp = require('constants');

const dbUrl = process.env.ATLAS_DB_URL;

main().then(() => { console.log('Connection successful to DB!')});

async function main() {
    await mongoose.connect(dbUrl);
};

app.set(express.json());
app.use(express.urlencoded({ extended : true }));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine('ejs', ejsMate);

app.use(express.static(path.join(__dirname, "/public")));

app.use(methodOverride("_method"));
app.use(cookieParser());

// session ---

const store = MongoStore.create({
    mongoUrl : dbUrl,
    crypto : {
        secret : process.env.SECRET
    },
    touchAfter : 24*3600 
});

store.on('error', () => {
    console.log('Error in Mongo Session Url', err);
});

const sessionOptions = {
    store : store,
    secret : process.env.SECRET,
    resave : false,
    saveUninitialized : true,
    cookie : {
        expires : Date() + 7 * 24 * 60 * 60 * 1000,
        maxAge : 7 * 24 * 60 * 60 * 1000,
        httpOnly : true
    }
};

app.use(session(sessionOptions));
app.use(flash());

// passport ---
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// flash messages ---
app.use((req,res,next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currentUser = req.user;
    next();
});

app.get('/', (req, res) => {
    res.redirect('/listings');
});

// userRoute ---
app.use('/', userRoute);

// ListingRoute --
app.use('/listings', listingRoute);

// ReviewRoute --
app.use('/listings/:id/reviews', reviewRoute);

// Error Handling middelware ---
app.all('*',(req,res,next) => {
    next(new ExpressError(404,"Page not Found!"));
});

app.use((err,req,res,next) => {
    let { status = 500,message = 'Something went wrong!'} = err;
    console.log(err);
    res.status(status).render('Error', { message });
});

// -----
const port = 3000;
app.listen(port, () => { console.log(`App is listening on port ${port}.`)});
