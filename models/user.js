const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Define our model (Email Unique)
const userSchema = new Schema({
    email: { type: String, unique: true, lowercase: true },
    password: String
});

//Create Model Class
const ModelClass = mongoose.model('user', userSchema);

//Export the model
module.exports = ModelClass;