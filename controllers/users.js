const User = require('../models/user');

module.exports.renderSignupPage = (req, res) => {
    res.render('./users/signup');
};

module.exports.signup = async (req, res, next) => {
    try {
        let { username, email, password } = req.body;
        let newUser = new User({
            username : username,
            email : email
        });
        let registeredUser = await User.register(newUser, password);
        req.login(registeredUser,(err) => {
            if(err) {
                return next(err);
            } else {
                req.flash('success', 'User registerd successfully.');
                res.redirect('/listings');
            }
        });
    } catch (error) {
        req.flash('error', error.message);
        res.redirect('/signup');
    };
};

module.exports.renderLoginPage = (req,res) => {
    res.render('./users/login');
};

module.exports.login = async (req, res) => {
    req.flash('success','Welcome back to wanderlust!');
    let redirectUrl = res.locals.redirectUrl || '/listings';
    res.redirect(redirectUrl);
};

module.exports.logout = async(req, res, next) => {
    req.logout((err) => {
        if(err) {
            return next(err);
        } else {
            req.flash('success', 'You logged out!');
            res.redirect('/listings');
        }
    });
};
