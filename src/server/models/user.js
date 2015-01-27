var mongoose = require("mongoose");
var userSchema = mongoose.Schema({
    username: { type: String, unique: true, required: true, index: true },
    display_name: { type: String, required: true },
    description: String,
    created_at: { type: Date, default: Date.now },
    blogs: [mongoose.Schema.Types.ObjectId]
});

exports = mongoose.model('User', userSchema);