/* A mongoose model for the users. */

var mongoose = require("mongoose");

var userSchema = mongoose.Schema({
    username: { type: String, unique: true, required: true, index: true },
    // todo: Store password hashes instead of PLAIN TEXT.
    password: { type: String, required: true },
    email: { type: String, required: true },
    token: { type: String },
    display_name: { type: String, required: true },
    description: String,
    created_at: { type: Date, default: Date.now },
    blogs: [ { type: mongoose.Schema.Types.ObjectId, ref: 'Blog' } ],
    blogs_followed: [ { type: mongoose.Schema.Types.ObjectId, ref: 'Blog' } ],
    profile_picture: { type: String, default: 'default.png' }

});

module.exports = mongoose.model('User', userSchema);
