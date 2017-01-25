const jwt = require('jwt-simple');
const User = require('../models/user');
const config = require('../config');


function tokenForUser(user) {
    //JWT needs to have these two props
    // Always: JWT has sub(subject) prop
    // Always: iat: Issued at Time prop

    const timestamp = new Date().getTime();
    return jwt.encode({ sub: user.id, iat: timestamp }, config.secret);
}

exports.signup = function(req, res, next) {

    const email = req.body.email;
    const password = req.body.password;
    console.log(req.body);

    if (!email || !password) {
        //Check email and password validations here
        return res.status(422).send({ error: 'Please enter email and password' });
    }

    //See if a user with given email exists
    User.findOne({ email: email }, function(err, existingUser) {
        if (err) { return next(err); }
        
        //If user with email exist, return an error
        if (existingUser) {
            return res.status(422).send({ error: 'Email is in use' });
        }

    });

    //IF user with email doesn't exist, create and save user
    const user = new User({
        email: email,
        password: password
    });

    //respond with success if it worked
    user.save(function(err) {
        if (err) { return next(err); }

        res.json({ token: tokenForUser(user) });

    });

};