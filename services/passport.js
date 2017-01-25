const passport = require('passport');
const User = require('../models/user');
const config = require('../config');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

//Setup options for JWT strategy

//Strategies are just plugins to passport
// e.g: passport-jwt, passport-google-auth, passport-twitter-auth etc.

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    secretOrKey: config.secret
};

//Create JWT strategy
const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done) {
    // Payload is JWT token payload (sub and iat property it will have)
    // See if user id in payload exists in db
    // If it does, call done with that other
    // otherwise, call done without User obj
    User.findById(payload.sub, function(err, user) {
        if (err) { return done(err, false); }
        if (user) {
            done(null, user);
        } else {
            //Couldnt find user in DB
            done(null, false);
        }
    })

})

// Tell passport to use this strategy
passport.use(jwtLogin);