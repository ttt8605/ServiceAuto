const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    role: {
        type: String,
        enum: ['mechanic', 'manager'],
        required: true,
    }
});
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User",userSchema)
