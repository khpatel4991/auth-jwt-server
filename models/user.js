const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

//Define our model (Email Unique)
const userSchema = new Schema({
    email: { type: String, unique: true, lowercase: true },
    password: String
});

//On Save hook, encrypt password
//Before saving model, run this func
userSchema.pre('save', function(next) {
    //get access to user obj that is being saved
    const user = this;

    //Generate a salt (appends salt)
    bcrypt.genSalt(10, function(err, salt) {
        if (err) { return next(err); }

        //Encrypt pass with salt generated
        bcrypt.hash(user.password, salt, null, function (err, hash) {
            if (err) { return next(err); }

            //Overwrite plain pass to encrypted pass
            user.password = hash;
            next();
        })
    });

});


//Create Model Class
const ModelClass = mongoose.model('user', userSchema);

//Export the model
module.exports = ModelClass;