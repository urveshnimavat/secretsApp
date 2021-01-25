const GoogleStrategy = require('passport-google-oauth20').Strategy;
const passport = require("passport");
const User = require('../models/User');

exports.googleAuth = (req, res, next)=> {
    passport.use(new GoogleStrategy({
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: "http://localhost:3000/auth/google/secrets",
        userProfileURL:  "https://www.googleapis.com/oauth2/v3/userinfo"
      },
      function (accessToken, refreshToken, profile, cb) {
        User.findOrCreate(
          { username: profile.id },
          {
            provider: "google",
            email: profile._json.email
          },
          function (err, user) {
              return cb(err, user);
          }
        );
    }
    ));
    next();
}
