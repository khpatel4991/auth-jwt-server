const passport = require('passport');
const User = require('../models/user');
const config = require('../config');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');

//Create local Strategy
const localOptions = { usernameField: 'email' };
const localLogin = new LocalStrategy(localOptions, function(email, password, done) {
    // Verify username and password
    // If corerct call done with user
    // else call done with false
    User.findOne({ email: email }, function(err, user) {
        if (err) { return done(err); }
        if (!user) { return done(null, false) }

        //Compare password with req password and password in db

        //Pass in DB == Salt + Plain_password
        //Compare Pass in DB with Salt + Submitted Pass 
        //Added method in userModel called comparepassword for it

        user.comparePassword(password, function(err, isMatch) {
            if (err) { return done(err); }
            if(!isMatch) { return done(null, false) };
            return done(null, user);
        })

    })

});

//Setup options for JWT strategy

//Strategies are just plugins to passport
// e.g: passport-jwt, passport-google-auth, passport-twitter-auth etc.
// e.g: passport-local: using email and password

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
passport.use(localLogin);