const User = require("../models/User");
const passport = require("passport");

exports.passportAuth = (req, res, next) => {
    // CHANGE: USE "createStrategy" INSTEAD OF "authenticate"
    passport.use(User.createStrategy());
    // use static serialize and deserialize of model for passport session support
    passport.serializeUser(User.serializeUser());
    passport.deserializeUser(User.deserializeUser());

    next();
};
