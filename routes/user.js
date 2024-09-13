const express = require('express');
const Router = express.Router();
const User = require('../models/user');
const wrapAsync = require('../utils/wrapAsync');
const passport = require('passport');
const { saveRedirectUrl } = require('../middleware');
const userController = require('../controllers/users');


// signup route --
Router.route('/signup')
.get(userController.renderSignupPage)
.post(wrapAsync(userController.signup));

// login route --
Router.route('/login')
.get(userController.renderLoginPage)
.post(saveRedirectUrl, passport.authenticate('local', {failureRedirect : '/login', failureFlash : true}), wrapAsync(userController.login));

// User logout --
Router.get('/logout', wrapAsync(userController.logout));

module.exports = Router;
